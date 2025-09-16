const express = require('express');
const router = express.Router();
const File = require('../Models/file');
const upload = require('../MiddleWare/multerConfig');

const fileList = [];

router.post('/upload', (req, res) => {
  console.log('[📥] Incoming POST /upload request');

  upload.single('pdfFile')(req, res, async function (err) {
    console.log('[🔄] Inside multer middleware callback');

    if (err) {
      console.log('[❌] Multer error:', err.message);
      return res.status(400).json({ error: err.message });
    }

    if (!req.file) {
      console.log('[⚠️] No file uploaded');
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log('[✅] File received:', {
      originalName: req.file.originalname,
      storedName: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype
    });

    try {
      const fileDoc = new File({
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size
      });

      console.log('[💾] Saving file to database...');
      await fileDoc.save();
      console.log('[✅] File saved to database:', fileDoc._id);

      fileList.push({
        id: fileDoc._id,
        filename: fileDoc.filename,
        size: fileDoc.size,
        uploadDate: fileDoc.uploadDate
      });

      console.log('[📤] Sending response to client...');
      res.json({ message: 'File uploaded successfully', file: fileDoc });
    } catch (err) {
      console.log('[❌] Error saving to DB:', err);
      res.status(500).json({ error: 'Database error' });
    }
  });
});

router.get('/files', async (req, res) => {
  console.log('[📥] Incoming GET /files request');
  try {
    const dbFiles = await File.find().sort({ uploadDate: -1 });
    console.log('[✅] Retrieved files from database:', dbFiles.length);

    res.json({
      memoryList: fileList,
      dbList: dbFiles
    });
  } catch (err) {
    console.log('[❌] Error fetching files:', err);
    res.status(500).json({ error: 'Failed to fetch files' });
  }
});

module.exports = router;
