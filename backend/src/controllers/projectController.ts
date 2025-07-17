import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs/promises'; // Using the promise-based version of fs

/**
 * The directory where our project templates are stored.
 * We construct a path that goes up from `backend/src/controllers` to the project root,
 * and then into the `templates/basic-web` folder.
 */
const templateDir = path.join(__dirname, '..', '..', '..', 'templates', 'basic-web');

/**
 * Handles the request to get all files for the initial project workspace.
 * It reads files from a template directory and returns them as a key-value map.
 *
 * @param req - The Express request object.
 * @param res - The Express response object.
 */
export const getProjectFiles = async (req: Request, res: Response) => {
  try {
    // 1. Get a list of all filenames in the template directory.
    const files = await fs.readdir(templateDir);

    // 2. Create a map to hold the file contents, with the filename as the key.
    const fileMap: { [key: string]: string } = {};

    // 3. Read the content of each file and add it to the map.
    // We use Promise.all to read all files in parallel for better performance.
    await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(templateDir, file);
        const content = await fs.readFile(filePath, 'utf-8');
        fileMap[file] = content;
      })
    );

    // 4. Send the completed map back to the frontend as a JSON response.
    res.status(200).json(fileMap);
    
  } catch (error) {
    // 5. If anything goes wrong (e.g., directory not found), log the error
    // and send a 500 Internal Server Error response.
    console.error('Failed to load project files:', error);
    res.status(500).json({ message: 'Error loading project files.' });
  }
};