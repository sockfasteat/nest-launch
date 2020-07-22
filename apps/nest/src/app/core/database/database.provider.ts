import { DATABASE_CONNECTION } from '../../common/constants';
import { createConnection } from 'typeorm';
import databaseConfig from './database-config';

export const databaseProvider = [
  {
    provide: DATABASE_CONNECTION,
    useFactory: async () => await createConnection({
      ...databaseConfig,
    })
  }
];
