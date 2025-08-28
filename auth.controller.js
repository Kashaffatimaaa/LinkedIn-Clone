import bcrypt from 'bcryptjs';
import sql from 'mssql';
import config from '../lib/db.js'; // Ensure correct DB config path

// Setup readline interface
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to get user input
const askQuestion = (question) => {
	return new Promise((resolve) => {
	  rl.question(question, (answer) => {
		console.log(`Received input: ${answer}`);  // Debugging log
		resolve(answer);
	  });
	});
  };
  

// Function to create a post
const createPost = async (userId) => {
  const title = await askQuestion('Enter the post title: ');
  const content = await askQuestion('Enter the post content: ');

  try {
    const pool = await sql.connect(config);
    await pool.request()
      .input('title', sql.VarChar(255), title)
      .input('content', sql.Text, content)
      .input('userId', sql.Int, userId)
      .query(`
        INSERT INTO Posts (Title, Content, User_id) 
        VALUES (@title, @content, @userId)
      `);

    console.log('Post created successfully!');
  } catch (err) {
    console.error('Error occurred while creating the post:', err);
  }
};

// Function to view posts and interact
const viewPosts = async (userId) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query('SELECT Post_id, Title, Content, Likes FROM Posts');

    if (result.recordset.length === 0) {
      console.log('No posts available.');
      return;
    }

    result.recordset.forEach((post) => {
      console.log(`\nPost ID: ${post.Post_id}`);
      console.log(`Title: ${post.Title}`);
      console.log(`Content: ${post.Content}`);
      console.log(`Likes: ${post.Likes}`);
    });

    const postId = await askQuestion('\nEnter the Post ID to like or comment (or press Enter to skip): ');

    if (postId) {
      const action = await askQuestion('Type "like" to like the post or "comment" to add a comment: ');

      if (action.toLowerCase() === 'like') {
        await pool.request()
          .input('postId', sql.Int, postId)
          .query('UPDATE Posts SET Likes = Likes + 1 WHERE Post_id = @postId');
        console.log('Post liked successfully!');
      }else if (action.toLowerCase() === 'comment') {
		const commentText = await askQuestion('Enter your comment: ');
		await pool.request()
		  .input('postId', sql.Int, postId)
		  .input('userId', sql.Int, userId)
		  .input('comment', sql.Text, commentText)  // Use commentText here
		  .query(`
			INSERT INTO Comments (postId, userId, content) 
			VALUES (@postId, @userId, @comment)
		  `);
		console.log('Comment added successfully!');
	  } else {
		console.log('Invalid action.');
	  }
	  
    }
  } catch (err) {
    console.error('Error occurred while fetching posts:', err);
  }
};
// Function to send a message
const sendMessage = async (userId) => {
	// Ask for the username of the person to message
	const receiverUsername = await askQuestion('Enter the username of the person you want to message: ');
  
	try {
	  const pool = await sql.connect(config);
  
	  // Check if the receiver exists in the Users table
	  const result = await pool.request()
		.input('username', sql.VarChar(50), receiverUsername)
		.query(`
		  SELECT User_id, username
		  FROM Users
		  WHERE username = @username
		`);
  
	  if (result.recordset.length === 0) {
		console.log('User not found!');
		return;
	  }
  
	  // Get the receiver's User_id
	  const receiverId = result.recordset[0].User_id;
  
	  // Ask for the message content
	  const content = await askQuestion('Enter your message: ');
  
	  // Insert the message into the Messages table
	  await pool.request()
		.input('senderId', sql.Int, userId)
		.input('receiverId', sql.Int, receiverId)
		.input('content', sql.Text, content)
		.query(`
		  INSERT INTO Messages (Sender_id, Receiver_id, Content) 
		  VALUES (@senderId, @receiverId, @content)
		`);
  
	  console.log('Message sent successfully!');
	} catch (err) {
	  console.error('Error occurred while sending the message:', err);
	}
  };
  
  // Function to view and enroll in courses
const enrollInCourse = async (userId) => {
	try {
	  const pool = await sql.connect(config);
  
	  // Query to get all available courses
	  const availableCourses = [
		{ course_id: 1, course_name: 'Web Development Bootcamp', provider: 'Udemy' },
		{ course_id: 2, course_name: 'Data Science with Python', provider: 'Coursera' },
		{ course_id: 3, course_name: 'Introduction to Cloud Computing', provider: 'edX' },
	  ];
  
	  if (availableCourses.length === 0) {
		console.log('No courses available at the moment.');
		return;
	  }
  
	  console.log('\nAvailable Courses:');
	  availableCourses.forEach((course) => {
		console.log(`Course ID: ${course.course_id}`);
		console.log(`Course Name: ${course.course_name}`);
		console.log(`Provider: ${course.provider}\n`);
	  });
  
	  // Ask the user to select a course to enroll in
	  const courseId = await askQuestion('Enter the Course ID to enroll in: ');
  
	  // Find the selected course
	  const selectedCourse = availableCourses.find(course => course.course_id === parseInt(courseId));
	  if (!selectedCourse) {
		console.log('Invalid course ID. Please try again.');
		return;
	  } else console.log('You are enrolled !!');
  
	  // Insert into the courses_and_certification table
	  await pool.request()
		.input('userId', sql.Int, userId)
		.input('courseName', sql.VarChar(255), selectedCourse.course_name)
		.input('provider', sql.VarChar(255), selectedCourse.provider)
		.query(`
		  INSERT INTO courses_and_certifications (user_id, course_name, provider)
		  VALUES (@userId, @courseName, @provider)
		`);
  
	  console.log(`You have successfully enrolled in the course: ${selectedCourse.course_name} by ${selectedCourse.provider}`);
	} catch (err) {
	  console.error('Error occurred while enrolling in the course:', err);
	}
  };
  
