const axios = require("axios");
const Noty = require("noty");

// Selecting Add-To-Cart Button
const addToCartButtons = document.querySelectorAll(".add-to-cart");
// Selecting Nav Cart Counter
const cartCounter = document.querySelector(".cart-counter");

// Updating Cart with Specific Quantity
function updateCart(food, quantity) {
  // Ajax Call with the food item and quantity
  axios
    .post("/update-cart", { food, quantity })
    .then((res) => {
      cartCounter.innerText = res.data.totalQty;
      new Noty({
        type: "success",
        timeout: 1000,
        text: "New Item Added To Your Cart",
        progressBar: false,
      }).show();
    })
    .catch((err) => {
      new Noty({
        type: "error",
        timeout: 1000,
        text: "Something Went Wrong",
        progressBar: false,
      }).show();
    });
}

// Button Action
addToCartButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    const food = JSON.parse(button.dataset.food);
    const quantity = 1; // You can set the desired quantity here
    updateCart(food, quantity);
  });
});

// Remove alert after 2 secs
const alertMsg = document.querySelector("#success-alert");
if (alertMsg) {
  setTimeout(() => {
    alertMsg.remove();
  }, 2000);
}
