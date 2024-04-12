const Order = require("../../../models/order");
const moment = require("moment");

function orderController() {
    return {
        // OrderController
        store: function (req, res) {
            // User Data for Order Placement
            const { phone, address } = req.body;
            // User Data Validation
            if (!phone || !address) {
                req.flash("error", "All fields are required");
                return res.redirect("/cart");
            } else {
                const order = new Order({
                    // Already LoggedIn User's Order Data
                    customerId: req.user._id,
                    items: req.session.cart.items,
                    phone: phone,
                    address: address,
                });

                // Saving the Data
                order
                    .save()
                    .then((result) => {
                        req.flash("success", "Order Placed Successfully");
                        // To Delete the cart after the order is placed
                        delete req.session.cart;
                        return res.redirect("/customer/orders");
                    })
                    .catch((err) => {
                        req.flash("error", "Something Went Wrong");
                        return res.redirect("/cart");
                    });
            }
        },

        // Rendering Customer's Order Page
        index: async function (req, res) {
            // LoggedIn Users's Order Data
            const orders = await Order.find({ customerId: req.user._id }, null, {
                sort: { createdAt: -1 },
            });
            res.render(
                "customers/orders",
                // Sending Customer's Orders Data
                { orders: orders, moment: moment }
            );
        },

        // Client-side JavaScript for handling add-to-cart button click
        clientScript: `
            const addToCartButtons = document.querySelectorAll(".add-to-cart");
            addToCartButtons.forEach((button) => {
                button.addEventListener("click", (event) => {
                    const food = JSON.parse(button.dataset.food);
                    updateCart(food);
                });
            });

            function updateCart(food) {
                fetch("/update-cart", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(food)
                })
                .then((res) => res.json())
                .then((data) => {
                    const cartCounter = document.querySelector(".cart-counter");
                    cartCounter.innerText = data.totalQty;
                    alert("New Item Added To Your Cart");
                })
                .catch((err) => {
                    console.error("Error:", err);
                    alert("Something Went Wrong");
                });
            }
        `
    };
}

module.exports = orderController;
