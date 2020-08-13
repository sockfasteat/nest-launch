import React, { Fragment } from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { LAUNCH_TILE_DATA } from './launches';
import { Loading, Header, LaunchDetail } from '../components';
import { ActionButton } from '../containers';
import { RouteComponentProps } from '@reach/router';
import * as LaunchDetailsTypes from './__generated__/LaunchDetails';

export const GET_LAUNCH_DETAILS = gql`
  query LaunchDetails($launchId: ID!) {
    getLaunch(id: $launchId) {
      isInCart @client
      site
      rocket {
        type
      }
      ...LaunchTile
    }
  }
  ${LAUNCH_TILE_DATA}
`;

interface LaunchProps extends RouteComponentProps {
  launchId?: any;
}

const Launch: React.FC<LaunchProps> = ({ launchId }) => {
  const {
    data,
    loading,
    error
  } = useQuery<
    LaunchDetailsTypes.LaunchDetails,
    LaunchDetailsTypes.LaunchDetailsVariables
  >(GET_LAUNCH_DETAILS,
    { variables: { launchId } }
  );

  if (loading) return <Loading />;
  if (error) return <p>ERROR: {error.message}</p>;
  if (!data) return <p>Not found</p>;

  return (
    <Fragment>
      <Header image={data.getLaunch && data.getLaunch.mission && data.getLaunch.mission.missionPatch}>
        {data && data.getLaunch && data.getLaunch.mission && data.getLaunch.mission.name}
      </Header>
      <LaunchDetail {...data.getLaunch} />
      <ActionButton {...data.getLaunch} />
    </Fragment>
  );
}

export default Launch;
