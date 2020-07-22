import { DATABASE_CONNECTION, TRIP_REPOSITORY } from '../common/constants';
import { Connection } from 'typeorm';
import { TripEntity } from '../entities';

export const tripProvider = [
  {
    provide: TRIP_REPOSITORY,
    useFactory: (connection: Connection) => connection.getRepository(TripEntity),
    inject: [DATABASE_CONNECTION],
  }
];
