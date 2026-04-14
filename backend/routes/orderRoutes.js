const { addOrderItems, getMyOrders, getOrders, updateOrderToDelivered } = require('../controllers/orderController');
const { protect, admin } = require('../middleware/auth');

router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders);
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);

module.exports = router;
