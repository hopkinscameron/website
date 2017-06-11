//load environment variables
require('dotenv').config();

// export for other uses
module.exports = {
    // the application port
    port: process.env.PORT,
    // the db connection
    db: process.env.MONGODB || 'mongodb://localhost:27017/personal_website',
    // the db username
    db_user: process.env.DB_USER,
    // the db password
    db_pass: process.env.DB_PASS
};