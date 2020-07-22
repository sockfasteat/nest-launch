import { DATABASE_CONNECTION, USER_REPOSITORY } from '../common/constants';
import { Connection } from 'typeorm';
import { UserEntity } from '../entities';

export const userProvider = [
  {
    provide: USER_REPOSITORY,
    useFactory: (connection: Connection) => connection.getRepository(UserEntity),
    inject: [DATABASE_CONNECTION],
  }
];
