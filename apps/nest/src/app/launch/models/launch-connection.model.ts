import { Field, ObjectType } from '@nestjs/graphql';
import { Launch } from './launch.model';

@ObjectType()
export class LaunchConnection {
  @Field()
  cursor: number;

  @Field()
  hasMore: boolean;

  @Field(type => [Launch])
  launches: Launch[];
}
