import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Rocket {
  @Field(type => ID)
  id: number;

  @Field()
  name: string;

  @Field()
  type: string;
}
