const express = require('express');
const fs = require('fs');
const path = require('path');
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

// Route to stream a video
app.get('/stream/:videoId', (req, res) => {
  const videoId = req.params.videoId;
  const videoPath = path.join(__dirname, 'uploads', videoId);
  const stat = fs.statSync(videoPath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunksize = end - start + 1;
    const file = fs.createReadStream(videoPath, { start, end });
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    };
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    };
    res.writeHead(200, head);
    fs.createReadStream(videoPath).pipe(res);
  }
});

// Route to download a video
app.get('/download/:videoId', (req, res) => {
  const videoId = req.params.videoId;
  const videoPath = path.join(__dirname, 'uploads', videoId);
  res.download(videoPath);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
