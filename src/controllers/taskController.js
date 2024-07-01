const Task = require('../models/taskModel');
const HttpStatusCode = require('../utils/httpStatusCode');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const task = [
    {
        id: 1,
        text: 'Doctor Appointment',
        day: 'Feb 5th at 2:30pm',
        reminder: true
    }, 
    {
        id: 2,
        text: 'Meeting at School',
        day: 'Feb 6th at 1:30pm',
        reminder: true
    },
    {
        id: 3,
        text: 'Food Shopping',
        day: 'Feb 5th at 2:30pm',
        reminder: false
    },
    {
        id: 4,
        text: 'Food Shopping',
        day: 'Feb 5th at 2:30pm',
        reminder: false
    }
];

const getAllTasks = catchAsync( async (req, res, next) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const query = Task.find().skip(skip).limit(limit).sort({createdAt: -1});
    const result = await query.select('-__v');
    const total = await Task.countDocuments();
    const totalPage = Math.ceil(total / limit);
    const currentPage = page;

    res.status(HttpStatusCode.OK).json({
        status: 'success',
        total: total,
        totalPage: totalPage,
        currentPage: currentPage,
        data: {
            tasks: result
        }
    })
})

const getTask = catchAsync( async (req, res, next) => {
    const taskId = req.params.id;
    const query = Task.findById(taskId);
    const result = await query.select('-__v');

    // const id = parseInt(req.params.id);
    // const task = tasks.find((t) => t.id === id);
    // console.log(task);
    res.status(HttpStatusCode.OK).json({
        status: 'success',
        result: 1,
        requestedTime: req.requestTime,
        data: {
            task: result
        }
    })
})

const createTask = catchAsync( async (req, res, next) => {
    const body = req.body;
    const newTask = await Task.create({
        text: body.text,
        day: body.day,
        reminder: body.reminder
    });

    res.status(HttpStatusCode.CREATED).json({
        status: 'success',
        data: {
            task: newTask
        }
    })
})

const patchTask = catchAsync( async (req, res, next) => {
    const taskId = req.params.id;
    const task = await Task.findByIdAndUpdate(taskId, req.body, {
        new: true,
    });

    // const id = parseInt(req.params.id);

    // if (!tasks[id - 1]) {
    //     res.status(HttpStatusCode.NOT_FOUND).json({
    //         status: 'fail',
    //         message: 'No task with that id'
    //     })
    // }

    // tasks[id - 1].text = req.body.text;

    // const task = tasks.find((t) => t.id === id);

    res.status(HttpStatusCode.OK).json({
        status: 'success',
        data: {
            task
        }
    })
})

const putTask = catchAsync( async (req, res, next) => {
    const body = req.body;

    const task = tasks.find((t) => t.id === body.id);
    if (task) {
        const index = tasks.length - 1;
        tasks[index].text = req.body.text;
        tasks[index].day = req.body.day;
        tasks[index].reminder = req.body.reminder;

        const task = tasks.find((t) => t.id === body.id);

        res.status(HttpStatusCode.OK).json({
            status: 'success',
            data: {
                task
            }
        })
    } else {
        const id = tasks.length + 1;
        body.id = id;

        const newTask = {
            ...body
        }

        tasks.push(newTask);

        res.status(HttpStatusCode.CREATED).json({
            status: 'success',
            data: {
                tasks: newTask
            }
        })
    }
})

const deleteTask = catchAsync( async (req, res, next) => {
    const taskId = req.params.id;
    await Task.findByIdAndDelete(taskId);

    // const id = parseInt(req.params.id);
    // if (!tasks[id - 1]) {
    //     res.status(HttpStatusCode.NOT_FOUND).json({
    //         status: 'fail',
    //         message: 'No task with that id'
    //     })
    // }

    // tasks.splice(id - 1, 1);

    res.status(HttpStatusCode.NO_CONTENT).json({
        status: 'success',
        data: null
    })
})

module.exports = {
    getAllTasks,
    getTask,
    createTask,
    patchTask,
    putTask,
    deleteTask
}