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
    db_pass: process.env.DB_PASS,
    // personal email
    personal_email: process.env.PERSONAL_EMAIL,
    // the smtp host
    smtp_host: process.env.SMTP_HOST,
    // the smtp username
    smtp_email: process.env.SMTP_EMAIL,
    // the smtp password
    smtp_pass: process.env.SMTP_PASS,
    // the google shorten url key
    google_shorten_url_key: process.env.GOOGLE_SHORTEN_URL_API_KEY,
    // the google send email script key
    google_send_email_script_key: process.env.GOOGLE_SEND_EMAIL_SCRIPT_KEY
};