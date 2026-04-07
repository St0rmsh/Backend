import dotenv from 'dotenv';

dotenv.config();



const config = {
  PORT: process.env.PORT || 5000,
  googleClientId: process.env.GOOGLE_CLIENT_ID || '',
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  googleRedirectUri: process.env.GOOGLE_REDIRECT_URI || '',
};



export default config;