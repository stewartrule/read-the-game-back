import * as faker from 'faker';
import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Game } from '../game/game.entity';
import { Intercept } from '../intercept/intercept.entity';
import {
  PassType,
  PassTypeName,
} from '../pass-type/pass-type.entity';
import { Pass } from '../pass/pass.entity';
import { Player } from '../player/player.entity';
import {
  PositionType,
  PositionTypeName,
} from '../position-type/position-type.entity';
import { Position } from '../position/position.entity';
import { ShotType } from '../shot-type/shot-type.entity';
import { Shot } from '../shot/shot.entity';
import { Team } from '../team/team.entity';
import {
  chance,
  findOrFail,
  mapParallel,
  mapSeq,
  minutes,
  range,
  sample,
  shuffle,
} from './util';

type PlayerSetup = {
  type: PositionTypeName;
  playing: number;
  available: number;
  stamina: number;
  balance: number;
}[];

const spreadBy = (
  value: number,
  range: number,
  fluctuation: number,
) => {
  return (
    value * range + (fluctuation / 2 - Math.random() * fluctuation)
  );
};

function getPositionsByType(
  positions: Position[],
  types: PositionTypeName[],
) {
  return positions.filter(position =>
    types.includes(position.positionType.name),
  );
}

@Service()
export class Seed {
  constructor(
    @InjectRepository(Game)
    private readonly gameRepository: Repository<Game>,

    @InjectRepository(Intercept)
    private readonly interceptRepository: Repository<Intercept>,

    @InjectRepository(Pass)
    private readonly passRepository: Repository<Pass>,

    @InjectRepository(PassType)
    private readonly passTypeRepository: Repository<PassType>,

    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>,

    @InjectRepository(Position)
    private readonly positionRepository: Repository<Position>,

    @InjectRepository(PositionType)
    private readonly positionTypeRepository: Repository<PositionType>,

    @InjectRepository(Shot)
    private readonly shotRepository: Repository<Shot>,

    @InjectRepository(ShotType)
    private readonly shotTypeRepository: Repository<ShotType>,

    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
  ) {}

