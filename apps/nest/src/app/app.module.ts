import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import LaunchAPI from './datasource/launch';
import { GraphQLModule } from '@nestjs/graphql';
import { LaunchResolver } from './launch/launch.resolver';
import { DataSourceModule } from './datasource/datasource.module';
import UserAPI from './datasource/user';
import * as isEmail from 'isemail';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getRepository } from 'typeorm';
import { userProvider } from './user/user.provider';
import { tripProvider } from './user/trip.provider';
import { DatabaseModule } from './core/database/database.module';
import { UserResolver } from './user/user.resolver';
import { UserEntity, TripEntity } from './entities';
import { AuthResolvers } from './user/auth.resolver';

// set up any dataSources our resolvers need
const dataSources = () => ({
  launchAPI: new LaunchAPI(),
  userAPI: new UserAPI()
});

// the function that sets up the global context for each resolver, using the req
const context = async ({ req }) => {
  if (req) {
    // simple auth check on every request
    const auth = (req.headers && req.headers.authorization) || '';
    // const email = new Buffer(auth, 'base64').toString('ascii');
    const email = auth;
    // if the email isn't formatted validly, return null for user
    if (!isEmail.validate(email)) {
      return { me: null };
    }

    // find a user by their email
    let me = await getRepository(UserEntity).findOne({ email });

    if (!me) {
      const newUser = new UserEntity();
      newUser.email = email;
      me = await getRepository(UserEntity).save(newUser);
    }

    return { me };
  }
};

@Module({
  imports: [
    DataSourceModule,
    DatabaseModule,
    // TypeOrmModule.forRoot({
    //   type: 'sqlite',
    //   database: './store.sqlite',
    //   synchronize: true,
    //   entities: [UserEntity, TripEntity]
    // }),
    // TypeOrmModule.forFeature([UserEntity, TripEntity]),
    GraphQLModule.forRoot({
      dataSources,
      resolvers: [
        LaunchResolver as any,
        UserResolver as any,
        AuthResolvers as any,
      ],
      context,
      installSubscriptionHandlers: true,
      autoSchemaFile: 'schema.gql',
      debug: true,
    })
  ],
  controllers: [AppController],
  //...userProvider, ...tripProvider,
  providers: [...userProvider, ...tripProvider, UserEntity, TripEntity, AppService, LaunchResolver, UserResolver, AuthResolvers, LaunchAPI, UserAPI],
})
export class AppModule {}
