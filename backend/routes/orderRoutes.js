const express = require('express');
const router = express.Router();
const { 
    addOrderItems, 
    getMyOrders, 
    getOrders, 
    updateOrderToDelivered, 
    getOrderById, 
    updateOrderStatus,
    cancelOrder
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/auth');

router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders);
router.route('/myorders').get(protect, getMyOrders);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/status').put(protect, admin, updateOrderStatus);
router.route('/:id/cancel').put(protect, protect, cancelOrder);
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);

module.exports = router;
