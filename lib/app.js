import dotenv from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';
import notFoundMiddleware from './middleware/not-found.js';
import errorMiddleware from './middleware/error.js';
import authController from './controllers/auth.js';
import postsController from './controllers/posts.js';
import commentsController from './controllers/comments.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(authController);
app.use(postsController);
app.use(commentsController);

if (app) {
  console.log('hi');
}

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
