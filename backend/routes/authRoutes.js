const { registerUser, loginUser, getUsers } = require('../controllers/authController');
const { protect, admin } = require('../middleware/auth');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/', protect, admin, getUsers);

module.exports = router;
