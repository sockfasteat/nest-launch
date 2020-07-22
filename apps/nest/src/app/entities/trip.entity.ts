import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn
} from 'typeorm';
import { UserEntity } from './user.entity';
import { Field, ID } from '@nestjs/graphql';

// TypeORM entity. This repository design pattern allows these repositories can be obtained from the database connection.
@Entity()
export class TripEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'int'
  })
  launchId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(type => UserEntity, user => user.trips)
  user: UserEntity;
}
