import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const API_URL = "http://localhost:8000/generate";
const CART_API_URL = "http://localhost:8000/cart";
const PRODUCT_API_URL = "http://localhost:8000/products";

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
            const response = await axios.get(`${CART_API_URL}/${user_id}`);
            if (response.data && response.data.items) {
                const count = response.data.items.reduce((sum, item) => sum + item.quantity, 0);
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
            const response = await axios.get(`${PRODUCT_API_URL}/search?name=${encodeURIComponent(productName)}`);
            if (response.data && response.data.length > 0) {
                return response.data[0];
            }
            throw new Error("Không tìm thấy sản phẩm!");
        } catch (error) {
            throw new Error(`Lỗi khi tìm kiếm sản phẩm: ${error.message}`);
        }
    };

    const addToCart = async (productInfo) => {
        try {
            console.log("Starting addToCart with productInfo:", productInfo); // Debug log

            // Get or generate user_id
            let user_id = localStorage.getItem("user_id");
            if (!user_id) {
                // Generate a random user ID if not logged in (for demo purposes)
                user_id = 'guest_' + Math.random().toString(36).substring(2, 15);
                localStorage.setItem("user_id", user_id);
            }
            console.log("Using user_id:", user_id); // Debug log

            // Get product details from the search endpoint
            let product;
            try {
                console.log("Searching for product:", productInfo.name); // Debug log
                const searchResponse = await axios.get(`${PRODUCT_API_URL}/search?name=${encodeURIComponent(productInfo.name)}`);
                console.log("Search response:", searchResponse.data); // Debug log
                
                if (searchResponse.data && searchResponse.data.length > 0) {
                    product = searchResponse.data[0];
                    console.log("Found product:", product); // Debug log
                } else {
                    throw new Error("Không tìm thấy sản phẩm!");
                }
            } catch (error) {
                console.error("Error searching for product:", error); // Debug log
                throw new Error(`Không tìm thấy sản phẩm "${productInfo.name}" trong hệ thống.`);
            }

            // Check cart existence first
            try {
                console.log("Checking cart existence for user:", user_id); // Debug log
                await axios.get(`${CART_API_URL}/${user_id}`);
            } catch (error) {
                if (error.response?.status === 404) {
                    console.log("Cart not found, creating new cart"); // Debug log
                    // Create a new cart if it doesn't exist
                    await axios.post(CART_API_URL, {
                        user_id,
                        items: []
                    });
                }
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
            console.log("Adding cart item:", cartItem); // Debug log

            const response = await axios.post(CART_API_URL, {
                user_id,
                items: [cartItem]
            });
            console.log("Cart API response:", response.data); // Debug log

            // Update cart count
            fetchCartCount(user_id);

            return {
                success: true,
                message: `Đã thêm ${productInfo.quantity} sản phẩm "${product.name}" vào giỏ hàng của bạn!`,
                product: product
            };
        } catch (error) {
            console.error("Error in addToCart:", error); // Debug log
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
        console.log("Raw response:", response); // Debug log

        // Look for code blocks with JSON content
        const codeBlockRegex = /```(?:json)?\s*(\{[\s\S]*?\})\s*```/;
        const jsonMatch = response.match(codeBlockRegex);
        
        if (jsonMatch && jsonMatch[1]) {
            try {
                const jsonData = JSON.parse(jsonMatch[1]);
                console.log("Extracted JSON from code block:", jsonData); // Debug log
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
                console.log("Extracted raw JSON:", jsonData); // Debug log
                return jsonData;
            } catch (e) {
                console.error("Failed to parse raw JSON", e);
            }
        }

        // Try to find JSON in the entire response
        try {
            const jsonData = JSON.parse(response);
            console.log("Parsed entire response as JSON:", jsonData); // Debug log
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
            const response = await fetch(API_URL, {
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
        <div style={{ maxWidth: '800px', margin: '20px auto', padding: '20px' }}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <h1 style={{ color: '#2c3e50', fontSize: '2em', marginBottom: '10px' }}>🤖 Chat với Generative AI</h1>
                <p style={{ color: '#7f8c8d', fontSize: '1.1em' }}>
                    Gửi câu hỏi đến server để nhận phản hồi từ AI.
                </p>
                {cartCount > 0 && (
                    <div style={{ 
                        backgroundColor: '#e8f5e9', 
                        padding: '10px', 
                        borderRadius: '8px',
                        marginTop: '10px',
                        display: 'inline-block'
                    }}>
                        Giỏ hàng của bạn có {cartCount} sản phẩm
                    </div>
                )}
            </div>

            <div style={{
                height: '500px',
                overflowY: 'auto',
                padding: '20px',
                border: '1px solid #e0e0e0',
                borderRadius: '12px',
                marginBottom: '20px',
                backgroundColor: 'white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
                {chatHistory.length === 0 && (
                    <div style={{
                        textAlign: 'center',
                        color: '#95a5a6',
                        marginTop: '200px',
                        fontSize: '1.2em'
                    }}>
                        Chào mừng bạn đến với trợ lý mua sắm AI! Bạn có thể hỏi về sản phẩm hoặc đặt hàng.<br/>
                        Thử nhập: "Tôi muốn mua iPhone 14 Pro Max"
                    </div>
                )}
                
                {chatHistory.map((msg, index) => (
                    <div
                        key={index}
                        style={{
                            margin: '10px 0',
                            padding: '15px',
                            borderRadius: '12px',
                            maxWidth: '80%',
                            backgroundColor: msg.role === 'user' ? '#007bff' : '#f8f9fa',
                            color: msg.role === 'user' ? 'white' : '#2c3e50',
                            marginLeft: msg.role === 'user' ? 'auto' : '0',
                            marginRight: msg.role === 'user' ? '0' : 'auto',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                            fontSize: '1.1em',
                            lineHeight: '1.5',
                            wordWrap: 'break-word'
                        }}
                    >
                        {renderMessage(msg.content)}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
                <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Nhập câu hỏi của bạn..."
                    disabled={isLoading}
                    style={{
                        flex: 1,
                        padding: '12px 20px',
                        border: '2px solid #e0e0e0',
                        borderRadius: '8px',
                        fontSize: '1.1em',
                        transition: 'border-color 0.3s ease',
                        outline: 'none',
                        backgroundColor: isLoading ? '#f5f5f5' : 'white'
                    }}
                />
                <button
                    onClick={handleUserInput}
                    disabled={isLoading || !userInput.trim()}
                    style={{
                        padding: '12px 24px',
                        backgroundColor: isLoading || !userInput.trim() ? '#b3b3b3' : '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: isLoading || !userInput.trim() ? 'not-allowed' : 'pointer',
                        fontSize: '1.1em',
                        fontWeight: 'bold',
                        transition: 'background-color 0.3s ease',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minWidth: '100px'
                    }}
                >
                    {isLoading ? (
                        <span className="loading-dots">Đang gửi...</span>
                    ) : (
                        'Gửi'
                    )}
                </button>
            </div>
        </div>
    );
};

export default GeminiChatbot;