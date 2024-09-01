const Product = require('../models/product');
const Request = require('../models/request');
const { processImageHandler } = require('../services/imageService');
const { v4: uuidv4 } = require('uuid');


async function processImagesForRequest(requestId) {
  const products = await Product.find({ requestId });

  try {
    for (const product of products) {
      const outputImageUrls = [];
      for (const url of product.inputImageUrls) {
        const img_id = uuidv4();
        const outputImagePath = await processImageHandler(url, img_id);
        outputImageUrls.push(outputImagePath); // Replace with actual upload logic
      }

      // Update product with output image URLs
      await Product.findByIdAndUpdate(product._id, {
        outputImageUrls,
      });
    }

    // Update request status to completed
    await Request.findByIdAndUpdate(requestId, {
      status: 'completed',
    });

  } catch (error) {
    console.error(`Error processing images for request ${requestId}: `, error);
    // Update request status to failed
    await Request.findByIdAndUpdate(requestId, {
      status: 'failed',
    });
  }
}

module.exports = {
  processImagesForRequest,
};