let express = require('express')
let db = require('../models')
const category = require('../models/category')
let router = express.Router()

// POST /projects - create a new project
router.post('/', (req, res) => {
  db.project.create({
    name: req.body.name,
    githubLink: req.body.githubLink,
    deployLink: req.body.deployedLink,
    description: req.body.description
  })
  .then((project) => {
    console.log(project.id)
    db.category.findOrCreate({
      where: {
        name: req.body.category
      }
    })
    .then(([category, wasCreated]) => {
      project.addCategory(category)
      .then(()=>{
        res.redirect('/projects/'+project.id)
      })
    })
    
  })
  .catch((error)=>{
    res.status(400).render('main/404')
  })
  
})

// GET /projects/new - display form for creating a new project
router.get('/new', (req, res) => {
  res.render('projects/new')
})

// GET /projects/:id - display a specific project
router.get('/:id', (req, res) => {
  db.project.findOne({
    where: { id: req.params.id }
  })
  .then((project) => {
    if (!project) throw Error()
    project.getCategories()
    .then((cat)=>{
      let cats=[]
      cat.forEach((cate)=>{
        cats.push(cate.dataValues.name)
      })
      res.render('projects/show', { project: project, cats: cats })
    })
    
  })
  .catch((error) => {
    res.status(400).render('main/404')
  })
})

module.exports = router
