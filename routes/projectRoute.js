const express = require('express');
const router = express.Router();
const { addListing } = require('../controllers/projectController.js');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
router.post('/addlisting' ,upload.single('photo'), addListing);

module.exports = router;
