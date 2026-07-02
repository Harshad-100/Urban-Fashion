
const products = JSON.parse(
localStorage.getItem("products")
) || [];

const params =
new URLSearchParams(
window.location.search
);

const id =
params.get("id");

const product =
products[id];

const container =
document.getElementById("product-details");

if(product){

container.innerHTML = `

<div class="product-page">

<img src="${product.image}">

<div>

<h1>${product.name}</h1>

<h3>${product.price}</h3>

<p>

Category:
${product.category}

</p>

<p>

Premium quality fashion item.

Perfect for everyday wear.

</p>

<button onclick='addToCart()'>
Add To Cart
</button>

</div>

</div>

`;

}