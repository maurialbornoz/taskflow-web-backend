const Project = require('../models/Project');
const { validationResult }  = require('express-validator');
const Task = require('../models/Task');

exports.createProject = async ( req, res) => {

    // check for errors
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }

    try {
        // create new project
        const project = new Project(req.body);

        // save creator using jwt
        project.creator = req.user.id;


        //save project
        project.save();
        res.json(project);
    } catch (error) {
        console.log(Error);
        res.status(500).send("Error");
    }
}

// get projects of current user
exports.getProjects = async (req, res) => {
    try {
        const projects = await Project.find({ creator: req.user.id });
        res.json({projects});
    } catch (error) {
        console.log(error);
        res.status(500).send('Error');
    }
}

// update a project 
exports.updateProject = async(req, res) => {
    // check for errors
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }

    // extract information of project
    const {name} = req.body;
    const newProject = {};

    if (name) {
        newProject.name = name;
    }

    try {

        // check project id
       let project = await Project.findById(req.params.id);

        // if project exists
        if (!project) {
            return res.status(404).json({msg: 'Project not found'});
            
        }

        // verify project creator
        if (project.creator.toString() !== req.user.id) {
            return res.status(401).json({msg: 'Not authorized'})
        }

        // update
        project = await Project.findByIdAndUpdate({_id: req.params.id}, {$set: newProject}, {new: true});
        res.json({project});
        
    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
        
    }

}

// delete a project by id
exports.deleteProject = async( req, res) => {
    try {
        // check project id
        let project = await Project.findById(req.params.id);

        // if project exists
        if (!project) {
            return res.status(404).json({msg: 'Project not found'});
            
        }

        // verify project creator
        if (project.creator.toString() !== req.user.id) {
            return res.status(401).json({msg: 'Not authorized'})
        }
        
        // delete project
        await Project.findOneAndRemove({_id: req.params.id});
        await Task.deleteMany({project: req.params.id});
        res.json({msg: 'The project was deleted'})
    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
    }
}