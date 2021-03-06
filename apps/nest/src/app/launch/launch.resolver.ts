import { Query, Resolver, Args, Context, ID } from '@nestjs/graphql';
import { paginateResults } from '../utils/utils';
import { Launch } from './models/launch.model';
import { LaunchConnection } from './models/launch-connection.model';
import { DataSources } from '../common/models/models';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
@Resolver(of => Launch)
export class LaunchResolver {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Query(returns => Launch)
  async getLaunch(
    @Context('dataSources') { launchAPI }: DataSources,
    @Args('id', { type: () => ID }) id: number,
  ): Promise<Launch> {
    return await launchAPI.getLaunchById({ launchId: id })
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Query(returns => LaunchConnection)
  async getLaunches(
    @Context('dataSources') { launchAPI }: DataSources,
    @Args('pageSize', {
      nullable: true,
    }) pageSize: number = 20,
    @Args('after', {
      nullable: true,
    }) after?: string,
  ): Promise<LaunchConnection> {
    const allLaunches = await launchAPI.getAllLaunches();
    // we want these in reverse chronological order
    allLaunches.reverse();

    const launches = paginateResults({
      after,
      pageSize,
      results: allLaunches,
    });

    return {
      launches,
      cursor: launches.length ? launches[launches.length - 1].cursor : null,
      // if the cursor of the end of the paginated results is the same as the
      // last item in _all_ results, then there are no more results after this
      hasMore: launches.length
        ? launches[launches.length - 1].cursor !==
        allLaunches[allLaunches.length - 1].cursor
        : false,
    };
  }
}