// Job feature (coming soon)
// Function to search for jobs and apply
const findJobs = async (userId) => {
	console.log(`User ID: ${userId}`);  // Log userId to verify it's correct
	if (!userId) {
	  console.log('User ID is null or undefined!');
	  return;
	}
	const field = await askQuestion('Enter the field in which you want to apply: ');
  
	try {
	  const pool = await sql.connect(config);
	  // Query jobs where the title matches the field entered by the user
	  const result = await pool.request()
		.input('field', sql.VarChar(255), field)
		.query(`
		  SELECT Job_id, Title, Description, Salary, Location 
		  FROM Jobs 
		  WHERE Title LIKE '%' + @field + '%'
		`);
  
	  if (result.recordset.length === 0) {
		console.log('No jobs found for that field.');
		return;
	  }
  
	  console.log(`Found the following jobs in the ${field} field:\n`);
	  result.recordset.forEach((job) => {
		console.log(`Job ID: ${job.Job_id}`);
		console.log(`Title: ${job.Title}`);
		console.log(`Description: ${job.Description}`);
		console.log(`Salary: ${job.Salary}`);
		console.log(`Location: ${job.Location}\n`);
	  });
  
	  const jobId = await askQuestion('Enter the Job ID to apply for or press Enter to skip: ');
  
	  if (jobId) {
		// Ask for the user to apply
		const applyConfirmation = await askQuestion('Are you sure you want to apply for this job? (yes/no): ');
  
		if (applyConfirmation.toLowerCase() === 'yes') {
		  // Insert the application into the database (you might want an 'Applications' table)
		  await pool.request()
			.input('userId', sql.Int, userId)
			.input('jobId', sql.Int, jobId)
			.query(`
			  INSERT INTO applications (User_id, Job_id) 
			  VALUES (@userId, @jobId)
			`);
  
		  console.log('Application submitted successfully!');
		} else {
		  console.log('Application canceled.');
		}
	  }
	} catch (err) {
	  console.error('Error occurred while fetching jobs:', err);
	}
  };
  

// Main feed after login
// Main feed after login
// Main feed after login
const mainFeed = async (userId) => {
	while (true) {
	  console.log('\nMain Feed Options:');
	  console.log('1. Create Post');
	  console.log('2. See Posts');
	  console.log('3. Find Jobs');
	  console.log('4. Send Message');
	  console.log('5. Courses and Certifications');
	  console.log('6. Logout');
  
	  const choice = await askQuestion('Choose an option (1-6): ');
  
	  if (choice === '1') {
		await createPost(userId);
	  } else if (choice === '2') {
		await viewPosts(userId);
	  } else if (choice === '3') {
		await findJobs(userId);
	  } else if (choice === '4') {
		await sendMessage(userId);
	  } else if (choice === '5') {
		await enrollInCourse(userId);  // Call the enrollInCourse function
	  } else if (choice === '6') {
		console.log('Logging out...');
		break;
	  } else {
		console.log('Invalid option. Please try again.');
	  }
	}
  
	rl.close();
  };
  
// Signup Function
const signup = async () => {
  const username = await askQuestion('Enter your username: ');
  const email = await askQuestion('Enter your email: ');
  const password = await askQuestion('Enter your password: ');

  try {
    const pool = await sql.connect(config);
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
    const result = await pool.request()
      .input('username', sql.VarChar(50), username)
      .input('email', sql.VarChar(255), email)
      .input('password', sql.VarChar(255), hashedPassword)
      .query(`
        INSERT INTO Users (username, email, password) 
        OUTPUT Inserted.User_id
        VALUES (@username, @email, @password)
      `);

    console.log('User registered successfully!');
    const userId = result.recordset[0].User_id;
    await mainFeed(userId);
  } catch (err) {
    console.error('Error occurred during signup:', err);
  }
};

// Login Function
const login = async () => {
  const email = await askQuestion('Enter your email: ');
  const password = await askQuestion('Enter your password: ');

  try {
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input('email', sql.VarChar(255), email)
      .query(`
        SELECT User_id, username, email, password
        FROM Users 
        WHERE email = @email
      `);

    if (result.recordset.length > 0) {
      const user = result.recordset[0];
      const isMatch = await bcrypt.compare(password, user.password); // Compare passwords

      if (isMatch) {
        console.log('Login successful!');
        await mainFeed(user.User_id);
      } else {
        console.log('Invalid credentials.');
      }
    } else {
      console.log('No user found with that email.');
    }
  } catch (err) {
    console.error('Error occurred during login:', err);
  }
};

// Main function to prompt the user for action
const main = async () => {
  console.log('1. Signup');
  console.log('2. Login');
  const choice = await askQuestion('Choose an option (1/2): ');

  if (choice === '1') {
    await signup();
  } else if (choice === '2') {
    await login();
  } else {
    console.log('Invalid option.');
    rl.close();
  }
};

// Export the controller object
const authController = {
  signup,
  login,
  createPost,
  viewPosts,
  findJobs,
  mainFeed
};


export default authController;
