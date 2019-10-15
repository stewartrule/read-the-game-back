import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as faker from 'faker/locale/de';
import { Repository } from 'typeorm';

import { Game } from '../game/game.entity';
import { Player } from '../player/player.entity';
import { Shot } from '../shot/shot.entity';
import { ShotType } from '../shot-type/shot-type.entity';
import { Team } from '../team/team.entity';
import { mapParallel, mapSeq, range, chance } from './util';

@Injectable()
export class Seed {
  constructor(
    @InjectRepository(Game)
    private readonly gameRepository: Repository<Game>,

    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>,

    @InjectRepository(Shot)
    private readonly shotRepository: Repository<Shot>,

    @InjectRepository(ShotType)
    private readonly shotTypeRepository: Repository<ShotType>,

    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
  ) {}

  async run() {
    const teamNames = [
      'Dortmund',
      'Mönchengladbach',
      'Eintracht Frankfurt',
      'FC Augsburg',
      'FC Bayern München',
      'FC Ingolstadt 04',
      'FC Schalke 04',
      'RB Leipzig',
      'Hamburger SV',
    ];

    const teams = await mapSeq(teamNames, async teamName => {
      const team = new Team();
      team.name = teamName;
      team.abbr = teamName
        .replace('FC ', '')
        .replace('RB ', '')
        .substr(0, 3)
        .toUpperCase();
      await this.teamRepository.save(team);
      return team;
    });

    console.log('did teams');

    await mapParallel(teams, async team => {
      return await mapParallel(range(0, 11), async index => {
        console.log('did player', index);

        const player = new Player();
        player.dob = faker.date.between('1997-01-01', '2001-12-31');
        player.height = 164 + Math.round(Math.random() * 28);

        const base = 38;
        const strength = Math.round(Math.random() * base);
        const rest = base - strength;
        const stamina = Math.round(Math.random() * rest);
        const balance = base - stamina;

        player.strength = base + strength;
        player.stamina = base + stamina;
        player.balance = base + balance;

        player.firstName = faker.name.firstName(1);
        player.lastName = faker.name.lastName();
        player.team = team;
        await this.playerRepository.save(player);
        return player;
      });
    });

    await mapParallel(teams.slice(1), async (awayTeam, index) => {
      const start = new Date();
      start.setDate(start.getDate() + index);
      start.setHours(20, 0, 0, 0);

      const homeTeam = teams[index];
      const game = new Game();
      game.name = `${homeTeam.abbr} - ${awayTeam.abbr}`;
      game.start = start;

      game.awayTeam = awayTeam;
      game.homeTeam = homeTeam;

      await this.gameRepository.save(game);
      return game;
    });

    console.log('did games');

    const games = await this.gameRepository.find({
      relations: [
        // 'homeTeam',
        // 'homeTeam.players',
        // 'awayTeam',
        // 'awayTeam.players',
      ],
    });

    const shotType = new ShotType();
    shotType.name = 'Stift';
    await this.shotTypeRepository.save(shotType);

    const seedShots = (game: Game, team: Team) => {
      console.log('game shots');

      return mapParallel(team.players, async player => {
        const shot = new Shot();
        console.log('shot');
        const onTarget = chance(0.7);

        shot.player = player;
        shot.game = game;
        shot.time = game.start;
        shot.onTarget = onTarget;
        shot.type = shotType;

        shot.hit = onTarget ? chance(0.5) : false;
        shot.out = onTarget ? false : chance(0.5);
        shot.x = Math.floor(Math.random() * 120);
        shot.y = Math.floor(Math.random() * 90);
        return this.shotRepository.save(shot);
      });
    };

    await mapParallel(games, async game => {
      await seedShots(game, game.homeTeam);
    });

    await mapParallel(games, async game => {
      await seedShots(game, game.awayTeam);
    });
  }
}
