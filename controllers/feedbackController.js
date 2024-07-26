const sql = require('mssql');
const dbConfig = require('../dbConfig');

exports.submitFeedback = async (req, res) => {
    const { email, title, message } = req.body;

    try {
        await sql.connect(dbConfig);

        const userResult = await sql.query`SELECT name FROM Users WHERE email = ${email}`;
        
        if (userResult.recordset.length === 0) {
            console.error('User not found for email:', email);
            return res.status(404).json({ message: 'User not found' });
        }

        const name = userResult.recordset[0].name;
        console.log('Retrieved name:', name);

        if (!name) {
            console.error('Name is null for email:', email);
            return res.status(500).json({ message: 'Error retrieving user name' });
        }

        await sql.query`
            INSERT INTO Feedback (email, name, title, message)
            VALUES (${email}, ${name}, ${title}, ${message})
        `;

        res.status(200).json({ message: 'Feedback submitted successfully' });
    } catch (error) {
        console.error('Error submitting feedback:', error);
        res.status(500).json({ message: 'Error submitting feedback' });
    }
};

exports.getFeedback = async (req, res) => {
    try {
        await sql.connect(dbConfig);
        const result = await sql.query`SELECT * FROM Feedback`;
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error('Error retrieving feedback:', error);
        res.status(500).json({ message: 'Error retrieving feedback' });
    }
};
