// JanSevaAPIService.js - Jan Seva services with GraphQL
import { gql } from '@apollo/client';
import client from './api';

const JanSevaAPIService = {
  getServices: async () => {
    try {
      const GET_SERVICES = gql`
        query GetJanSevaServices {
          janSevaServices {
            id
            name
            description
            category
            requiredDocuments
            processingTime
            fees
            icon
          }
        }
      `;

      const { data } = await client.query({
        query: GET_SERVICES,
        fetchPolicy: 'cache-first',
      });

      return { data: data?.janSevaServices || [] };
    } catch (error) {
      console.error('Error fetching services:', error);
      return { data: [] };
    }
  },

  submitApplication: async (applicationData) => {
    try {
      const SUBMIT_APPLICATION = gql`
        mutation SubmitJanSevaApplication($input: JanSevaApplicationInput!) {
          submitJanSevaApplication(input: $input) {
            id
            applicationNumber
            serviceId
            serviceName
            applicantName
            applicantPhone
            status
            submittedAt
            documents {
              name
              url
              type
            }
          }
        }
      `;

      const { data } = await client.mutate({
        mutation: SUBMIT_APPLICATION,
        variables: { input: applicationData },
      });

      return data;
    } catch (error) {
      console.error('Error submitting application:', error);
      throw error;
    }
  },

  uploadDocument: async (file) => {
    try {
      // For file uploads with GraphQL, we'll use a REST endpoint or base64 encoding
      // This is a simplified version - adjust based on your backend implementation
      const UPLOAD_DOCUMENT = gql`
        mutation UploadDocument($file: Upload!) {
          uploadDocument(file: $file) {
            url
            filename
            mimetype
            size
          }
        }
      `;

      const { data } = await client.mutate({
        mutation: UPLOAD_DOCUMENT,
        variables: { file },
        context: {
          hasUpload: true,
        },
      });

      return data;
    } catch (error) {
      console.error('Error uploading document:', error);
      throw error;
    }
  },
};

export default JanSevaAPIService;
