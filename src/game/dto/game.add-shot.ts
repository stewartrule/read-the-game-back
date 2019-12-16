import { IsBoolean, Min } from 'class-validator';
import { Field, InputType, Int } from 'type-graphql';

import { Shot } from '../../shot/shot.entity';

@InputType()
export class AddShotInput implements Partial<Shot> {
  @Field(type => Int)
  @Min(0)
  gameId!: number;

  @Field(type => Int)
  @Min(0)
  playerId!: number;

  @Field(type => Int)
  @Min(0)
  teamId!: number;

  @Field(type => Int)
  @Min(0)
  shotTypeId!: number;

  @Field()
  @IsBoolean()
  hit!: boolean;
}
