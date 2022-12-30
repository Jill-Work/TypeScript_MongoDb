 export default class Permission {

     permission:any = {
        "user_sign_up":"/api/users/signUp",
        "user_log_in":"/api/users/login",
        "user_details":"/api/users/user/:id",
        "user_list":"/api/users/list",
        "user_update":"/api/users/update",
        "user_password_change":"/api/users/changePassword",
        "user_delete":"/api/users/:id",
        "product_view":"/api/product/product",
        "product_add":"/api/product/addProduct",
        "product_update":"/api/product/update/:id",
        "product_disable":"/api/product/delete",
        "product_search":"/api/product/search",
        "order_view":"/api/order/getOrder",
        "order_place":"/api/order/createOrder",
        "cart_view":"/api/cart/getCart",
        "cart_add":"/api/cart/addAndUpdateToCart",
        "cart_delete":"/api/cart/deleteFromCart",
    };
 }
 