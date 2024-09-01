
# Image Processing System
## Overview

This project is an image processing system that efficiently processes image data from CSV files. The system accepts a CSV file containing multiple image URLs, compresses the images, and stores the processed images along with product information in a database. It also supports asynchronous processing, status tracking, and webhook which download a CSV containing compressed output urls.

## Features

- **CSV Upload**: Accepts a CSV file with product information and image URLs.
- **Asynchronous Processing**: Images are processed asynchronously, allowing large batches to be handled efficiently.
- **Image Compression**: Compresses images to 50% of their original quality.
- **Database Storage**: Stores processed image data and product information in MongoDB.
- **Status Tracking**: Allows users to check the processing status using a unique request ID.
- **Output CSV Generation**: Generates an output CSV file with the original and processed image URLs.

## Tech Stack

- **Backend**: Node.js (20.17.0), Express.js
- **Database**: MongoDB (Mongoose)
- **Image Processing**: Sharp
- **HTTP Requests**: Axios
- **CSV Parsing**: csv-parser, csv-writer
- **Environment Management**: dotenv
- **Task Runner**: nodemon

## Installation

1. **Clone the repository:**

   \`\`\`bash
   git clone https://github.com/iyashraj/image_processor.git
   cd image-processor
   \`\`\`

2. **Install dependencies:**

   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables:**

   Create a \`.env\` file in the root directory and add the following:

   \`\`\`plaintext
   MONGO_URI=mongodb://localhost:27017/image_processor_task
   PORT=5000
   \`\`\`

4. **Run the application:**

   Start the app with nodemon to automatically reload on changes:

   \`\`\`bash
   npm run dev
   \`\`\`

## API Endpoints ([Documentation](https://docs.google.com/document/d/1a5dYuNadwl5GBeHCcrAoZDU3zIA8O3SItthewq2Bc8U/edit?usp=sharing)) || ([Low-Level Design (LLD)](https://drive.google.com/file/d/1ryHe9-uoLMBa0fcpkABVpBKkE4ikImIe/view?usp=drive_link)

### 1. **Upload CSV**

- **Endpoint:** \`POST /api/v1/upload\`
- **Description:** Uploads a CSV file, initiates asynchronous image processing, and returns a unique request ID.
- **Request:**
  - \`Content-Type\`: \`multipart/form-data\`
  - \`file\`: The CSV file to be processed.
  - \`webhookUrl\` (optional): The URL to be notified once processing is complete.
  - **Dummy CSV file:** Use this CSV file [Download](https://drive.google.com/file/d/1x06MdI5ob0yNG9vUoEXFfZqKW9da-FBa/edit)
    
- **Response:**

  \`\`\`json
  {
    "requestId": "unique-request-id"
  }
  \`\`\`

### 2. **Check Status**

- **Endpoint:** \`GET /api/v1/status/:requestId\`
- **Description:** Checks the processing status of images associated with the provided request ID.
- **Response:**

  \`\`\`json
  {
    "status": "pending | in_progress | completed | failed",
    "products": [
      {
        "serialNumber": "12345678",
        "productName": "SKU5",
        "inputImageUrls": ["https://sample1.jpg", "https://sample2.jpg"],
        "outputImageUrls": ["compressed_url1", "compressed_url2"]
      }
    ]
  }
  \`\`\`



## Database Schema

### 1. **Request Model**

- \`requestId\`: Unique ID for each request.
- \`status\`: Status of the image processing (\`pending\`, \`in_progress\`, \`completed\`, \`failed\`).
- \`createdAt\`: Timestamp of request creation.
- \`updatedAt\`: Timestamp of the last update.

### 2. **Product Model**

- \`serialNumber\`: Serial number of the product.
- \`productName\`: Name of the product.
- \`inputImageUrls\`: Array of input image URLs.
- \`outputImageUrls\`: Array of processed (compressed) image URLs.
- \`requestId\`: Reference to the associated request.

## Asynchronous Processing

### Image Worker

Images are processed asynchronously using a worker that:
- Downloads and compresses images using Sharp.
- Stores the processed image URLs in the database.
- Generates an output CSV file with both input and output image URLs.
- Triggers the provided webhook URL upon completion.

### Output CSV Format

- **Column 1:** Serial Number
- **Column 2:** Product Name
- **Column 3:** Input Image URLs (comma-separated)
- **Column 4:** Output Image URLs (comma-separated, in the same sequence as input)

## Testing the API

A Postman collection is available for testing the API. You can import the collection using the following link:

[Postman Collection Link](https://drive.google.com/file/d/1DN_4DRLTZOVP8HNd0ezn24N0dEa2-bVx/view?usp=sharing)

## Author - Yash Raj
## Connect 🔭
- **Email  :** yashr3037@gmail.com
- **LinkedIn  :**
 [https://linkedin.com/in/yash-raj-06710020a](https://linkedin.com/in/yash-raj-06710020a)
 - **Github  :**
[https://github.com/iyashraj/](https://github.com/iyashraj/)
- **Twitter  :** - [https://twitter.com/singlethreaddev](https://twitter.com/singlethreaddev)
