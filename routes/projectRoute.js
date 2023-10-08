const express = require('express');
const router = express.Router();
const { addListing,latestListing ,projectPhotoController,projectsByDomain,createFeed,getFeeds,getSingleProject,getProjectsByUserId,commentEntry, getAllListings} = require('../controllers/projectController.js');
const multer = require('multer');
const { requireSignIn } = require('../controllers/Middleware.js');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
router.post('/test' ,requireSignIn, addListing);
router.post('/addlisting' ,upload.single('photo'),requireSignIn, addListing);
router.get('/latest-projects',latestListing)
router.get("/projectphoto/:pid", projectPhotoController);
router.get('/projects-by-domain', projectsByDomain);
router.post('/createfeed', createFeed);
router.get('/getfeeds', getFeeds);
router.get('/:projectId', getSingleProject);
router.get('/getproject/:userId',requireSignIn, getProjectsByUserId);
router.post('/entries/:userId',requireSignIn, commentEntry);
// router.post('/notifications', getAllComments);
module.exports = router;
