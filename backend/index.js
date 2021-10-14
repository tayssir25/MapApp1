const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const app = express();
const listingRoute = require("./routes/listings");
const userRoute = require("./routes/users");

require ('dotenv').config();

app.use(cors());
app.use(express.json())

mongoose.connect("mongodb://localhost:27017/mapDB",
{UseNewUrlParser : true, useUnifiedTopology: true,}, (err) => {
    if(!err) {
        console.log("successfully connected");
    }
    else {
        console.log("error connection to the data base !");
        console.log(err);
    }
});
const connection = mongoose.connection;
connection.once('open', () => {
    console.clear() 
    console.log("MongoDB database connection established successfully");
})

app.use("/listings", listingRoute);
app.use("/users", userRoute);

app.listen(5000,()=>{
    console.log("backend server is running on port 5000")
})

