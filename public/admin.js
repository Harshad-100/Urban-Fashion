
async function loadUsers(){

    const response =
    await fetch("/api/users");

    const users =
    await response.json();

    document.getElementById("users")
    .innerHTML =

    users.map(user => `
        <p>
            ${user.name}
            -
            ${user.email}
        </p>
    `).join("");

}

async function loadOrders(){

    const response =
    await fetch("/api/orders");

    const orders =
    await response.json();

    document.getElementById("orders")
    .innerHTML =

    orders.map(order => `
        <p>
            ${order.customer_name}
            -
            ₹${order.total_amount}
        </p>
    `).join("");

}

async function loadAnalytics(){

    const users =
    await fetch("/api/analytics/users");
    const usersData =
    await users.json();

    document.getElementById(
        "total-users"
    ).textContent =
    usersData.total;

    const orders =
    await fetch("/api/analytics/orders");
    const ordersData =
    await orders.json();

    document.getElementById(
        "total-orders"
    ).textContent =
    ordersData.total;

    const revenue =
    await fetch("/api/analytics/revenue");
    const revenueData =
    await revenue.json();

    document.getElementById(
        "total-revenue"
    ).textContent =
    "₹" +
    (revenueData.total || 0);

    const products =
await fetch("/api/analytics/products");

const productsData =
await products.json();

document.getElementById(
"total-products"
).textContent =
productsData.total;

}

loadAnalytics();

async function addProduct(){

    const name =
    document.getElementById(
        "product-name"
    ).value;

    const price =
    document.getElementById(
        "product-price"
    ).value;

    const category =
    document.getElementById(
        "product-category"
    ).value;

    const imageFile =
    document.getElementById(
        "product-image"
    ).files[0];

    const formData =
    new FormData();

    formData.append(
        "image",
        imageFile
    );

    const uploadResponse =
    await fetch(
        "/api/upload",
        {
            method:"POST",
            body:formData
        }
    );

    const uploadData =
    await uploadResponse.json();

    await fetch(
        "/api/products",
        {
            method:"POST",

            headers:{
                "Content-Type":
                "application/json"
            },

            body:JSON.stringify({

                name,
                price,
                category,

                image:
                uploadData.image

            })

        }
    );

    loadProducts();

}

async function loadProducts(){

    const response =
    await fetch(
        "/api/products"
    );

    const products =
    await response.json();

    document.getElementById(
        "products"
    ).innerHTML =

    products.map(product=>`

    <div class="cart-item">

    <strong>
    ${product.name}
    </strong>

    ₹${product.price}

    <button
onclick="editProduct(
${product.id}
)">
Edit
</button>

<button
onclick="deleteProduct(
${product.id}
)">
Delete
</button>

    </div>

    `).join("");

}

async function deleteProduct(id){

    await fetch(
        "/api/products/" + id,
        {
            method:"DELETE"
        }
    );

    loadProducts();

}

loadProducts();

async function editProduct(id){

    const name =
    prompt("New Product Name");

    const price =
    prompt("New Price");

    const category =
    prompt("New Category");

    const image =
    prompt("New Image URL");

    if(!name) return;

    await fetch(
        "/api/products/" + id,
        {
            method:"PUT",

            headers:{
                "Content-Type":
                "application/json"
            },

            body:JSON.stringify({
                name,
                price,
                category,
                image
            })
        }
    );

    loadProducts();

}

async function loadRecentUsers(){

    const response =
    await fetch(
        "/api/recent-users"
    );

    const users =
    await response.json();

    document.getElementById(
        "recent-users"
    ).innerHTML =

    users.map(user=>`

    <div class="activity-card">

${user.name}
-
${user.email}

<button
onclick="
deleteUser(
${user.id}
)">
Delete
</button>

</div>

    `).join("");

}

async function loadRecentOrders(){

    const response =
    await fetch(
        "/api/recent-orders"
    );

    const orders =
    await response.json();

    document.getElementById(
        "recent-orders"
    ).innerHTML =

    orders.map(order=>`

   <div class="activity-card">

${order.customer_name}

-
₹${order.total_amount}

<button
onclick="
deleteOrder(
${order.id}
)">
Delete
</button>

</div>

    `).join("");

}

async function loadRecentProducts(){

    const response =
    await fetch(
        "/api/recent-products"
    );

    const products =
    await response.json();

    document.getElementById(
        "recent-products"
    ).innerHTML =

    products.map(product=>`

    <div class="activity-card">

    ${product.name}

    -
    ₹${product.price}

    </div>

    `).join("");

}

loadRecentUsers();
loadRecentOrders();
loadRecentProducts();

async function deleteUser(id){

    await fetch(
        "/api/users/" + id,
        {
            method:"DELETE"
        }
    );

    loadRecentUsers();
    loadAnalytics();

}

async function deleteOrder(id){

    await fetch(
        "/api/orders/" + id,
        {
            method:"DELETE"
        }
    );

    loadRecentOrders();
    loadAnalytics();

}