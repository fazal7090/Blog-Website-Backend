import express from 'express';
import userRoutes from './routes/user_route.js';
import postRoutes from './routes/post_route.js';

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());

// Mount user API routes
app.use('/', userRoutes);
// Mount post API routes
app.use('/posts', postRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
