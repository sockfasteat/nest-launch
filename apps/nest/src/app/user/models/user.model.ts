import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Launch } from '../../launch/models/launch.model';

@ObjectType()
export class User {
  @Field(type => ID)
  id: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  userName: string;

  @Field()
  email: string;

  // When the field is an array, we must manually indicate the array type in the Field() decorator's type function
  @Field(type => [Launch])
  trips: Launch[];
}

