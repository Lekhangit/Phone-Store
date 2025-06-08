# from fastapi.middleware.cors import CORSMiddleware
# import google.generativeai as genai
# from fastapi import APIRouter, HTTPException
# from starlette.responses import StreamingResponse
# from models.prompt import PromptRequest
# from models.cart import CartCreate, CartItem
# from crud import product as product_crud
# from crud import cart as cart_crud
# import json
# import re

# # Configure the API key
# genai.configure(api_key="AIzaSyDsKPeiLrlQt9EQcWL90WEFRTXMegUpgVc")

# router = APIRouter()

# @router.post("/generate")
# async def generate_response(request: PromptRequest):
#     """
#     Endpoint to generate a response based on the given prompt, streamed back to the client.
#     """
#     # Get all available products to create a more comprehensive product list
#     available_products = product_crud.get_products(limit=20)
    
#     # Format product list for inclusion in the prompt
#     product_list = ""
#     for idx, product in enumerate(available_products, 1):
#         product_list += f"{idx}. {product['name']}\n"
#         product_list += f"   - ID: {product['id']}\n"
#         product_list += f"   - Thương hiệu: {product['brand']}\n"
#         product_list += f"   - Giá gốc: {format_price(product['price'])}đ\n"
        
#         if 'sale_price' in product and product['sale_price']:
#             product_list += f"   - Giá khuyến mãi: {format_price(product['sale_price'])}đ\n"
        
#         if 'rating' in product and product['rating']:
#             product_list += f"   - Đánh giá: {product['rating']}/5\n"
            
#         if 'stock' in product and product['stock'] is not None:
#             product_list += f"   - Tồn kho: {product['stock']} sản phẩm\n"
            
#         if 'description' in product and product['description']:
#             product_list += f"   - Mô tả: {product['description']}\n"
        
#         product_list += "\n"

#     # Create context with product info
#     context = f"""Bạn là một trợ lý mua sắm thông minh. Khi người dùng muốn đặt hàng, hãy phân tích yêu cầu và trả về thông tin sản phẩm theo định dạng JSON sau:

# {{
#     "name": "Tên sản phẩm",  // Tên chính xác của sản phẩm để tìm kiếm
#     "quantity": 1  // Số lượng
# }}

# Danh sách sản phẩm hiện có:
# {product_list}

# Ví dụ khi người dùng nói:
# - "Tôi muốn đặt 2 cái iPhone 14 Pro Max"
# - "Mua cho tôi 1 cái điện thoại Apple"
# - "Đặt 3 cái iPhone"

# Hãy trả về JSON tương ứng với tên sản phẩm và số lượng. Tên sản phẩm phải chính xác như trong danh sách trên.

# Nếu không phải yêu cầu đặt hàng, hãy trả lời bình thường như một trợ lý mua sắm thân thiện.

# Lưu ý: 
# 1. Khi là yêu cầu đặt hàng, BẮT BUỘC phải trả về JSON, không được trả về text thông thường.
# 2. Tên sản phẩm phải chính xác như trong danh sách trên.
# 3. Nếu người dùng đề cập đến sản phẩm không có trong danh sách, hãy trả lời thông thường và thông báo sản phẩm không tồn tại.
# 4. Đặt JSON response vào trong khối code để phía client dễ parse.
# """
    
#     model = genai.GenerativeModel('gemini-2.0-flash')
    
#     prompt = f"{context}\n\nUser: {request.prompt}"
    
#     response_stream = model.generate_content(prompt, stream=True)

#     # Generator to yield chunks of the response
#     async def stream_chunks():
#         full_response = ""
#         for chunk in response_stream:
#             text = chunk.text
#             full_response += text
#             yield text.replace('\n', '<br>')

#         # Check if response contains a JSON order request
#         try:
#             # Look for code blocks with JSON content
#             code_block_regex = r"```(?:json)?\s*(\{[\s\S]*?\})\s*```"
#             json_match = re.search(code_block_regex, full_response)
            
#             if json_match:
#                 order_info = json.loads(json_match.group(1))
#                 if order_info.get('name') and order_info.get('quantity'):
#                     # Get product details
#                     product = product_crud.get_product_by_name(order_info['name'])
#                     if product:
#                         # Create cart item
#                         cart_item = CartItem(
#                             product_id=product['id'],
#                             quantity=order_info['quantity'],
#                             name=product['name'],
#                             brand=product['brand'],
#                             price=product['price'],
#                             sale_price=product.get('sale_price'),
#                             image=product.get('image'),
#                             rating=product.get('rating'),
#                             stock=product.get('stock'),
#                             description=product.get('description')
#                         )

#                         # Create cart
#                         cart = CartCreate(
#                             user_id='guest',
#                             items=[cart_item]
#                         )

#                         cart_crud.add_to_cart(cart)
#         except Exception as e:
#             print(f"Error processing order: {str(e)}")

#     return StreamingResponse(stream_chunks(), media_type="text/event-stream")

# def format_price(price):
#     """Format price with thousands separator"""
#     return f"{price:,.0f}".replace(",", ".")                       # Add to cart
 