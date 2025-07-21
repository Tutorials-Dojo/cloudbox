import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3001/api', // Your backend URL
});

export const fetchFiles = async () => {
  // Corrected the URL to match the backend route
  const response = await apiClient.get('/project/files');
  return response.data;
};

export const runProject = async (files: { [key: string]: string }) => {
  // Sends the current state of all files to the backend's /run endpoint
  const response = await apiClient.post('/project/run', { files });
  return response.data; // Expected to return { success: boolean, url: string }
};