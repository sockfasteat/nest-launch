import { ConnectionOptions } from 'typeorm';
import { UserEntity, TripEntity } from '../../entities';

const databaseConfig: ConnectionOptions = {
  type: 'sqlite',
  database: './store.sqlite',
  synchronize: true,
  logging: true,
  dropSchema: false,
  entities: [UserEntity, TripEntity],
};

export default databaseConfig;
