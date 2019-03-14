const router = require('express').Router();
const Product = require('../models/product');

const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const secret = require('../s3cred');

const s3 = new aws.S3({accessKeyId: secret.Access_key_ID, secretAccessKey: secret.Secret_access_key})

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'manishshopapp',
        metadata: function(req, file, cb) {
            cb(null, { feildName: file.fieldName });
        },
        key: function(req, file, cb) {
            cb(null, { feildName: file.fieldName });
        }
    })
});

module.exports = router;