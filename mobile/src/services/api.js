import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import Constants from 'expo-constants';

// Get the GraphQL endpoint from environment variables
const GRAPHQL_ENDPOINT = Constants.manifest.extra?.graphqlEndpoint || 'http://192.168.31.84:4000/graphql';

// Create an http link to your GraphQL server
const httpLink = createHttpLink({
  uri: GRAPHQL_ENDPOINT,
});

// Add any necessary authentication headers here
const authLink = setContext((_, { headers }) => {
  // Get the authentication token from storage if it exists
  // const token = await AsyncStorage.getItem('userToken');
  
  // Return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      // authorization: token ? `Bearer ${token}` : "",
      'x-app-name': 'chandra-dukan-mobile',
      'Content-Type': 'application/json',
    }
  };
});

// Create the Apollo Client instance
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
  },
});

export default client;
