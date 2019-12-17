import { Field, ID, ObjectType } from 'type-graphql';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Pass } from '../pass/pass.entity';

@Entity()
@ObjectType()
export class PassType {
  @Field(type => ID)
  @PrimaryGeneratedColumn({ unsigned: true })
  id!: number;

  @Field()
  @Column()
  name!: string;

  @Field(type => [Pass])
  @OneToMany(
    type => Pass,
    pass => pass.type,
  )
  passes!: Pass[];
}
