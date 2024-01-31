const multer = require("multer");
const { BlobServiceClient } = require("@azure/storage-blob");
const extract = require("./ocr");
// const successResponse = require('#response');

const multerMiddleware = multer({
  dest: "/uploads",
  limits: { fileSize: 100000 * 1024, files: 1 },
}).single("file");

const handleUpload = async (req, res) => {
  const connectionString = process.env.AZURE_STORAGE_CONN; // replace with your storage account connection string
  const containerName = "test-ocr"; // replace with your container name
  const blobName = req.file.originalname; // replace with your blob name
  const filePath = req.file.path; // replace with the path to the file you want to upload

  //   Create a blob service client
  const blobServiceClient =
    BlobServiceClient.fromConnectionString(connectionString);

  // Get a reference to a container
  const containerClient = blobServiceClient.getContainerClient(containerName);

  // Get a block blob client
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  // Upload the blob
  const uploadBlobResponse = await blockBlobClient.uploadFile(filePath, {
    // onProgress: (ev) => {
    //   const uploadedBytes = ev.loadedBytes;
    //   //   console.log(`Uploaded: ${uploadedBytes} bytes of ${req.file.size} bytes`);
    //   console.log(
    //     `Uploaded ${Math.round((uploadedBytes / req.file.size) * 100)}%`
    //   );
    // }
  });
  // const blobName = "IMG_20240128_194405_699.jpg";
  const { content, keyValuePairs, styles } = await extract({
    formUrl: `https://aispfiles.blob.core.windows.net/test-ocr/${blobName}`,
  });

  return res.send({
    blobName,
    content,
    keyValuePairs,
    styles
    // message: `Upload file ${blobName} successfully of ${Math.ceil(
    //   req.file.size / 1024
    // )}KB, Request Id: ${uploadBlobResponse?.requestId || ""}`,
  });
};

module.exports = { multerMiddleware, handleUpload };
