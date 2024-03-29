import { Field, ID, Int, ObjectType } from 'type-graphql';
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

@Entity({ orderBy: { lastName: 'ASC' } })
@ObjectType()
export class Player {
  @Field(type => ID)
  @PrimaryGeneratedColumn({ unsigned: true })
  id!: number;

  @Field()
  @Column()
  firstName!: string;

  @Field()
  @Column()
  lastName!: string;

  @Field(type => Int)
  @Column({
    unsigned: true,
    type: 'smallint',
    nullable: false,
  })
  height!: number;

  @Field(type => Int)
  @Column({
    unsigned: true,
    type: 'smallint',
    nullable: false,
  })
  strength!: number;

  @Field(type => Int)
  @Column({
    unsigned: true,
    type: 'smallint',
    nullable: false,
  })
  balance!: number;

  @Field(type => Int)
  @Column({
    unsigned: true,
    type: 'smallint',
    nullable: false,
  })
  stamina!: number;

  @Field(type => Date)
  @Column()
  dob!: Date;

  @Field(type => Team)
  @ManyToOne(
    type => Team,
    team => team.players,
    {
      nullable: false,
    },
  )
  team!: Team;

  @Field(type => Int)
  @Column({ unsigned: true })
  teamId!: number;

  @Field(type => [Shot])
  @OneToMany(
    type => Shot,
    shot => shot.fromPlayer,
  )
  shots!: Promise<Shot[]>;

  @Field(type => [Pass])
  @OneToMany(
    type => Pass,
    pass => pass.fromPlayer,
  )
  passes!: Pass[];

  @Field(type => [Pass])
  @OneToMany(
    type => Pass,
    pass => pass.toPlayer,
  )
  receives!: Pass[];

  @Field(type => [Intercept])
  @OneToMany(
    type => Intercept,
    intercept => intercept.toPlayer,
  )
  intercepts!: Intercept[];

  @Field(type => [Intercept])
  @OneToMany(
    type => Intercept,
    intercept => intercept.fromPlayer,
  )
  ballLosses!: Intercept[];
}
