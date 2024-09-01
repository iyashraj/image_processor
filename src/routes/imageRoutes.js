const express = require('express');
const { uploadCSVHandler, checkStatusHandler, upload_csv_path, downloadCSVHandler } = require('../controllers/imageController');
const router = express.Router();

// API endpoints
router.post('/upload', upload_csv_path.single('file'), uploadCSVHandler);
router.get('/status/:requestId', checkStatusHandler);
router.get('/webhook/:requestId', downloadCSVHandler);

module.exports = router;