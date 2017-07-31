// load environment variables
require('dotenv').config();

// export for other uses
module.exports = {
    // the application host
    host: process.env.HOST,
    // the application port
    port: process.env.PORT,
    // the application domain
    domain: process.env.DOMAIN,
    // the db connection
    db: process.env.MONGODB || 'mongodb://localhost:27017/personal_website',
    // the db username
    db_user: process.env.DB_USER,
    // the db password
    db_pass: process.env.DB_PASS,
    // salt rounds
    salt_rounds: parseInt(process.env.SALT_ROUNDS),
    // session secret
    session_secret: process.env.SESSION_SECRET,
    // personal email
    personal_email: process.env.MAILER_FROM,
    // the smtp host
    smtp_host: process.env.MAILER_SERVICE_PROVIDER,
    // the smtp username
    smtp_email: process.env.MAILER_EMAIL_ID,
    // the smtp password
    smtp_pass: process.env.MAILER_PASSWORD,
    // the google shorten url key
    google_shorten_url_key: process.env.GOOGLE_SHORTEN_URL_API_KEY,
    // the google send email script key
    google_send_email_script_key: process.env.GOOGLE_SEND_EMAIL_SCRIPT_KEY,
    // TODO: temporary, used for testing.. remove before production
    credentials_username: process.env.CREDENTIALS_USERNAME,
    // TODO: temporary, used for testing.. remove before production
    credentials_password: process.env.CREDENTIALS_PASSWORD,
    // the logging format
    log_format: process.env.LOG_FORMAT,
    // the log directory path
    log_dir_path: undefined, //process.env.LOG_DIR_PATH,
    // the log file/name
    log_file: process.env.LOG_FILE
};