import {
  JoinTable,
  Entity,
  ManyToOne, Column
} from 'typeorm';
import { UserEntity } from './user.entity';
import { Base } from '../../common/base.entity';

// TypeORM entity. This repository design pattern allows these repositories can be obtained from the database connection.
@Entity()
export class TripEntity extends Base {
  @Column({
    type: 'text',
  })
  site: string;

  @ManyToOne(type => UserEntity, user => user.trips)
  @JoinTable()
  user: UserEntity;
}
