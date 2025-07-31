const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const recipeController = require('../controllers/recipeController');
const authMiddleware = require('../middleware/authMiddleware');

const storage = multer.diskStorage({
    destination(req, file, cb) {
        const uploadDir = 'uploads/';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename(req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

function checkFileType(file, cb) {
    const filetypes = /jpg|jpeg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

const upload = multer({ storage, fileFilter: (req, file, cb) => checkFileType(file, cb) });

router.get('/my', authMiddleware, recipeController.getUserRecipes);

// Public routes
router.get('/', recipeController.getAllRecipes);
router.get('/:id', recipeController.getRecipeById);

// Private routes
router.post('/', authMiddleware, upload.single('image'), recipeController.createRecipe);
router.put('/:id', authMiddleware, upload.single('image'), recipeController.updateRecipe);
router.delete('/:id', authMiddleware, recipeController.deleteRecipe);

module.exports = router;