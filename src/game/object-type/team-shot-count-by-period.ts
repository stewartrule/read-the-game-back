import { Field, Int, ObjectType } from 'type-graphql';
import { Shot } from '../../shot/shot.entity';

@ObjectType()
export class TeamShotCountByPeriod {
  @Field(type => Date)
  start!: Date;

  @Field(type => Date)
  stop!: Date;

  @Field(type => Int)
  count!: number;

  @Field(type => [Shot])
  shots!: Shot[];
}
