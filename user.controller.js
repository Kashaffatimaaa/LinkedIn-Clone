import sql from 'mssql';
import config from '../lib/db.js'; // Adjust the path as needed

// Function to get suggested connections
export const getSuggestedConnections = async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .query('SELECT * FROM Users'); // You can customize the query as needed

        res.status(200).json(result.recordset);
    } catch (err) {
        console.error('Get Suggested Connections Error:', err);
        res.status(500).json({ error: 'An error occurred while fetching suggested connections.' });
    }
};

// Function to get a public profile of a user by username
export const getPublicProfile = async (req, res) => {
    const { username } = req.params;

    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('username', sql.VarChar, username)
            .query('SELECT * FROM Users WHERE username = @username');

        if (result.recordset.length > 0) {
            res.status(200).json(result.recordset[0]);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (err) {
        console.error('Get Public Profile Error:', err);
        res.status(500).json({ error: 'An error occurred while fetching the public profile.' });
    }
};

// Function to update the user's profile
export const updateProfile = async (req, res) => {
    const { username, email } = req.body;
    const { userId } = req.params;

    try {
        const pool = await sql.connect(config);
        await pool.request()
            .input('username', sql.VarChar, username)
            .input('email', sql.VarChar, email)
            .input('user_id', sql.Int, userId)
            .query('UPDATE Users SET username = @username, email = @email WHERE id = @user_id');

        res.status(200).json({ message: 'Profile updated successfully!' });
    } catch (err) {
        console.error('Update Profile Error:', err);
        res.status(500).json({ error: 'An error occurred while updating the profile.' });
    }
};
