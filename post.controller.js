import sql from 'mssql';
import config from '../lib/db.js';

// Create Post function
const createPost = async (userId) => {
    const title = await askQuestion('Enter post title: ');
    const content = await askQuestion('Enter post content: ');

    try {
        const pool = await sql.connect(config);
        await pool.request()
            .input('title', sql.VarChar, title)
            .input('content', sql.Text, content)
            .input('userId', sql.Int, userId)
            .query('INSERT INTO posts (title, content, userId) VALUES (@title, @content, @userId)');

        console.log('Post created successfully!');
        rl.close();
    } catch (err) {
        console.error('Create Post Error:', err);
        rl.close();
    }
};

// View Posts function
const viewPosts = async () => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query('SELECT * FROM posts');

        if (result.recordset.length > 0) {
            result.recordset.forEach(post => {
                console.log(`Title: ${post.title}`);
                console.log(`Content: ${post.content}`);
                console.log('1. Like');
                console.log('2. Comment');
                console.log('Choose an option (1/2):');
                rl.question('', async (option) => {
                    if (option === '1') {
                        await likePost(post.Post_id);
                    } else if (option === '2') {
                        await commentOnPost(post.Post_id);
                    } else {
                        console.log('Invalid option');
                    }
                });
            });
        } else {
            console.log('No posts found.');
        }
    } catch (err) {
        console.error('Get Posts Error:', err);
    }
};

// Like a Post function
const likePost = async (postId) => {
    try {
        const pool = await sql.connect(config);
        await pool.request()
            .input('postId', sql.Int, postId)
            .query('UPDATE posts SET likes = likes + 1 WHERE Post_id = @postId');
        console.log('Post liked!');
        rl.close();
    } catch (err) {
        console.error('Like Post Error:', err);
        rl.close();
    }
};

// Comment on a Post function
const commentOnPost = async (postId) => {
    const commentText = await askQuestion('Enter your comment: ');

    try {
        const pool = await sql.connect(config);
        await pool.request()
            .input('postId', sql.Int, postId)
            .input('commentText', sql.Text, commentText)
            .query('INSERT INTO Comments (PostId, CommentText) VALUES (@postId, @commentText)');
        console.log('Comment added!');
        rl.close();
    } catch (err) {
        console.error('Comment Post Error:', err);
        rl.close();
    }
};

export { createPost, viewPosts, likePost, commentOnPost };
