const express = require('express');
const multer = require('multer');
const PORT = process.env.PORT || 4000;
const cors = require('cors')

const app = express();
app.use(cors())
const upload = multer({ dest: 'uploads/' });

// Route to upload a video
app.post('/upload', upload.single('video'), (req, res) => {
  const { originalname, size } = req.file;
  const filePath = req.file.path;
  res.send(`Video ${originalname} uploaded successfully! Size: ${size} bytes`);
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
