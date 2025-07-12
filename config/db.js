const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config()
const MONGODB_URI = process.env.MONGODB_URI;

const connectDB = () => {
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => console.log("DB connected successfully .."))
  .catch((err) => {
    console.log("Issue In DB connection...")
    console.error(err.message);
    process.exit(1)
  })
}

module.exports = connectDB;