const express = require('express');

const dotenv = require('dotenv');
dotenv.config();

const { connectToMongoose } = require('./utils/mongo');

const api = require('./api/routes');

const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());

app.use('/', api);

// Catch any forwarded next()
app.use('*', function (req, res, next) {
    res.status(404).json({
        error: "Requested resource " + req.originalUrl + " does not exist"
    });
});

// Catch any uncatched error thrown by the endpoints
app.use('*', function (err, req, res, next) {
    console.error("== Error:", err)
    res.status(500).json({
        err: "Server error.  Please try again later."
    });
});

app.listen(port, function() {
    connectToMongoose();
    console.log("== Server is running on port", port);
});