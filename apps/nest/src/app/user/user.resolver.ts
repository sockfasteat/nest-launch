import { Query, Resolver, Args, Context, Mutation } from '@nestjs/graphql';
import { DataSources } from '../common/models/models';
import { User } from './models/user.model';
import { Launch } from '../launch/models/launch.model';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
@Resolver(of => User)
export class UserResolver {
  @Query(returns => Boolean)
  async isBooked(
    @Context('dataSources') { userAPI }: DataSources,
    @Args('launchId') launchId: string,
  ): Promise<boolean> {
    return await userAPI.isBookedOnLaunch({ launchId });
  }

  @Query(returns => [Launch])
  async getTrips(
    @Context('dataSources') { userAPI, launchAPI }: DataSources,
  ): Promise<Launch[]> {
    // get ids of launches by user
    const launchIds = await userAPI.getLaunchIdsByUser();

    if (!launchIds.length) {
      return [];
    }

    // look up those launches by their ids
    return await launchAPI.getLaunchesByIds({
      launchIds,
    }) || [];
  }
}
