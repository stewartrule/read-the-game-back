import * as faker from 'faker';
import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Game } from '../game/game.entity';
import { Intercept } from '../intercept/intercept.entity';
import { PassType } from '../pass-type/pass-type.entity';
import { Pass } from '../pass/pass.entity';
import { Player } from '../player/player.entity';
import { ShotType } from '../shot-type/shot-type.entity';
import { Shot } from '../shot/shot.entity';
import { Team } from '../team/team.entity';
import {
  chance,
  mapParallel,
  mapSeq,
  minutes,
  range,
  sample,
} from './util';

@Service()
export class Seed {
  constructor(
    @InjectRepository(Game)
    private readonly gameRepository: Repository<Game>,

    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>,

    @InjectRepository(Pass)
    private readonly passRepository: Repository<Pass>,

    @InjectRepository(PassType)
    private readonly passTypeRepository: Repository<PassType>,

    @InjectRepository(Shot)
    private readonly shotRepository: Repository<Shot>,

    @InjectRepository(ShotType)
    private readonly shotTypeRepository: Repository<ShotType>,

    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,

    @InjectRepository(Intercept)
    private readonly interceptRepository: Repository<Intercept>,
  ) {}

  async run() {
    const teamNames = [
      'Dortmund',
      'Eintracht Frankfurt',
      'FC Augsburg',
      'FC Bayern München',
      'FC Ingolstadt 04',
      'FC Schalke 04',
      'Hamburger SV',
      'Hindenburg Allenstein',
      'Mönchengladbach',
      'RB Leipzig',
      'Stettiner SC',
      'Werder Bremen',
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

    await mapParallel(teams, async team => {
      return await mapParallel(range(0, 11), async index => {
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

      const stop = new Date();
      stop.setDate(stop.getDate() + index);
      stop.setHours(20, 45, 0, 0);

      const homeTeam = teams[index];
      const game = new Game();
      game.name = `${homeTeam.abbr} - ${awayTeam.abbr}`;
      game.start = start;
      game.stop = stop;

      game.awayTeam = awayTeam;
      game.homeTeam = homeTeam;

      await this.gameRepository.save(game);
      return game;
    });

    const games = await this.gameRepository.find({
      relations: [],
    });

    const shotTypes = await mapParallel(
      ['Standard', 'Straight', 'Inside', 'Chip', 'Bending'],
      async name => {
        const shotType = new ShotType();
        shotType.name = name;
        await this.shotTypeRepository.save(shotType);
        return shotType;
      },
    );

    const seedShots = (game: Game, team: Team) => {
      return mapParallel(team.players, async player => {
        return mapParallel(
          range(0, Math.round(Math.random() * 2)),
          async () => {
            const shot = new Shot();

            shot.game = game;
            shot.fromTeam = Promise.resolve(team);
            shot.fromPlayer = Promise.resolve(player);
            shot.shotType = sample(shotTypes);

            shot.time = new Date(game.start.valueOf() + minutes(45));

            const onTarget = chance(0.5);
            shot.onTarget = onTarget;
            shot.hit = onTarget ? chance(0.6) : false;
            shot.out = onTarget ? false : chance(0.5);
            shot.x = Math.floor(Math.random() * 120);
            shot.y = Math.floor(Math.random() * 90);
            return this.shotRepository.save(shot);
          },
        );
      });
    };

    const passTypes = await mapParallel(
      ['Push', 'Long', 'Backward', 'Piercing', 'Wall'],
      async name => {
        const passType = new PassType();
        passType.name = name;
        await this.passTypeRepository.save(passType);
        return passType;
      },
    );

    const seedPasses = (game: Game, team: Team) => {
      return mapParallel(team.players, async player => {
        return mapParallel(
          range(0, Math.round(Math.random() * 5)),
          async () => {
            const pass = new Pass();

            const toPlayer = sample(
              team.players.filter(({ id }) => id !== player.id),
            );

            pass.fromPlayer = player;
            pass.toPlayer = toPlayer;
            pass.game = game;
            pass.fromTeam = team;
            pass.passType = sample(passTypes);

            pass.time = new Date(game.start.valueOf() + minutes(45));

            pass.x = Math.floor(Math.random() * 120);
            pass.y = Math.floor(Math.random() * 90);
            return this.passRepository.save(pass);
          },
        );
      });
    };

    const seedIntercepts = (
      game: Game,
      team: Team,
      otherTeam: Team,
    ) => {
      return mapParallel(team.players, async player => {
        return mapParallel(
          range(0, Math.round(Math.random() * 5)),
          async () => {
            const intercept = new Intercept();

            const toPlayer = sample(otherTeam.players);

            intercept.game = game;
            intercept.fromPlayer = player;
            intercept.fromTeam = team;
            intercept.toPlayer = toPlayer;
            intercept.toTeamId = toPlayer.teamId;

            intercept.time = new Date(
              game.start.valueOf() + minutes(45),
            );

            intercept.x = Math.floor(Math.random() * 120);
            intercept.y = Math.floor(Math.random() * 90);

            return this.interceptRepository.save(intercept);
          },
        );
      });
    };

    const seedGameForTeam = async (
      game: Game,
      team: Team,
      otherTeam: Team,
    ) => {
      await seedShots(game, team);
      await seedPasses(game, team);
      await seedIntercepts(game, team, otherTeam);
    };

    await mapParallel(games, async game => {
      await seedGameForTeam(game, game.homeTeam, game.awayTeam);
      await seedGameForTeam(game, game.awayTeam, game.homeTeam);
    });
  }
}
