const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');

const userRoutes = require('./routes/user');

const app = express();



mongoose.connect('mongodb://localhost:27017/users')
.then(() => {
	console.log("Connected to database");
})
.catch(() => {
	console.log('connection failed');
})


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));
app.use('/images', express.static(path.join("images")));

app.use(userRoutes);


app.listen(3000, () => {
	console.log('Server running...');
});