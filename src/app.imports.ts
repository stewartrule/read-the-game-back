import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Game } from './game/game.entity';
import { GameModule } from './game/game.module';
import { Intercept } from './intercept/intercept.entity';
import { InterceptModule } from './intercept/intercept.module';
import { PassType } from './pass-type/pass-type.entity';
import { PassTypeModule } from './pass-type/pass-type.module';
import { Pass } from './pass/pass.entity';
import { PassModule } from './pass/pass.module';
import { Player } from './player/player.entity';
import { PlayerModule } from './player/player.module';
import { ShotType } from './shot-type/shot-type.entity';
import { ShotTypeModule } from './shot-type/shot-type.module';
import { Shot } from './shot/shot.entity';
import { ShotModule } from './shot/shot.module';
import { Team } from './team/team.entity';
import { TeamModule } from './team/team.module';

export default [
  TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 8889,
    username: 'root',
    password: 'root',
    database: 'game',
    entities: [
      Game,
      Intercept,
      Pass,
      PassType,
      Player,
      Shot,
      ShotType,
      Team,
    ],
    synchronize: true,
    // dropSchema: true,
  }),
  GameModule,
  InterceptModule,
  PassModule,
  PassTypeModule,
  PlayerModule,
  ShotModule,
  ShotTypeModule,
  TeamModule,

  GraphQLModule.forRoot({
    installSubscriptionHandlers: true,
    autoSchemaFile: 'schema.gql',
  }),
];
