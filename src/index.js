import express from 'express';
import userRoutes from './routes/user_route.js';
import postRoutes from './routes/post_route.js';
import adminPostRoutes from './routes/admin_post_route.js';
import adminUserRoutes from './routes/admin_user_route.js';
import dotenv from 'dotenv'
import helmet from 'helmet';
dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(helmet());

app.use('/', userRoutes);
app.use('/posts', postRoutes);
app.use('/admin', adminPostRoutes);
app.use('/admin', adminUserRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
