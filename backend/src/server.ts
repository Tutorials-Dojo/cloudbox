import 'dotenv/config'; // Loads .env file contents into process.env
import express from 'express';
import cors from 'cors';
import projectRoutes from './routes/project';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' })); // Increase payload size limit for files

app.use('/api/project', projectRoutes);

app.listen(port, () => {
    console.log(`Backend server listening on http://localhost:${port}`);
});