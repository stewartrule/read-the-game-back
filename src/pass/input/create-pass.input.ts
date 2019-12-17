import { Min } from 'class-validator';
import { Field, InputType, Int } from 'type-graphql';
import { Pass } from '../pass.entity';

@InputType()
export class CreatePassInput implements Partial<Pass> {
  @Field(type => Int)
  @Min(0)
  gameId!: number;

  @Field(type => Int)
  @Min(0)
  teamId!: number;

  @Field(type => Int)
  @Min(0)
  fromPlayerId!: number;

  @Field(type => Int)
  @Min(0)
  toPlayerId!: number;
}
