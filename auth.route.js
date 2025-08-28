import express from 'express';
import authController from '../controllers/auth.controller.js'; // Correct import for default export


const { signup, login } = authController;

const router = express.Router();  // Initialize express router

// Define routes
router.post('/signup', signup);
router.post('/login', login);

export default router;  // Export the router, not the functions themselves
