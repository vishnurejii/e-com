const Product = require('../models/Product');

// @desc    Process chat message
// @route   POST /api/chat
// @access  Public
const processChatMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const lowerMessage = message.toLowerCase();

        let response = "";

        // Greeting detection
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
            response = "Hello! I'm your NewKart assistant. How can I help you today?";
        } 
        // Product list query
        else if (lowerMessage.includes('products') || lowerMessage.includes('show me') || lowerMessage.includes('what do you have')) {
            const products = await Product.find({ is_available: true }).limit(5);
            const productNames = products.map(p => p.product_name).join(', ');
            response = `We have some amazing products including: ${productNames}. You can check our store for the full collection!`;
        }
        // Specific product query
        else if (lowerMessage.includes('price') || lowerMessage.includes('how much') || lowerMessage.includes('cost')) {
            const products = await Product.find({ is_available: true });
            const foundProduct = products.find(p => lowerMessage.includes(p.product_name.toLowerCase()));

            if (foundProduct) {
                response = `The ${foundProduct.product_name} is priced at $${foundProduct.price}. We currently have ${foundProduct.stock} in stock.`;
            } else {
                response = "I couldn't find the specific product you're asking about. Could you please specify the name?";
            }
        }
        // Search query
        else if (lowerMessage.length > 3) {
            const query = {
                is_available: true,
                $or: [
                    { product_name: { $regex: lowerMessage, $options: 'i' } },
                    { description: { $regex: lowerMessage, $options: 'i' } }
                ]
            };
            const products = await Product.find(query).limit(3);
            
            if (products.length > 0) {
                const results = products.map(p => `${p.product_name} ($${p.price})`).join(', ');
                response = `I found these matching products: ${results}. and many more!`;
            } else {
                response = "I'm not sure about that. Try asking about our products, prices, or store hours!";
            }
        }
        // Fallback
        else {
            response = "I'm here to help! try asking about our 'products', 'prices', or help with your order.";
        }

        res.json({ response });
    } catch (error) {
        res.status(500).json({ message: "Chat assistance is temporarily unavailable." });
    }
};

module.exports = { processChatMessage };
