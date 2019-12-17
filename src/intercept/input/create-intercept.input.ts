import { Max, Min } from 'class-validator';
import { Field, InputType, Int } from 'type-graphql';
import { Intercept } from '../intercept.entity';

@InputType()
export class CreateInterceptInput implements Partial<Intercept> {
  @Field(type => Int)
  @Min(0)
  gameId!: number;

  @Field(type => Int)
  @Min(0)
  fromPlayerId!: number;

  @Field(type => Int)
  @Min(0)
  fromTeamId!: number;

  @Field(type => Int)
  @Min(0)
  toPlayerId!: number;

  @Field(type => Int)
  @Min(0)
  toTeamId!: number;

  @Field(type => Int)
  @Min(0)
  @Max(120)
  x!: number;

  @Field(type => Int)
  @Min(0)
  @Max(90)
  y!: number;
}
