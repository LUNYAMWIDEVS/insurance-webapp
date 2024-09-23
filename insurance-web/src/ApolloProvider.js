import React from 'react';
import App from './App';
import ApolloClient from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
import { ApolloProvider } from '@apollo/react-hooks';
import { setContext } from 'apollo-link-context';
import ErrorBoundary from './components/policies/motor/ErrorBoundary';

const httpLink = createHttpLink({
  uri: 'http://134.209.28.109:8087/api/v1/graphql/'
  // uri: 'http://127.0.0.1:8000/api/v1/graphql/'
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('jwtToken');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `JWT ${token}` : "",
    }
  }
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});


export default (
  <ApolloProvider client={client}>
    <ErrorBoundary>
    <App client={client} />
    </ErrorBoundary>
  </ApolloProvider>
);
