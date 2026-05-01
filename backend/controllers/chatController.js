const Product = require('../models/Product');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// @desc    Process chat message with Gemini Streaming
// @route   POST /api/chat
// @access  Public
const processChatMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const apiKey = process.env.GEMINI_API_KEY;
        
        if (!apiKey || apiKey === 'your_gemini_api_key_here') {
            return res.status(500).json({ message: "Gemini API Key is not configured." });
        }

        // Fetch products to provide context
        const products = await Product.find({ is_available: true }).limit(20);
        const productContext = products.map(p => 
            `- ${p.product_name}: $${p.price} (${p.category}). Description: ${p.description}`
        ).join('\n');

        const prompt = `
            You are a helpful and friendly customer service assistant for NewKart, an e-commerce store.
            
            Here are some of our available products:
            ${productContext}
            
            Customer question: "${message}"
            
            Instructions:
            1. Be concise but helpful.
            2. If the customer asks about products, refer to the list above.
            3. Stay in character as the NewKart assistant.
            4. Return only the response text.
        `;

        const genAI = new GoogleGenerativeAI(apiKey);
        let model = genAI.getGenerativeModel({ model: "gemini-flash-latest" }, { apiVersion: "v1beta" });
        
        let result;
        try {
            result = await model.generateContentStream(prompt);
        } catch (error) {
            console.warn('Flash overloaded or failed, trying Pro fallback...');
            model = genAI.getGenerativeModel({ model: "gemini-pro-latest" }, { apiVersion: "v1beta" });
            result = await model.generateContentStream(prompt);
        }
        
        // Set up streaming response
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.setHeader('Transfer-Encoding', 'chunked');

        for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            res.write(chunkText);
        }

        res.end();
    } catch (error) {
        console.error('DETAILED CHAT ERROR:', {
            message: error.message,
            stack: error.stack,
            apiKeyExists: !!process.env.GEMINI_API_KEY
        });
        
        if (!res.headersSent) {
            res.status(500).json({ 
                message: "Chat assistance error", 
                details: error.message 
            });
        } else {
            res.end();
        }
    }
};

module.exports = { processChatMessage };
