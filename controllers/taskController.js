const Task = require('../models/Task');
const Project = require('../models/Project');
const {validationResult} = require('express-validator');

// create a new task
exports.createTask = async(req, res) => {
    // check for errors
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }

    try {
        // extract project
        const {project} = req.body;
        const oneProject = await Project.findById(project);
        if(!oneProject){
            return res.status(404).json({msg: 'Project not found'});
        }

        // check if the current project belongs to the authenticated user        
        if (oneProject.creator.toString() !== req.user.id) {
            return res.status(401).json({msg: 'Not authorized'})
        }

        // create the task
        const task = new Task(req.body);

        await task.save();
        res.json({task});

    } catch (error) {
        console.log(error);
        res.status(500).send('Error');
    }
}

// get tasks by project
exports.getTasks = async(req, res) => {
    try {
        // extract project
        const {project} = req.query;
       
        const oneProject = await Project.findById(project);
        if(!oneProject){
            return res.status(404).json({msg: 'Project not found'});
        }
        
        // check if the current project belongs to the authenticated user        
        if (oneProject.creator.toString() !== req.user.id) {
            return res.status(401).json({msg: 'Not authorized'})
        }

        // get tasks by project
        const tasks = await Task.find({ project});
        res.json( {tasks});
    } catch (error) {
        console.log(error);
        res.status(500).send('Error');
        
    }
}

// update a task
exports.updateTask = async (req, res ) => {
    try {
        // extract project, task name and task state
        const {project, name, state } = req.body;
        //console.log(req);
        // check if task exists 
        let oneTask = await Task.findById(req.params.id);
        if(!oneTask){
            return res.status(401).json({msg: 'Nonexistent task'})

        }

        // extract project
        const oneProject = await Project.findById(project);

        // check if the current project belongs to the authenticated user        
        if (oneProject.creator.toString() !== req.user.id) {
            return res.status(401).json({msg: 'Not authorized'})
        }


        const newTask = {};

        newTask.name = name;
        newTask.state = state;
        
        // save 
        
        const task = await Task.findOneAndUpdate({ _id: req.params.id}, newTask, { new: true });
        res.json({task});

    } catch (error) {
        console.log(error);
        res.status(500).send('Error');
    }
}

// // delete a task
exports.deleteTask = async (req, res) => {
    try {
        // extract project
        const {project } = req.query;
        // check if task exists 
        let oneTask = await Task.findById(req.params.id);
        if(!oneTask){
            return res.status(401).json({msg: 'Nonexistent task'})

        }

        // extract project
        const oneProject = await Project.findById(project);

        // check if the current project belongs to the authenticated user        
        if (oneProject.creator.toString() !== req.user.id) {
            return res.status(401).json({msg: 'Not authorized'})
        }

        // delete project
        await Task.findOneAndRemove({_id: req.params.id});
        res.json({msg: 'The task was deleted'});
        
    } catch (error) {
        console.log(error);
        res.status(500).send('Error');
    }
}