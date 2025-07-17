import { Router } from 'express';
import { getProjectFiles } from '../controllers/projectController';

// 1. Create a new router instance from Express.
const router = Router();

// 2. Define the API route.
// When the frontend sends a GET request to '/api/project/files',
// this route will be triggered.
router.get(
  '/files', // The specific path for this endpoint
  getProjectFiles // The controller function that will handle the request
);

// In the future, you could add more routes here for this "project" resource.
// For example:
// router.post('/files', saveProjectFiles);
// router.post('/run', runProjectCode);

// 3. Export the router so it can be used by the main server file.
export default router;