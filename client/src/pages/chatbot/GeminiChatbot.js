import React, { useState, useRef, useEffect } from 'react';
import { API_ENDPOINTS } from '../../utils/constants';
import { getCart } from '../../services/cartService';
import { searchProducts } from '../../services/productService';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const GeminiChatbot = () => {
    const [chatHistory, setChatHistory] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatHistory]);

    // Load cart count on component mount
    useEffect(() => {
        const user_id = localStorage.getItem("user_id");
        if (user_id) {
            fetchCartCount(user_id);
        }
    }, []);

    const fetchCartCount = async (user_id) => {
        try {
            const response = await getCart(user_id);
            if (response && response.items) {
                const count = response.items.reduce((sum, item) => sum + item.quantity, 0);
                setCartCount(count);
            }
        } catch (error) {
            // If cart doesn't exist yet, that's fine
            if (error.response?.status !== 404) {
                console.error("Error fetching cart:", error);
            }
        }
    };

    const getProductInfo = async (productName) => {
        try {
            const products = await searchProducts(productName);
            if (products && products.length > 0) {
                return products[0];
            }
            throw new Error("Không tìm thấy sản phẩm!");
        } catch (error) {
            throw new Error(`Lỗi khi tìm kiếm sản phẩm: ${error.message}`);
        }
    };

    const addToCart = async (productInfo) => {
        try {
            console.log("Starting addToCart with productInfo:", productInfo);

            // Get or generate user_id
            let user_id = localStorage.getItem("user_id");
            if (!user_id) {
                user_id = 'guest_' + Math.random().toString(36).substring(2, 15);
                localStorage.setItem("user_id", user_id);
            }
            console.log("Using user_id:", user_id);

            // Get product details
            let product;
            try {
                console.log("Searching for product:", productInfo.name);
                const products = await searchProducts(productInfo.name);
                console.log("Search response:", products);
                
                if (products && products.length > 0) {
                    product = products[0];
                    console.log("Found product:", product);
                } else {
                    throw new Error("Không tìm thấy sản phẩm!");
                }
            } catch (error) {
                console.error("Error searching for product:", error);
                throw new Error(`Không tìm thấy sản phẩm "${productInfo.name}" trong hệ thống.`);
            }

            // Add item to cart
            const cartItem = {
                product_id: product.id,
                quantity: productInfo.quantity || 1,
                name: product.name,
                brand: product.brand,
                price: product.price,
                sale_price: product.sale_price,
                image: product.image,
                rating: product.rating,
                stock: product.stock,
                description: product.description
            };
            console.log("Adding cart item:", cartItem);

            const response = await fetch(API_ENDPOINTS.CART.BASE, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id,
                    items: [cartItem]
                })
            });

            if (!response.ok) {
                throw new Error('Failed to add to cart');
            }

            const data = await response.json();
            console.log("Cart API response:", data);

            // Update cart count
            fetchCartCount(user_id);

            return {
                success: true,
                message: `Đã thêm ${productInfo.quantity} sản phẩm "${product.name}" vào giỏ hàng của bạn!`,
                product: product
            };
        } catch (error) {
            console.error("Error in addToCart:", error);
            if (error.response?.status === 404) {
                return {
                    success: false,
                    message: `Không tìm thấy sản phẩm "${productInfo.name}" trong hệ thống.`
                };
            } else if (error.response?.status === 401) {
                return {
                    success: false,
                    message: "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!"
                };
            } else {
                return {
                    success: false,
                    message: `Lỗi khi thêm vào giỏ hàng: ${error.message}`
                };
            }
        }
    };

    const extractJsonFromResponse = (response) => {
        console.log("Raw response:", response);

        // Look for code blocks with JSON content
        const codeBlockRegex = /```(?:json)?\s*(\{[\s\S]*?\})\s*```/;
        const jsonMatch = response.match(codeBlockRegex);
        
        if (jsonMatch && jsonMatch[1]) {
            try {
                const jsonData = JSON.parse(jsonMatch[1]);
                console.log("Extracted JSON from code block:", jsonData);
                return jsonData;
            } catch (e) {
                console.error("Failed to parse JSON from code block", e);
            }
        }
        
        // Try to find any JSON object in the response as fallback
        const jsonObjectRegex = /(\{[\s\S]*?\})/;
        const rawMatch = response.match(jsonObjectRegex);
        
        if (rawMatch && rawMatch[1]) {
            try {
                const jsonData = JSON.parse(rawMatch[1]);
                console.log("Extracted raw JSON:", jsonData);
                return jsonData;
            } catch (e) {
                console.error("Failed to parse raw JSON", e);
            }
        }

        // Try to find JSON in the entire response
        try {
            const jsonData = JSON.parse(response);
            console.log("Parsed entire response as JSON:", jsonData);
            return jsonData;
        } catch (e) {
            console.error("Failed to parse entire response as JSON", e);
        }
        
        return null;
    };

    const handleUserInput = async () => {
        if (!userInput.trim()) return;

        const userMessage = { role: 'user', content: userInput };
        setChatHistory(prev => [...prev, userMessage]);
        setUserInput('');
        setIsLoading(true);

        const assistantMessageId = Date.now();
        setChatHistory(prev => [...prev, { role: 'assistant', content: '▌', id: assistantMessageId }]);

        try {
            const response = await fetch(API_ENDPOINTS.CHATBOT.GENERATE, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    prompt: userInput
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let fullResponse = '';

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                fullResponse += chunk;
                
                setChatHistory(prev => 
                    prev.map(msg => 
                        msg.id === assistantMessageId 
                            ? { ...msg, content: fullResponse + '▌' }
                            : msg
                    )
                );
            }

            // Update cart count after response
            const user_id = localStorage.getItem("user_id");
            if (user_id) {
                fetchCartCount(user_id);
            }

            setChatHistory(prev => 
                prev.map(msg => 
                    msg.id === assistantMessageId 
                        ? { ...msg, content: fullResponse }
                        : msg
                )
            );

        } catch (error) {
            console.error("Error in handleUserInput:", error);
            setChatHistory(prev => 
                prev.map(msg => 
                    msg.id === assistantMessageId 
                        ? { ...msg, content: `❌ Lỗi: ${error.message}` }
                        : msg
                )
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !isLoading) {
            handleUserInput();
        }
    };

    const renderMessage = (content) => {
        return content.split('<br>').map((line, i) => (
            <React.Fragment key={i}>
                {line}
                {i < content.split('<br>').length - 1 && <br />}
            </React.Fragment>
        ));
    };

    return (
        <div style={{ 
            maxWidth: '1000px', 
            margin: '40px auto', 
            padding: '20px',
            backgroundColor: '#f8f9fa',
            borderRadius: '20px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
            <div style={{ 
                textAlign: 'center', 
                marginBottom: '30px',
                padding: '20px',
                background: 'linear-gradient(135deg, #6B73FF 0%, #000DFF 100%)',
                borderRadius: '15px',
                color: 'white'
            }}>
                <h1 style={{ 
                    fontSize: '2.5em', 
                    marginBottom: '15px',
                    fontWeight: 'bold',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
                }}>
                    🤖 AI Shopping Assistant
                </h1>
                <p style={{ 
                    fontSize: '1.2em',
                    opacity: 0.9,
                    maxWidth: '600px',
                    margin: '0 auto'
                }}>
                    Tôi là trợ lý mua sắm thông minh. Hãy cho tôi biết bạn cần tìm gì?
                </p>
                {cartCount > 0 && (
                    <div style={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.2)', 
                        padding: '12px 24px', 
                        borderRadius: '30px',
                        marginTop: '15px',
                        display: 'inline-block',
                        backdropFilter: 'blur(5px)',
                        border: '1px solid rgba(255, 255, 255, 0.3)'
                    }}>
                        🛒 Giỏ hàng của bạn có {cartCount} sản phẩm
                    </div>
                )}
            </div>

            <div style={{
                height: '600px',
                overflowY: 'auto',
                padding: '30px',
                border: '1px solid #e0e0e0',
                borderRadius: '15px',
                marginBottom: '30px',
                backgroundColor: 'white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                scrollbarWidth: 'thin',
                scrollbarColor: '#888 #f1f1f1'
            }}>
                {chatHistory.length === 0 && (
                    <div style={{
                        textAlign: 'center',
                        color: '#95a5a6',
                        marginTop: '200px',
                        fontSize: '1.2em',
                        padding: '20px',
                        backgroundColor: '#f8f9fa',
                        borderRadius: '12px',
                        maxWidth: '600px',
                        margin: '200px auto 0',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                    }}>
                        <div style={{ fontSize: '3em', marginBottom: '20px' }}>👋</div>
                        <h3 style={{ color: '#2c3e50', marginBottom: '15px' }}>Chào mừng đến với AI Shopping Assistant!</h3>
                        <p style={{ color: '#7f8c8d', marginBottom: '20px' }}>
                            Tôi có thể giúp bạn tìm kiếm sản phẩm, so sánh giá cả, và đặt hàng.
                        </p>
                        <div style={{ 
                            backgroundColor: '#e8f5e9', 
                            padding: '15px', 
                            borderRadius: '8px',
                            marginTop: '20px',
                            border: '1px solid #c8e6c9'
                        }}>
                            <p style={{ margin: '0', color: '#2e7d32' }}>
                                Thử hỏi: "Tôi muốn mua iPhone 14 Pro Max"
                            </p>
                        </div>
                    </div>
                )}
                
                {chatHistory.map((msg, index) => (
                    <div
                        key={index}
                        style={{
                            margin: '15px 0',
                            padding: '20px',
                            borderRadius: '15px',
                            maxWidth: '80%',
                            backgroundColor: msg.role === 'user' 
                                ? 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)'
                                : '#f8f9fa',
                            color: msg.role === 'user' ? 'white' : '#2c3e50',
                            marginLeft: msg.role === 'user' ? 'auto' : '0',
                            marginRight: msg.role === 'user' ? '0' : 'auto',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            fontSize: '1.1em',
                            lineHeight: '1.6',
                            wordWrap: 'break-word',
                            position: 'relative',
                            border: msg.role === 'user' ? 'none' : '1px solid #e0e0e0'
                        }}
                    >
                        {msg.role === 'assistant' && (
                            <div style={{
                                position: 'absolute',
                                top: '-10px',
                                left: '20px',
                                backgroundColor: '#6B73FF',
                                color: 'white',
                                padding: '4px 12px',
                                borderRadius: '12px',
                                fontSize: '0.8em',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                            }}>
                                AI Assistant
                            </div>
                        )}
                        {renderMessage(msg.content)}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <div style={{ 
                display: 'flex', 
                gap: '15px',
                padding: '20px',
                backgroundColor: 'white',
                borderRadius: '15px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}>
                <Input
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Nhập câu hỏi của bạn..."
                    disabled={isLoading}
                    style={{
                        flex: 1,
                        padding: '15px 20px',
                        fontSize: '1.1em',
                        borderRadius: '12px',
                        border: '2px solid #e0e0e0',
                        transition: 'all 0.3s ease'
                    }}
                />
                <Button
                    onClick={handleUserInput}
                    disabled={isLoading || !userInput.trim()}
                    style={{
                        padding: '15px 30px',
                        fontSize: '1.1em',
                        borderRadius: '12px',
                        background: isLoading 
                            ? 'linear-gradient(135deg, #cccccc 0%, #999999 100%)'
                            : 'linear-gradient(135deg, #6B73FF 0%, #000DFF 100%)',
                        border: 'none',
                        color: 'white',
                        cursor: isLoading ? 'not-allowed' : 'pointer',
                        transition: 'all 0.3s ease'
                    }}
                >
                    {isLoading ? 'Đang gửi...' : 'Gửi'}
                </Button>
            </div>
        </div>
    );
};

export default GeminiChatbot; 