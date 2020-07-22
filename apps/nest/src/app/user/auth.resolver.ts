import { Args, Mutation, Query, Resolver, Context } from '@nestjs/graphql';
import { User } from './models/user.model';
import { DataSources } from '../common/models/models';
import { SignUpUserDto } from './models/user.dto';

@Resolver(of => User)
export class AuthResolvers {

  @Query(returns => User, {
    nullable: true,
    description: 'Returns the current logged user.'
  })
  async me(
    @Context('dataSources') { userAPI }: DataSources,

  ): Promise<User> {
    const user = await userAPI.findUser({});

    if (user) {
      return await userAPI.read(user.userName);
    }

    return user;
  }

  @Mutation(returns => String)
  async signIn(
    @Context('dataSources') { userAPI }: DataSources,
    @Args('email') email: string,
  ): Promise<string> {
    const user = await userAPI.signIn(email);
    if (user) {
      return new Buffer(email).toString('base64');
    }
  }

  @Mutation(returns => User)
  async signUp(
    @Context('dataSources') { userAPI }: DataSources,
    @Args('firstName') firstName: string,
    @Args('lastName') lastName: string,
    @Args('userName') userName: string,
    @Args('email') email: string,
  ): Promise<User> {
    const user: SignUpUserDto = {
      firstName,
      lastName,
      email,
      userName,
    };
    return await userAPI.signUp(user);
  }
}
