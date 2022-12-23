const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const auth = require('../middleware/auth');
const {check}  = require('express-validator');

// api/projects
// create projects
router.post('/',
    auth,
    [
        check('name', 'Project name is required').not().isEmpty()
    ],
    projectController.createProject
)
// get all projects
router.get('/',
    auth,
    projectController.getProjects
)
// update project with id
router.put('/:id',
    auth,
    [
        check('name', 'Project name is required').not().isEmpty()
    ],
    projectController.updateProject
);

// delete a project
router.delete('/:id',
    auth,
    projectController.deleteProject
);


module.exports = router;