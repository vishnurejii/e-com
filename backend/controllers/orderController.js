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
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
};

const getOrders = async (req, res) => {
    const orders = await Order.find({}).populate('user', 'id first_name last_name email').sort({ createdAt: -1 });
    res.json(orders);
};

const getOrderById = async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'first_name last_name email');
    if (order) {
        res.json(order);
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
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

const updateOrderStatus = async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
        order.status = req.body.status || order.status;
        if (order.status === 'Delivered') {
            order.isDelivered = true;
            order.deliveredAt = Date.now();
        }
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
};

const cancelOrder = async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
        if (order.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        if (order.status === 'Ordered' || order.status === 'Processing') {
            order.status = 'Cancelled';
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(400).json({ message: 'Order cannot be cancelled after shipping' });
        }
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
};

module.exports = { addOrderItems, getMyOrders, getOrders, updateOrderToDelivered, getOrderById, updateOrderStatus, cancelOrder };
