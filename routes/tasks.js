const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const auth = require('../middleware/auth');
const {check}  = require('express-validator');

// create a new task
// api/tasks
router.post('/',
    auth,
    [
        check('name', 'Task name is required').not().isEmpty(),
        check('project', 'The project is required').not().isEmpty()
    ],
    taskController.createTask
);

// get tasks by project
router.get('/',
    auth,
    taskController.getTasks
);

// update task
router.put('/:id',
    auth,
    taskController.updateTask
);

// delete a task
router.delete('/:id',
    auth,
    taskController.deleteTask
);


module.exports = router;