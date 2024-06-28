const express = require('express');
const HttpStatusCode = require('./utils/httpStatusCode.js');
const { getAllTasks, getTask, createTask, patchTask, deleteTask, putTask } = require('./controllers/taskController.js');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const globalErrorHandler = require('./utils/globalErrorHandler.js');
const morgan = require('morgan');

dotenv.config({
    path: './.env'
});

// express app
const app = express();

app.use(express.json());

app.use(morgan('common'));

app.use((req, res, next) => {
    //console.log('Hello from the middleware');
    req.requestTime = new Date().toISOString();
    next();
});

// // express env
// console.log(app.get('env'));
// // node env
// console.log(process.env);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/api/v1/tasks', getAllTasks);

app.get('/api/v1/tasks/:id/:dest?/:place?', getTask);

app.post('/api/v1/tasks', createTask);

app.patch('/api/v1/tasks/:id', patchTask);

app.delete('/api/v1/tasks/:id', deleteTask);

app.put('/api/v1/tasks', putTask);

app.all('*', (req, res, next) => {
    // res.status(HttpStatusCode.NOT_FOUND).json({
    //     status: 'fail',
    //     message: `Can't find ${req.originalUrl} on this server!`
    // })
    // const err = new Error(`Can't find ${req.originalUrl} on this server!`);
    // err.statusCode = HttpStatusCode.NOT_FOUND;
    // err.status = 'fail';
    
    next(AppError(`Can't find ${req.originalUrl} on this server!`, HttpStatusCode.NOT_FOUND));
});


// error handler - middleware
app.use(globalErrorHandler);

// setup the DB connection String
const DB = process.env.MONGO_DB_CONNECTION.replace('<password>', process.env.MONGO_DB_PASSWORD);
// connect to mongo DB
mongoose.connect(DB).then(
    () => console.log('DB connection successful!'))
    .catch((err) => console.log(err)
);

app.listen(3000, () => console.log('Listening on port 3000'));