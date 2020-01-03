import { Field, ID, ObjectType } from 'type-graphql';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Pass } from '../pass/pass.entity';

export type PassTypeName =
  | 'Push'
  | 'Long'
  | 'Backward'
  | 'Piercing'
  | 'Wall';

@Entity()
@ObjectType()
export class PassType {
  @Field(type => ID)
  @PrimaryGeneratedColumn({ unsigned: true })
  id!: number;

  @Field()
  @Column()
  name!: PassTypeName;

  @Field(type => [Pass])
  @OneToMany(
    type => Pass,
    pass => pass.passType,
  )
  passes!: Pass[];
}