  async run() {
    const playerSetup: PlayerSetup = [
      {
        type: 'goalkeeper',
        playing: 1,
        available: 2,
        stamina: 2,
        balance: 2,
      },
      {
        type: 'defender',
        playing: 4,
        available: 2,
        stamina: 2,
        balance: 2,
      },
      {
        type: 'midfielder',
        playing: 4,
        available: 2,
        stamina: 3,
        balance: 2,
      },
      {
        type: 'forward',
        playing: 2,
        available: 2,
        stamina: 4,
        balance: 1,
      },
    ];

    const positionTypes = await mapSeq(
      playerSetup,
      async ({ type }) => {
        const positionType = new PositionType();
        positionType.name = type;
        await this.positionTypeRepository.save(positionType);
        return positionType;
      },
    );

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

    await mapParallel(teams, team => {
      return mapParallel(
        playerSetup,
        ({ available, stamina, balance, type }) => {
          return mapParallel(range(0, available), async () => {
            const player = new Player();

            player.playerType = findOrFail(
              positionTypes,
              positionType => positionType.name === type,
            );

            player.team = team;
            player.height = 164 + Math.round(Math.random() * 28);
            player.stamina = spreadBy(stamina, 12, 6);
            player.balance = spreadBy(balance, 12, 6);
            player.firstName = faker.name.firstName(1);
            player.lastName = faker.name.lastName();
            player.dob = faker.date.between(
              '1997-01-01',
              '2001-12-31',
            );
            await this.playerRepository.save(player);
            return player;
          });
        },
      );
    });

    await mapSeq(teams.slice(1), async (awayTeam, index) => {
      const startedAt = new Date();
      startedAt.setDate(startedAt.getDate() + index);
      startedAt.setHours(20, 0, 0, 0);

      const endedAt = new Date();
      endedAt.setDate(endedAt.getDate() + index);
      endedAt.setHours(20, 45, 0, 0);

      const game = new Game();
      game.scheduledAt = startedAt;
      game.startedAt = startedAt;
      game.endedAt = endedAt;

      const homeTeam = teams[index];
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

    const seedShots = async (
      game: Game,
      team: Team,
      positions: Position[],
    ) => {
      return mapParallel(positions, position => {
        return mapParallel(
          range(0, Math.round(Math.random() * 2)),
          () => {
            const shot = new Shot();

            shot.game = game;
            shot.fromTeam = Promise.resolve(team);
            shot.fromPlayer = Promise.resolve(position.player);
            shot.shotType = sample(shotTypes);

            shot.happenedAt = new Date(
              game.scheduledAt.valueOf() + minutes(45),
            );

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

    const passTypeNames: PassTypeName[] = [
      'Push',
      'Long',
      'Backward',
      'Piercing',
      'Wall',
    ];
    const passTypes = await mapParallel(passTypeNames, async name => {
      const passType = new PassType();
      passType.name = name;
      await this.passTypeRepository.save(passType);
      return passType;
    });

    const seedPasses = (
      game: Game,
      team: Team,
      positions: Position[],
    ) => {
      return mapParallel(positions, position => {
        return mapParallel(
          range(0, Math.round(Math.random() * 5)),
          () => {
            const pass = new Pass();

            const toPosition = sample(
              positions.filter(
                ({ id, positionTypeId }) =>
                  positionTypeId === position.positionType.id &&
                  id !== position.id,
              ),
            );

            pass.fromPlayer = position.player;
            pass.toPlayer = toPosition.player;
            pass.game = game;
            pass.fromTeam = team;
            pass.passType = sample(passTypes);

            pass.happenedAt = new Date(
              game.scheduledAt.valueOf() + minutes(45),
            );

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
      teamPositions: Position[],
      otherTeamPositions: Position[],
    ) => {
      return mapParallel(teamPositions, position => {
        return mapParallel(
          range(0, Math.round(Math.random() * 5)),
          () => {
            const toPosition = sample(
              otherTeamPositions.filter(
                ({ positionTypeId }) =>
                  positionTypeId === position.positionType.id,
              ),
            );

            const intercept = new Intercept();

            intercept.game = game;
            intercept.fromPlayer = position.player;
            intercept.fromTeam = team;
            intercept.toPlayer = toPosition.player;
            intercept.toTeamId = toPosition.player.teamId;

            intercept.happenedAt = new Date(
              game.scheduledAt.valueOf() + minutes(45),
            );

            intercept.x = Math.floor(Math.random() * 120);
            intercept.y = Math.floor(Math.random() * 90);

            return this.interceptRepository.save(intercept);
          },
        );
      });
    };

    const seedPositions = (game: Game, team: Team) => {
      return mapParallel(playerSetup, async ({ playing, type }) => {
        const playerType = findOrFail(
          positionTypes,
          positionType => positionType.name === type,
        );

        const players = await this.playerRepository.find({
          where: {
            playerType,
          },
        });

        const lineup = shuffle(players).slice(0, playing);

        return mapParallel(lineup, async player => {
          const position = new Position();
          position.game = game;
          position.team = team;
          position.player = player;
          position.startedAt = game.startedAt;
          position.endedAt = game.endedAt;
          position.positionType = findOrFail(
            positionTypes,
            positionType => positionType.name === type,
          );

          await this.positionRepository.save(position);
          return position;
        });
      });
    };

    const seedGameForTeam = async (
      game: Game,
      team: Team,
      teamPositions: Position[],
      otherTeamPositions: Position[],
    ) => {
      return Promise.all([
        seedShots(
          game,
          team,
          getPositionsByType(teamPositions, ['forward']),
        ),
        seedPasses(
          game,
          team,
          getPositionsByType(teamPositions, [
            'forward',
            'midfielder',
            'defender',
          ]),
        ),
        seedIntercepts(
          game,
          team,
          getPositionsByType(teamPositions, [
            'forward',
            'midfielder',
            'defender',
          ]),
          getPositionsByType(otherTeamPositions, [
            'forward',
            'midfielder',
            'defender',
          ]),
        ),
      ]);
    };

    await mapParallel(games, async game => {
      await seedPositions(game, game.homeTeam);
      await seedPositions(game, game.awayTeam);

      const positions = await this.positionRepository.find({
        where: {
          game,
        },
        relations: ['team', 'player', 'game', 'positionType'],
      });

      const homeTeamPositions = positions.filter(
        position => position.teamId === game.homeTeam.id,
      );

      const awayTeamPositions = positions.filter(
        position => position.teamId === game.awayTeam.id,
      );

      return Promise.all([
        seedGameForTeam(
          game,
          game.homeTeam,
          homeTeamPositions,
          awayTeamPositions,
        ),
        seedGameForTeam(
          game,
          game.awayTeam,
          awayTeamPositions,
          homeTeamPositions,
        ),
      ]);
    });
  }
}
