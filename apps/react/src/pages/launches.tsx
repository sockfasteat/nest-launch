import React, { Fragment } from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { LaunchTile, Header, Button, Loading } from '../components';
import { RouteComponentProps } from '@reach/router';
import * as GetLaunchListTypes from './__generated__/GetLaunchList';

export const LAUNCH_TILE_DATA = gql`
  fragment LaunchTile on Launch {
    __typename
    id
#    isBooked
    rocket {
      id
      name
    }
    mission {
      name
      missionPatch
    }
  }
`;

export const GET_LAUNCHES = gql`
  query GetLaunchList($after: String) {
    getLaunches(after: $after) {
      cursor
      hasMore
      launches {
        ...LaunchTile
      }
    }
  }
  ${LAUNCH_TILE_DATA}
`;

interface LaunchesProps extends RouteComponentProps {}

const Launches: React.FC<LaunchesProps> = () => {
  const {
    data,
    loading,
    error,
    fetchMore
  } = useQuery<
    GetLaunchListTypes.GetLaunchList,
    GetLaunchListTypes.GetLaunchListVariables
  >(GET_LAUNCHES);

  if (loading) return <Loading />;
  if (error || !data) return <p>ERROR</p>;

  return (
    <Fragment>
      <Header />
      {data.getLaunches &&
        data.getLaunches.launches &&
        data.getLaunches.launches.map((launch: any) => (
          <LaunchTile key={launch.id} launch={launch} />
        ))}
      {data.getLaunches &&
        data.getLaunches.hasMore && (
          <Button
            onClick={() =>
              fetchMore({
                variables: {
                  after: `${data.getLaunches.cursor}`,
                },
                updateQuery: (prev, { fetchMoreResult, ...rest }) => {
                  if (!fetchMoreResult) {
                    return prev;
                  }
                  return {
                    ...fetchMoreResult,
                    launches: {
                      ...fetchMoreResult.getLaunches,
                      launches: [
                        ...prev.getLaunches.launches,
                        ...fetchMoreResult.getLaunches.launches,
                      ],
                    },
                  };
                },
              })
            }
          >
            Load More
          </Button>
        )}
    </Fragment>
  );
}

export default Launches;
