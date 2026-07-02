
const cart =
JSON.parse(localStorage.getItem("cart")) || [];

const container =
document.getElementById("cart-items");

let total = 0;

cart.forEach(item => {
  total += Number(item.price.replace("₹",""));

  container.innerHTML += `
    <div>
      <h3>${item.name}</h3>
      <p>${item.price}</p>
    </div>
  `;
});

document.getElementById("total").textContent =
"Total: ₹" + total;