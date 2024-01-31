const express = require("express");
const path = require("path");
const { handleUpload, multerMiddleware } = require("./file-upload");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
app.post("/extract", multerMiddleware, handleUpload);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
