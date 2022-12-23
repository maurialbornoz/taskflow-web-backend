const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');


const app = express();

// connect to database
connectDB();

// enable cors
app.use(cors());


// enable express.json
app.use(express.json({ extended: true}));
app.use(express.static('../client/build'))

const port = process.env.PORT || 4000;

// import routes
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/tasks', require('./routes/tasks'));

// start app
app.listen(port, '0.0.0.0', () => {
    console.log(`Server running in port ${port}`);
});