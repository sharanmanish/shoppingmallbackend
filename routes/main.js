const router = require('express').Router();
const Category = require('../models/category');

router.route('/categories')
  .get((req, res, next) => {
    Category.find({}, (err, categories) => {
      res.json({
        success: true,
        message: "Success",
        categories: categories
      })
    })
  })
  .post((req, res, next) => {
    Category.findOne({ name: req.body.category }, (err, category) => {
      if (category) {
        res.json("already exist")
      } else {
          
        let category = new Category();

        category.name = req.body.category;
        category.save();
        res.json({
          success: true,
          message: "Successful"
        });
      }
    });
  });

module.exports = router;