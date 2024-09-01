const axios = require('axios');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');


async function downloadImageHandler(url, filepath) {
  const response = await axios({
    url,
    responseType: 'stream',
  });

  return new Promise((resolve, reject) => {
    const writer = fs.createWriteStream(filepath);
    response.data.pipe(writer);
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
}

// This function compress the image to 50% quality
async function compressImageHandler(inputPath, outputPath) {
  return sharp(inputPath)
    .jpeg({ quality: 50 })
    .toFile(outputPath);
}

// This function store the input and compressed output image in output file dirc
async function processImageHandler(url, id) {
  const inputPath = path.join(__dirname, `../../temp/input/${id}.jpg`);
  const outputPath = path.join(__dirname, `../../temp/output/${id}.jpg`);
  
  await downloadImageHandler(url, inputPath);
  await compressImageHandler(inputPath, outputPath);
  
  return outputPath;
}

module.exports = {
  processImageHandler,
};