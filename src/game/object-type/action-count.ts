import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class ActionCount {
  @Field()
  x!: number;

  @Field()
  y!: number;

  @Field()
  count!: number;

  @Field()
  time!: Date;

  @Field()
  teamId!: number;
}
