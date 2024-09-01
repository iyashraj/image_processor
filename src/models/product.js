const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  serialNumber: String,
  productName: String,
  inputImageUrls: [String],
  outputImageUrls: [String],
  requestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Request',
  },
});

module.exports = mongoose.model('Product', ProductSchema);