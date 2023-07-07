require('dotenv').config();

const sessionSecret=process.env.SESSION_SECRET;

const emailUser=process.env.EMAIL_USER;
const emailPassword=process.env.EMAIL_PASSWORD;

const JWT_EXP=process.env.JMT_EXP;

/*const sessionSecret="mysitesessionsecret";

const emailUser="balodepriyanka0@gmail.com";
const emailPassword="fpoaokmqbvgkgflt";

const JWT_EXP="2m";*/

module.exports={
    sessionSecret,
    emailUser,
    emailPassword,
    JWT_EXP

}