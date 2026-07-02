
const logs = [];

const startTime = Date.now();

async function loadDashboard(){

    // Users
    const users = await fetch("/api/users").then(r=>r.json());

    document.getElementById("totalUsers").textContent =
    users.length;

   addLog(`Users Loaded : ${users.length}`); 

    // Products
    const products = await fetch("/api/products").then(r=>r.json());

    document.getElementById("totalProducts").textContent =
    products.length;

    addLog(`Products Loaded : ${products.length}`);

    // Orders
    const orders = await fetch("/api/orders").then(r=>r.json());

    document.getElementById("totalOrders").textContent =
    orders.length;

    addLog(`Orders Loaded : ${orders.length}`);

    // Users Table
    const table =
    document.getElementById("usersTable");

    table.innerHTML="";

    // Recent Users
const recentUsers =
await fetch("/api/recent-users")
.then(r=>r.json());

const recentUsersTable =
document.getElementById("recentUsers");

recentUsersTable.innerHTML="";

recentUsers.forEach(user=>{

    recentUsersTable.innerHTML += `
    <tr>
        <td>${user.id}</td>
        <td>${user.name}</td>
        <td>${user.email}</td>
    </tr>
    `;

});


// Recent Orders
const recentOrders =
await fetch("/api/recent-orders")
.then(r=>r.json());

const recentOrdersTable =
document.getElementById("recentOrders");

recentOrdersTable.innerHTML="";

recentOrders.forEach(order=>{

    recentOrdersTable.innerHTML += `
    <tr>
        <td>${order.id}</td>
        <td>${order.customer_name}</td>
        <td>₹${order.total_amount}</td>
    </tr>
    `;

});


// Recent Products
const recentProducts =
await fetch("/api/recent-products")
.then(r=>r.json());

const recentProductsTable =
document.getElementById("recentProducts");

recentProductsTable.innerHTML="";

recentProducts.forEach(product=>{

    recentProductsTable.innerHTML += `
    <tr>
        <td>${product.id}</td>
        <td>${product.name}</td>
        <td>₹${product.price}</td>
    </tr>
    `;

});

    document.getElementById("lastUpdated").textContent =
"Last Updated : " +
new Date().toLocaleTimeString();

    users.forEach(user=>{

        table.innerHTML += `
        <tr>
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.password}</td>
        </tr>
        `;

    });

}

loadDashboard();

// Refresh every 10 seconds
setInterval(loadDashboard,10000);

function updateUptime(){

    const seconds =
    Math.floor((Date.now()-startTime)/1000);

    const hrs =
    String(Math.floor(seconds/3600)).padStart(2,"0");

    const mins =
    String(Math.floor((seconds%3600)/60)).padStart(2,"0");

    const secs =
    String(seconds%60).padStart(2,"0");

    document.getElementById("serverUptime").textContent =
    `${hrs}:${mins}:${secs}`;

}

setInterval(updateUptime,1000);

updateUptime();

function addLog(message){

    const time = new Date().toLocaleTimeString();

    logs.unshift(`[${time}] ${message}`);

    if(logs.length > 10){

        logs.pop();

    }

    document.getElementById("serverLogs").innerHTML =
    logs.map(log=>`<p>${log}</p>`).join("");

}