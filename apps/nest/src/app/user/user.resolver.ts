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

//   bookTrips: async (_, { launchIds }, { dataSources }) => {
//   const results = await dataSources.userAPI.bookTrips({ launchIds });
//   const launches = await dataSources.launchAPI.getLaunchesByIds({
//     launchIds,
//   });
//
//   return {
//     success: results && results.length === launchIds.length,
//     message:
//       results.length === launchIds.length
//         ? 'trips booked successfully'
//         : `the following launches couldn't be booked: ${launchIds.filter(
//         id => !results.includes(id),
//         )}`,
//     launches,
//   };
// },
// cancelTrip: async (_, { launchId }, { dataSources }) => {
//   const result = dataSources.userAPI.cancelTrip({ launchId });
//
//   if (!result)
//     return {
//       success: false,
//       message: 'failed to cancel trip',
//     };
//
//   const launch = await dataSources.launchAPI.getLaunchById({ launchId });
//   return {
//     success: true,
//     message: 'trip cancelled',
//     launches: [launch],
//   };
// },
}
