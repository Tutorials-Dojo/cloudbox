import { Router } from 'express';

const router = Router();

// In a real app, this would come from a database or a template project directory
const initialFiles = {
    'index.html': `<!DOCTYPE html>...`, // Your HTML content
    'main.js': `console.log('Hello from the VM!');`,
    'styles.css': `body { background-color: #f0f0f0; }`
};

router.get('/', (req, res) => {
    res.json(initialFiles);
});

export default router;