import { Field, ID, ObjectType } from 'type-graphql';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Intercept } from '../intercept/intercept.entity';
import { Pass } from '../pass/pass.entity';
import { Position } from '../position/position.entity';
import { Shot } from '../shot/shot.entity';
import { Team } from '../team/team.entity';

@Entity({ orderBy: { scheduledAt: 'DESC' } })
@ObjectType()
export class Game {
  @Field(type => ID)
  @PrimaryGeneratedColumn({ unsigned: true })
  id!: number;

  @Field()
  @Column()
  scheduledAt!: Date;

  @Field()
  @Column()
  startedAt!: Date;

  @Field()
  @Column()
  endedAt!: Date;

  @Field(type => Team)
  @ManyToOne(
    type => Team,
    team => team.homeGames,
    {
      nullable: false,
      eager: true,
    },
  )
  homeTeam!: Team;

  @Field(type => Team)
  @ManyToOne(
    type => Team,
    team => team.awayGames,
    {
      nullable: false,
      eager: true,
    },
  )
  awayTeam!: Team;

  @Field(type => [Pass])
  @OneToMany(
    type => Pass,
    pass => pass.game,
  )
  passes!: Promise<Pass[]>;

  @Field(type => [Shot])
  @OneToMany(
    type => Shot,
    shot => shot.game,
  )
  shots!: Promise<Shot[]>;

  @Field(type => [Intercept])
  @OneToMany(
    type => Intercept,
    intercept => intercept.game,
  )
  intercepts!: Promise<Intercept[]>;

  @Field(type => [Position])
  @OneToMany(
    type => Position,
    position => position.game,
  )
  positions!: Position[];
}
