import express from 'express';
import userRoutes from './routes/route.js';

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());

// Mount user API routes
app.use('/', userRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
