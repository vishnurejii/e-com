const express = require('express');
const router = express.Router();
const { 
    addOrderItems, 
    getMyOrders, 
    getOrders, 
    getSellerOrders,
    updateOrderToDelivered, 
    getOrderById, 
    updateOrderStatus,
    updateOrderItemStatus,
    cancelOrder
} = require('../controllers/orderController');
const { protect, admin, seller } = require('../middleware/auth');

router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders);
router.get('/seller', protect, seller, getSellerOrders);
router.route('/myorders').get(protect, getMyOrders);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/status').put(protect, admin, updateOrderStatus);
router.put('/item-status', protect, seller, updateOrderItemStatus);
router.route('/:id/cancel').put(protect, protect, cancelOrder);
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);

module.exports = router;
