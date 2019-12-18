import { Field, ObjectType, Int } from 'type-graphql';

@ObjectType()
export class TeamAreaActionCount {
  @Field()
  x!: number;

  @Field()
  y!: number;

  @Field()
  count!: number;

  @Field()
  time!: Date;

  @Field()
  fromTeamId!: number;

  @Field(type => [Int])
  fromPlayerIds!: number[];
}
