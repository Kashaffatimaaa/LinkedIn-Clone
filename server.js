import express from 'express';
import authRoutes from './routes/auth.route.js'; // Adjust the path as needed
import { main } from '../controllers/main.js';  // Correct path to your main.js

const app = express();
app.use(express.json()); // Middleware for JSON parsing

app.use('/auth', authRoutes); // Mount the auth routes on '/auth'

app.listen(5000, () => {
  console.log('Server is running on port 5000');
  main();  // Ensure main() is called here
});
