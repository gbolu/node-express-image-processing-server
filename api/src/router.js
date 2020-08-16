const { Router } = require('express');
const Multer = require('multer');

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

const router = Router();

router.post('/upload', upload.single('photo'), (req, res) => {
    if(req.fileValidationError)
    {
        return res.status(400).json({
            error: req.fileValidationError
        });
    }
    return res.status(201).json({
        success: true
    })
})

module.exports = router;