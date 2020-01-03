import { Field, Int, ObjectType } from 'type-graphql';

@ObjectType()
export class TeamAreaActionCount {
  @Field()
  x!: number;

  @Field()
  y!: number;

  @Field()
  count!: number;

  @Field()
  happenedAt!: Date;

  @Field()
  fromTeamId!: number;

  @Field(type => [Int])
  fromPlayerIds!: number[];
}
