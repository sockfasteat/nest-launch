import { Query, Resolver, Args, Context, Mutation, ID } from '@nestjs/graphql';
import { DataSources } from '../common/models/models';
import { User } from './models/user.model';
import { Launch, TripUpdateResponse } from '../launch/models/launch.model';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
@Resolver(of => User)
export class UserResolver {
  @Query(returns => Boolean)
  async isBooked(
    @Context('dataSources') { userAPI }: DataSources,
    @Args('launchId', { type: () => [ID] }) launchId: number,
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

  @Mutation(returns => TripUpdateResponse)
  async bookTrips(
    @Context('dataSources') { userAPI, launchAPI }: DataSources,
    @Args('launchIds', { type: () => [ID] }) launchIds: number[],
  ): Promise<TripUpdateResponse> {
    const results = await userAPI.bookTrips({ launchIds });
    const launches = await launchAPI.getLaunchesByIds({ launchIds });

    return {
      success: results && results.length === launchIds.length,
      message:
        results.length === launchIds.length
          ? 'Trips booked successfully'
          : `The following launches couldn't be booked: ${launchIds.filter(
          id => !results.includes(id),
          )}`,
      launches,
    }
  }

  @Mutation(returns => TripUpdateResponse)
  async cancelTrip(
    @Context('dataSources') { userAPI, launchAPI }: DataSources,
    @Args('launchId', { type: () => ID }) launchId: number,
  ): Promise<TripUpdateResponse> {
    const result = userAPI.cancelTrip({ launchId });

    if (!result) {
      return {
        success: false,
        message: `Failed to cancel trip: ${launchId}`,
        launches: []
      };
    }

    const launch = await launchAPI.getLaunchById({ launchId });

    return {
      success: true,
      message: 'Trip cancelled',
      launches: [launch],
    };
  }
}
