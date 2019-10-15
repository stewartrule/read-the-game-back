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
import { Shot } from '../shot/shot.entity';
import { Team } from '../team/team.entity';

@Entity({ orderBy: { start: 'DESC' } })
@ObjectType()
export class Game {
  @Field(type => ID)
  @PrimaryGeneratedColumn({ unsigned: true })
  id!: number;

  @Field()
  @Column()
  name!: string;

  @Field()
  @Column()
  start!: Date;

  @Field(type => Team)
  @ManyToOne(type => Team, team => team.homeGames, {
    nullable: false,
    eager: true,
  })
  homeTeam!: Team;

  @Field(type => Team)
  @ManyToOne(type => Team, team => team.awayGames, {
    nullable: false,
    eager: true,
  })
  awayTeam!: Team;

  @Field(type => [Pass])
  @OneToMany(type => Pass, pass => pass.game, {
    onDelete: 'CASCADE',
  })
  passes!: Promise<Pass[]>;

  @Field(type => [Shot])
  @OneToMany(type => Shot, shot => shot.game, {
    onDelete: 'CASCADE',
  })
  shots!: Promise<Shot[]>;

  @Field(type => [Intercept])
  @OneToMany(type => Intercept, intercept => intercept.game, {
    onDelete: 'CASCADE',
  })
  intercepts!: Promise<Intercept[]>;
}
