import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3001/api', // Your backend URL
});

export const fetchFiles = async () => {
  const response = await apiClient.get('/files');
  return response.data;
};