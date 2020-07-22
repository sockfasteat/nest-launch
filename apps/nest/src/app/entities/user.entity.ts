import { Column, Entity, OneToMany } from 'typeorm';
import { IsEmail } from 'class-validator';
import { Base } from './base.entity';
import { TripEntity } from './trip.entity';

// TypeORM entity. This repository design pattern allows these repositories can be obtained from the database connection.
@Entity()
export class UserEntity extends Base {
  @Column({
    type: 'text',
  })
  firstName: string;

  @Column({
    type: 'text',
  })
  lastName: string;

  @Column({
    type: 'text',
    unique: true,
  })
  userName: string;

  @Column({
    type: 'text',
    unique: true,
  })
  @IsEmail()
  email: string;

  @OneToMany(type => TripEntity, trip => trip.user, {
    cascade: true,
  })
  trips: TripEntity[]
}
