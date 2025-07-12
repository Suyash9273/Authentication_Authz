const express = require('express');
const app = express();

require('dotenv').config();
const PORT = process.env.PORT || 4000;

app.use(express.json());

const connectDB = require("./config/db");
connectDB();
const route = require("./routes/route");
app.use("/api/v1", route);

//activate: 
app.listen(PORT, () => {
    console.log(`App is listening at port: ${PORT}`);
})
