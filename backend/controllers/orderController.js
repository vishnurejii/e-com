const Order = require('../models/Order');
const Product = require('../models/Product');

const addOrderItems = async (req, res) => {
    const { orderItems, shippingAddress, paymentMethod, totalPrice } = req.body;
    if (orderItems && orderItems.length === 0) {
        return res.status(400).json({ message: 'No order items' });
    }

    try {
        // Enforce seller ID on each order item by fetching it from the DB
        const itemsWithSeller = await Promise.all(orderItems.map(async (item) => {
            const product = await Product.findById(item.product);
            if (!product) {
                throw new Error(`Product not found: ${item.product}`);
            }
            return {
                ...item,
                seller: product.seller
            };
        }));

        const order = new Order({
            user: req.user._id,
            orderItems: itemsWithSeller,
            shippingAddress,
            paymentMethod,
            totalPrice,
            isPaid: true,
            paidAt: Date.now()
        });
        const createdOrder = await order.save();
        res.status(201).json(createdOrder);
    } catch (error) {
        res.status(500).json({ message: 'Order creation failed' });
    }
};

const getMyOrders = async (req, res) => {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
};

// For Main Admin: See all orders
const getOrders = async (req, res) => {
    const orders = await Order.find({}).populate('user', 'id first_name last_name email').sort({ createdAt: -1 });
    res.json(orders);
};

// For Sellers: See orders that contain their products
const getSellerOrders = async (req, res) => {
    try {
        const orders = await Order.find({ 'orderItems.seller': req.user._id })
            .populate('user', 'first_name last_name email')
            .sort({ createdAt: -1 });
        
        // Return filtered items for each order or the full order?
        // User said: "seller can see payment details tracking of each product"
        // We'll return the orders, and the frontend will filter orderItems.
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
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
        // Also update all item statuses to Delivered for convenience
        order.orderItems.forEach(item => {
            item.itemStatus = 'Delivered';
        });
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
            order.orderItems.forEach(item => {
                item.itemStatus = 'Delivered';
            });
        }
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
};

// Update status of a specific item (for Sellers)
const updateOrderItemStatus = async (req, res) => {
    const { orderId, productId, status } = req.body;
    try {
        const order = await Order.findById(orderId);
        if (order) {
            const item = order.orderItems.find(i => i.product.toString() === productId);
            if (!item) return res.status(404).json({ message: 'Item not found in order' });

            // Ensure the seller owns this item
            if (item.seller.toString() !== req.user._id.toString() && !req.user.is_staff && !req.user.is_superadmin && req.user.first_name !== 'Admin') {
                return res.status(401).json({ message: 'Not authorized for this item' });
            }

            item.itemStatus = status;
            
            // If all items are delivered, set order status to delivered
            const allDelivered = order.orderItems.every(i => i.itemStatus === 'Delivered');
            if (allDelivered) {
                order.status = 'Delivered';
                order.isDelivered = true;
                order.deliveredAt = Date.now();
            } else if (status === 'Shipped' && order.status === 'Processing') {
                order.status = 'Shipped';
            }

            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
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
            order.orderItems.forEach(i => i.itemStatus = 'Cancelled');
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(400).json({ message: 'Order cannot be cancelled after shipping' });
        }
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
};

module.exports = { 
    addOrderItems, 
    getMyOrders, 
    getOrders, 
    getSellerOrders,
    updateOrderToDelivered, 
    getOrderById, 
    updateOrderStatus, 
    updateOrderItemStatus,
    cancelOrder 
};
