const Order = require('../models/Order');

const addOrderItems = async (req, res) => {
    const { orderItems, shippingAddress, paymentMethod, totalPrice } = req.body;
    if (orderItems && orderItems.length === 0) {
        return res.status(400).json({ message: 'No order items' });
    }
    const order = new Order({
        user: req.user._id,
        orderItems,
        shippingAddress,
        paymentMethod,
        totalPrice,
        isPaid: true,
        paidAt: Date.now()
    });
    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
};

const getMyOrders = async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
};

const getOrders = async (req, res) => {
    const orders = await Order.find({}).populate('user', 'id first_name last_name email');
    res.json(orders);
};

const updateOrderToDelivered = async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
        order.status = 'Delivered';
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
};

module.exports = { addOrderItems, getMyOrders, getOrders, updateOrderToDelivered };
