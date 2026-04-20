const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUsers, updateUserProfile, deleteUser } = require('../controllers/authController');
const { protect, admin } = require('../middleware/auth');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/', protect, admin, getUsers);
router.delete('/:id', protect, admin, deleteUser);
router.put('/profile', protect, updateUserProfile);

module.exports = router;
