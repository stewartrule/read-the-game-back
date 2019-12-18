import { IsBoolean, Min } from 'class-validator';
import { Field, InputType, Int } from 'type-graphql';
import { Shot } from '../shot.entity';

@InputType()
export class CreateShotInput implements Partial<Shot> {
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
  shotTypeId!: number;

  @Field()
  @IsBoolean()
  hit!: boolean;
}
