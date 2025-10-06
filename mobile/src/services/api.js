import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import Constants from 'expo-constants';

// Use your local development server URL
// Replace 'YOUR_LOCAL_IP' with your computer's local IP address
// Run 'ipconfig' in Command Prompt to find it (look for IPv4 Address)
const LOCAL_IP = 'YOUR_LOCAL_IP'; // e.g., '192.168.1.100'
const GRAPHQL_ENDPOINT = `http://${LOCAL_IP}:4000/graphql`; // Default GraphQL server port is 4000

// Log the GraphQL endpoint for debugging
console.log('Connecting to GraphQL at:', GRAPHQL_ENDPOINT);

// Create an http link to your GraphQL server with enhanced error handling
const httpLink = createHttpLink({
  uri: GRAPHQL_ENDPOINT,
  fetch: async (uri, options) => {
    console.log('Sending request to:', uri);
    console.log('Request options:', JSON.stringify(options, null, 2));
    
    try {
      const response = await fetch(uri, options);
      console.log('Response status:', response.status, response.statusText);
      
      if (!response.ok) {
        const errorBody = await response.text().catch(() => 'Failed to read response body');
        console.error('Response error body:', errorBody);
        const error = new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`);
        error.response = response;
        throw error;
      }
      
      const responseData = await response.text();
      console.log('Response data:', responseData);
      return new Response(responseData, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers
      });
      
    } catch (error) {
      console.error('GraphQL request failed:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      throw error;
    }
  },
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
