import { Router, Request, Response } from 'express';
import { getProjectFiles } from '../controllers/projectController';
import { runCodeInVM } from '../services/firecrackerService';

const router = Router();

// This route gets the initial template files
router.get('/files', getProjectFiles);

// This route takes files from the frontend and executes them on the VM
router.post('/run', async (req: Request, res: Response) => {
  try {
    const { files } = req.body; // Expects a { files: { 'filename.js': 'content' } } payload
    
    // FIX IS HERE: Check if the object is null/undefined or has zero keys
    if (!files || Object.keys(files).length === 0) {
      return res.status(400).json({ message: 'No files provided.' });
    }

    const result = await runCodeInVM(files);
    res.status(200).json(result);

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('Run endpoint error:', errorMessage);
    res.status(500).json({ message: 'Failed to run code.', error: errorMessage });
  }
});

export default router;