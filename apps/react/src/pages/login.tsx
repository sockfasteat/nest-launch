import React from 'react';
import { useApolloClient, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { LoginForm, Loading } from '../components';
import ApolloClient from 'apollo-client';
import * as LoginTypes from './__generated__/login';

export const LOGIN_USER = gql`
  mutation login($email: String!) {
    signIn(email: $email)
  }
`;

export default function Login() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const client: ApolloClient<any> = useApolloClient() as any;
  const [login, { loading, error }] = useMutation<LoginTypes.login, LoginTypes.loginVariables>(
    LOGIN_USER,
    {
      onCompleted({ signIn }) {
        localStorage.setItem('token', signIn as string);
        client.writeData({ data: { isLoggedIn: true } });
      }
    }
  );

  if (loading) return <Loading />;
  if (error) return <p>An error occurred</p>;

  return <LoginForm login={login} />;
}
