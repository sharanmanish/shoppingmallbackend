const router = require('express').Router();
const Product = require('../models/product');

const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const secret = require('../s3cred');

const s3 = new aws.S3({accessKeyId: secret.Access_key_ID, secretAccessKey: secret.Secret_access_key});

const checkJWT = require('../middlewares/check-jwt');

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'manishshopapp',
        metadata: function(req, file, cb) {
            cb(null, { feildName: file.fieldname });
        },
        key: function(req, file, cb) {
            cb(null, new Date().toISOString() + '-' + file.originalname);
        }
    })
});

router.route('/products')
    .get(checkJWT, (req, res, next) => {
        Product.find({ owner: req.decoded.user._id })
            .populate('owner')
            .populate('category')
            .exec((err, products) => {
                if (products) {
                    res.json({
                        success: true,
                        message: "Products",
                        products: products
                    });
                }
            });
    })
    .post([checkJWT, upload.single('product_picture')], (req, res, next) => {
        let product = new Product();
        product.owner = req.decoded.user._id;
        product.category = req.body.categoryId;
        product.title = req.body.title;
        product.price = req.body.price;
        product.description = req.body.description;
        product.image = req.file.location;
        product.save();
        res.json({
            successfull: true,
            message: 'Successfully added the product'
        });
    });

module.exports = router;