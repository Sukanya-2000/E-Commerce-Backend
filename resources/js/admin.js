import axios from "axios";
import moment from "moment";

export function initAdmin() {
  const orderTableBody = document.querySelector("#orderTableBody");
  let orders = [];
  let markup;

  axios
    .get("/admin/orders", {
      headers: {
        "X-Requested-With": "XMLHttpRequest",
      },
    })
    .then((res) => {
      orders = res.data;
      markup = generateMarkup(orders);
      orderTableBody.innerHTML = markup;
    })
    .catch((err) => {
      console.log(err);
    });

  function renderItems(items) {
    let parsedItems = Object.values(items);
    return parsedItems
      .map((menuItem) => {
        return `
                <p>${menuItem.item.name} - ${menuItem.qty} pcs </p>
            `;
      })
      .join("");
  }
}