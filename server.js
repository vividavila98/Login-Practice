const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());

// DB Config
const uri = require("./config/keys").mongoURI;

// Connect to MongoDB
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.error(err));

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server up and running on port ${port}!!`));
