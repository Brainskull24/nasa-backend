const express = require('express');
const router = express.Router();
const { addListing,latestListing } = require('../controllers/projectController.js');
const multer = require('multer');
const { requireSignIn } = require('../controllers/Middleware.js');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
router.post('/test' ,requireSignIn, addListing);
router.post('/addlisting' ,upload.single('photo'), addListing);
router.get('/latest-projects',latestListing)

module.exports = router;
