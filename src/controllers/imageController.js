const multer = require('multer');
const { parse } = require('json2csv');
const csvParser = require('csv-parser');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const Product = require('../models/product');
const Request = require('../models/request');
const { processImagesForRequest } = require('../utils/imageWorker');

const upload_csv_path = multer({ dest: 'uploaded_csv/' });

// This handler parse the CSV
function parseCSVHandler(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (data) => results.push(data)) 
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
}

// This handler will upload the CSV and create a Request and multiple Product table entries
async function uploadCSVHandler(req, res) {
  const requestId = uuidv4();
  
  // Create a new entry in the request table
  const newRequest = await Request.create({
    requestId,
    status: 'pending',
  });

  const csvFilePath = req.file.path;
  const records = await parseCSVHandler(csvFilePath);

  // Store each product in the product table
  for (const rec of records) {
    const { SerialNumber, ProductName, InputImageUrls } = rec;
    const inputImageUrls = InputImageUrls.split(',');

    await Product.create({
      serialNumber: SerialNumber,
      productName: ProductName,
      inputImageUrls,
      requestId: newRequest._id,
    });
  }

  // Set request status to 'in_progress'
  await Request.findByIdAndUpdate(newRequest._id, { status: 'in_progress' });

  // Process images asynchronously
  processImagesForRequest(newRequest._id);

  res.json({ requestId });
}

// This hanlder will check the uploaded csv status and use request_id for that
async function checkStatusHandler(req, res) {
  const { requestId } = req.params;
  const request = await Request.findOne({ requestId });

  // Gnerate error if request id is invalid
  if (!request) {
    return res.status(404).json({ error: 'Request ID not found!' });
  }

  // Fetch products using request id
  const products = await Product.find({ requestId: request._id });

  const productDetails = products.map((product) => ({
    serialNumber: product.serialNumber,
    productName: product.productName,
    inputImageUrls: product.inputImageUrls,
    outputImageUrls: product.outputImageUrls,
  }));

  res.json({ status: request.status, products: productDetails });
}

// This handler return a CSV data file including outputImageUrls
async function downloadCSVHandler(req, res) {
  const { requestId } = req.params;
  const request = await Request.findOne({ requestId });
  try {
      const products = await Product.find().lean();

      // Specify the fields you want in the CSV
      const fields = ['serialNumber', 'productName', 'inputImageUrls', 'outputImageUrls'];
      const opts = { fields };

      // Generate CSV
      const csv = parse(products, opts);

      res.header('Content-Type', 'text/csv');
      res.attachment('products.csv');
      res.send(csv);

  } catch (err) {
      console.error('Error generating CSV:', err);
      res.status(500).json({ error: 'Failed to generate CSV' });
  }
}

module.exports = {
  uploadCSVHandler,
  checkStatusHandler,
  upload_csv_path,
  downloadCSVHandler
};