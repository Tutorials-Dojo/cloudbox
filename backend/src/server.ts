import express from 'express';
import cors from 'cors';
import fileRoutes from './routes/files';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.use('/api/files', fileRoutes);

app.listen(port, () => {
    console.log(`Backend server listening on http://localhost:${port}`);
});