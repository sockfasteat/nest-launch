import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Mission } from './mission.model';
import { Rocket } from './rocket.model';

@ObjectType()
export class Launch {
  @Field(type => ID)
  id: number;

  @Field()
  site: string;

  @Field()
  mission: Mission;

  @Field()
  rocket: Rocket;

  @Field()
  cursor: string;
}

