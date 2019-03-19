const router = require('express').Router();
const Product = require('../models/product');

const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const secret = require('../s3cred');

const s3 = new aws.S3({accessKeyId: secret.Access_key_ID, secretAccessKey: secret.Secret_access_key});

const faker = require('faker');

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
            success: true,
            message: 'Successfully added the product'
        });
    });

    // just for testing
    router.get('/faker/test', (req, res, next) => {
        for (i = 0; i < 20; i++) {
            let product = new Product();
            product.category = "5c8a85c82a9bb31d20fe36ff";
            product.owner = "5c7eb17ba2b14320e0a06d1f";
            product.image = faker.image.fashion().replace(/^http:\/\//i, 'https://') + "/";
            product.title = faker.commerce.productName();
            product.description = faker.lorem.words();
            product.price = faker.commerce.price();
            product.save();
        }

        res.json({
            message: "Successfully added 20 products",
        })
    })

module.exports = router;