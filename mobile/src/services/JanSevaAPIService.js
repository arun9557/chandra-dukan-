// JanSevaAPIService.js
import axios from 'axios';

const API_BASE = 'http://localhost:3000/api';

const JanSevaAPIService = {
  getServices: async () => {
    try {
      const response = await axios.get(`${API_BASE}/janseva/services`);
      return response.data;
    } catch (error) {
      console.error('Error fetching services:', error);
      return { data: [] };
    }
  },

  submitApplication: async (applicationData) => {
    try {
      const response = await axios.post(`${API_BASE}/janseva/applications`, applicationData);
      return response.data;
    } catch (error) {
      console.error('Error submitting application:', error);
      throw error;
    }
  },

  uploadDocument: async (file) => {
    try {
      const formData = new FormData();
      formData.append('document', file);
      const response = await axios.post(`${API_BASE}/janseva/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading document:', error);
      throw error;
    }
  },
};

export default JanSevaAPIService;
