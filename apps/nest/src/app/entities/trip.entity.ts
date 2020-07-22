import {
  JoinTable,
  Entity,
  ManyToOne, Column
} from 'typeorm';
import { Base } from './base.entity';
import { UserEntity } from './user.entity';

// TypeORM entity. This repository design pattern allows these repositories can be obtained from the database connection.
@Entity()
export class TripEntity extends Base {
  @Column({
    type: 'text',
  })
  site: string;

  @ManyToOne(type => UserEntity, user => user.trips)
  user: UserEntity;
}
