import readline from 'readline';

import authController from './auth.controller.js';  // Import the default export
const { signup, login , 
    createPost,
    viewPosts,
    findJobs,
    mainFeed } = authController;  // Destructure to access the functions

// Setup readline interface for user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Function to get user input
const askQuestion = (question) => {
    return new Promise((resolve) => rl.question(question, resolve));
};

// Main function to prompt the user for action
const main = async () => {
    console.log('1. Signup');
    console.log('2. Login');
    const choice = await askQuestion('Choose an option (1/2): ');

    if (choice === '1') {
        await signup();  // Call the signup function
    } else if (choice === '2') {
        await login();  // Call the login function
    } else {
        console.log('Invalid option.');
        rl.close();
    }
};

// Export the main function to be used in server.js
export { main };
