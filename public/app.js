
let products = [];

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function updateCartCount(){
    const count = document.getElementById("cart-count");
    if(count){
        count.textContent = cart.length;
    }
}

function addToCart(product){

  cart.push(product);

  localStorage.setItem(
    "cart",
    JSON.stringify(cart)
  );

  updateCartCount();

  showToast(product.name + " added to cart");
}

function addToCartById(id){

    const product = products.find(p => p.id === id);

    if(!product){
        showToast("Product not found","error");
        return;
    }

    addToCart(product);

}


function displayProducts(list){

   const container =
    document.getElementById("product-container");

    if(!container) return;

    container.innerHTML = "";

    list.forEach(product=>{

        container.innerHTML += `

       <div class="product-card">

       <div class="sale-badge">
         SALE
       </div>

        <img src="${product.image}">

        <div class="product-info">

       <h3>

<a href="product.html?id=${products.indexOf(product)}">
${product.name}
</a>

</h3>

<p class="rating">
⭐⭐⭐⭐☆
</p>


        <p>${product.price}</p>
        
     <button onclick="addToCartById(${product.id})">
        Add To Cart
        </button>

        </div>

        </div>
        `;
    });
}

// displayProducts(products);
updateCartCount();

const search =
document.getElementById("search");

if(search){

search.addEventListener("input", e=>{

const value =
e.target.value.toLowerCase();

const filtered =
products.filter(product =>
product.name.toLowerCase().includes(value)
);

displayProducts(filtered);

});
}

function filterProducts(category){

    if(category === "All"){
        displayProducts(products);
        return;
    }

    const filtered =
    products.filter(product =>
        product.category === category
    );

    displayProducts(filtered);
}

localStorage.setItem(
"products",
JSON.stringify(products)
);

const user =
JSON.parse(
localStorage.getItem("loggedUser")
);

if(user){

    console.log(
        "Logged in as:",
        user.name
    );

}async function loadProducts(){

    const response =
    await fetch("/api/products");

    products =
    await response.json();

    displayProducts(products);

}

loadProducts();

function logout(){

    localStorage.removeItem("loggedUser");

    showToast("Logged Out Successfully. Redirecting...");

    setTimeout(()=>{

        window.location.href="index.html";

    },2000);

}

const currentUser =
localStorage.getItem(
"loggedUser"
);

console.log(currentUser);

const logoutLink =
document.getElementById("logout-link");

const loginLink =
document.getElementById("login-link");

const registerLink =
document.getElementById("register-link");

if(currentUser){

    if(logoutLink)
        logoutLink.style.display = "inline";

    if(loginLink)
        loginLink.style.display = "none";

    if(registerLink)
        registerLink.style.display = "none";

}else{

    if(logoutLink)
        logoutLink.style.display = "none";

}


// const loginLink = document.getElementById("login-link");
// const registerLink = document.getElementById("register-link");

// if(currentUser){

//     if(loginLink) loginLink.style.display = "none";

//     if(registerLink) registerLink.style.display = "none";

// }else{

//     if(logoutLink) logoutLink.style.display = "none";

// }

function showToast(message,type="success"){

    const toast =
    document.getElementById("toast");

    if(!toast) return;

    // toast.className = "";

    toast.className = "";
    toast.textContent = "";

    toast.classList.add(type);

    toast.classList.add("show");

    toast.textContent = message;

    setTimeout(()=>{

        toast.classList.remove("show");

    },3000);

}

function goToCheckout(){

    const user = JSON.parse(
        localStorage.getItem("loggedUser")
    );

    if(!user){

        localStorage.setItem(
            "redirectAfterLogin",
            "checkout.html"
        );

        showToast("Please Login First","error");

        setTimeout(()=>{

            window.location.href =
            "login.html";

        },1500);

        return;
    }

    window.location.href =
    "checkout.html";

}