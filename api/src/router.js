const { Router } = require('express');
const router = Router();
const Multer = require('multer');
const path = require('path');
const imageProcessor = require('./imageProcessor');

const photoPath = path.resolve(__dirname, '../../client/photo-viewer.html');

const filename = (req, file, callback) => {
    callback(null, file.originalname);
}

const fileFilter = (req, file, callback) => {
    if (file.mimetype !== 'image/png') {
        req.fileValidationError = 'Wrong file type';
        callback(null, false, new Error('Wrong file type'));
    } else {
        callback(null, true);
    }
}

const storage = Multer.diskStorage({
    destination: 'api/uploads/',
    filename: filename
})

const upload = Multer({
    fileFilter: fileFilter,
    storage: storage
});


router.post('/upload', upload.single('photo'), async (req, res) => {
    if (req.fileValidationError) {
        return res.status(400).json({
            error: req.fileValidationError
        });
    }
    try {
        await imageProcessor(req.file.filename);
    } catch (error) {
        throw error;
    }
    return res.status(201).json({
        success: true
    })
})

router.get('/photo-viewer', (req, res) => {
    res.sendFile(photoPath);
})

module.exports = router;