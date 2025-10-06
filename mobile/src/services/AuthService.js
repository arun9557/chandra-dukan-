// AuthService.js - Authentication service
// Handles user authentication and token management using GraphQL

import { gql } from '@apollo/client';
import client from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthService = {
  // Login user with GraphQL
  login: async (phone, password) => {
    try {
      const LOGIN_MUTATION = gql`
        mutation Login($phone: String!, $password: String!) {
          login(phone: $phone, password: $password) {
            token
            user {
              id
              name
              email
              phone
              role
            }
          }
        }
      `;

      const { data } = await client.mutate({
        mutation: LOGIN_MUTATION,
        variables: { phone, password },
      });
      
      if (data?.login?.token) {
        // Store token in AsyncStorage
        await AsyncStorage.setItem('token', data.login.token);
        // Store user data
        await AsyncStorage.setItem('user', JSON.stringify(data.login.user));
      }
      
      return data.login;
    } catch (error) {
      console.error('Login error:', error);
      throw error.message || 'Login failed. Please try again.';
    }
  },

  // Register new user with GraphQL
  register: async (userData) => {
    try {
      const REGISTER_MUTATION = gql`
        mutation Register($input: RegisterInput!) {
          register(input: $input) {
            token
            user {
              id
              name
              email
              phone
              role
            }
          }
        }
      `;

      const { data } = await client.mutate({
        mutation: REGISTER_MUTATION,
        variables: { input: userData },
      });
      
      if (data?.register?.token) {
        await AsyncStorage.setItem('token', data.register.token);
        await AsyncStorage.setItem('user', JSON.stringify(data.register.user));
      }
      
      return data.register;
    } catch (error) {
      console.error('Registration error:', error);
      throw error.message || 'Registration failed. Please try again.';
    }
  },

  // Logout user
  logout: async () => {
    try {
      // Remove token and user data from AsyncStorage
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      return false;
    }
  },

  // Get current user with GraphQL
  getCurrentUser: async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) return null;

      const GET_ME_QUERY = gql`
        query Me {
          me {
            id
            name
            email
            phone
            role
            address {
              street
              city
              state
              pincode
            }
          }
        }
      `;

      const { data } = await client.query({
        query: GET_ME_QUERY,
        fetchPolicy: 'network-only', // Always fetch from server
      });
      
      return data.me;
    } catch (error) {
      console.error('Get current user error:', error);
      await AsyncStorage.removeItem('token'); // Clear invalid token
      return null;
    }
  },

  // Check if user is authenticated
  isAuthenticated: async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      return !!token;
    } catch (error) {
      console.error('Auth check error:', error);
      return false;
    }
  },

  // Update user profile with GraphQL
  updateProfile: async (userData) => {
    try {
      const UPDATE_PROFILE_MUTATION = gql`
        mutation UpdateProfile($input: UpdateProfileInput!) {
          updateProfile(input: $input) {
            id
            name
            email
            phone
            address {
              street
              city
              state
              pincode
            }
          }
        }
      `;

      const { data } = await client.mutate({
        mutation: UPDATE_PROFILE_MUTATION,
        variables: { input: userData },
      });
      
      // Update stored user data
      if (data?.updateProfile) {
        const currentUser = JSON.parse(await AsyncStorage.getItem('user') || '{}');
        const updatedUser = { ...currentUser, ...data.updateProfile };
        await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      }
      
      return data.updateProfile;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error.message || 'Failed to update profile.';
    }
  },

  // Change password with GraphQL
  changePassword: async (currentPassword, newPassword) => {
    try {
      const CHANGE_PASSWORD_MUTATION = gql`
        mutation ChangePassword($currentPassword: String!, $newPassword: String!) {
          changePassword(currentPassword: $currentPassword, newPassword: $newPassword) {
            success
            message
          }
        }
      `;

      const { data } = await client.mutate({
        mutation: CHANGE_PASSWORD_MUTATION,
        variables: { currentPassword, newPassword },
      });
      
      return data.changePassword;
    } catch (error) {
      console.error('Change password error:', error);
      throw error.message || 'Failed to change password.';
    }
  },
};

export default AuthService;
