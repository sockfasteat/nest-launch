import { Module } from '@nestjs/common';
import LaunchAPI from './launch';

@Module({
  imports: [],
  controllers: [],
  providers: [LaunchAPI],
  exports: [LaunchAPI],
})
export class DataSourceModule {}
