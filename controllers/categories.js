let express = require('express')
let db = require('../models')
const project = require('../models/project')
let router = express.Router()
const category = require('../models/category')

router.get('/', (req,res)=>{
    db.category.findAll()
    .then((cats)=>{
        let categories = []
        cats.forEach((cat)=>{
            categories.push(cat.dataValues)
        })
        res.render('categories/show', {categories})
    })
})

router.get('/:id', (req, res) => {
    db.category.findOne({
      where: { id: req.params.id }
    })
    .then((category) => {
      if (!category) throw Error()
      category.getProjects()
      .then((proj)=>{
        let projs=[]
        proj.forEach((proj)=>{
          projs.push(proj.dataValues)
        })
        res.render('categories/showproj',{projs, category})
      })
      
    })
    .catch((error) => {
      res.status(400).render('main/404')
    })
  })






module.exports = router