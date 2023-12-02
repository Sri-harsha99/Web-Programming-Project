let products = [];

document.addEventListener('DOMContentLoaded', async function() {

let selectedCategory = "all";
const categorySelector = document.getElementById('categorySelector');
const productsContainer = document.getElementById('products');
const cartItems = document.getElementById('cartItems');
updateTime();


async function readXMLData(){
    try{
        let data = await $.ajax({
            url: 'index.php',
            type: 'post',
            data: {action: 'readXML'}
        })
    
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(data, "text/xml");
        const productNodes = xmlDoc.getElementsByTagName("product");

        let temp = [];
        for (let i = 0; i < productNodes.length; i++) {
            let productNode = productNodes[i];
            let category = "";
            const name = productNode.getElementsByTagName("name")[0].textContent;
            const type = productNode.getElementsByTagName("type")[0].textContent;
            const dataType = productNode.getElementsByTagName("dataType")[0].textContent;
            const price = parseInt(productNode.getElementsByTagName("price")[0].textContent);
            
            if(productNode.getElementsByTagName("category") && productNode.getElementsByTagName("category")[0]){
                category = productNode.getElementsByTagName("category")[0].textContent;
            }
            const inventory = parseInt(productNode.getElementsByTagName("inventory")[0].textContent);
            const image = productNode.getElementsByTagName("image")[0].textContent;

            temp.push({ name, type, price, dataType, category, inventory, image });
        }
        products = temp;
        }
    catch{
        console.log('Error occurred');
    }
            
}


async function readJSONData(){
    try{
        let data = await $.ajax({
            url: 'index.php',
            type: 'post',
            data: {action: 'readJSON'}
        })
        products = products.concat(data);
    }
    catch{
        console.log('Error occurred');
    }
            
}


await readXMLData();
await readJSONData();

categorySelector.addEventListener('change', function () {
    const selectedCategory = categorySelector.value;
    const selectedType = document.getElementById('type').value;
    
    const filteredProducts = products.filter(product => product.type === selectedType && (selectedCategory === 'all' || (selectedCategory !== "fruits" ? product.category === selectedCategory : product.category === selectedCategory || product.category === "pre-cut fruits")));
    const productList = document.getElementById("products-list");

    productList.innerHTML = '';
    if(filteredProducts == null){
        filteredProducts = products;
    }

    filteredProducts.forEach((product) => {
        const listItem = document.createElement("div");

        const productImage = document.createElement("img");
        productImage.src = product.image;
        productImage.alt = product.name;

        const productInfo = document.createElement("div");
        productInfo.textContent = `${product.name} - $${product.price.toFixed(2)}`;

        const qty = document.createElement("input");
        qty.className="qty-input";

        const addToCartButton = document.createElement("button");
        addToCartButton.textContent = "Add to Cart";

        addToCartButton.addEventListener("click", () => {
            if(qty.value>product.inventory){
                alert(`Not enough inventory`);
                return;
            }
            product.inventory -= qty.value;
            addToCart(product,qty.value);
            qty.value = "";
            alert(`Added ${product.name} to the cart!`);
        });

        listItem.appendChild(productImage);
        listItem.appendChild(productInfo);
        listItem.appendChild(qty);
        listItem.appendChild(addToCartButton);

        productList.appendChild(listItem);
});

});
let cartProducts = [];
let curr = localStorage.getItem("uniqueCart")
if(curr){
    cartProducts = JSON.parse(curr);
}else{
    cartProducts = [];
}

function addProductsToPage(productList,filteredProducts) {

    productList.innerHTML = '';
    selectedType = document.getElementById('type').value;
    
    
    if(filteredProducts == null){
        filteredProducts = products.filter(product => product.type === selectedType && (selectedCategory === 'all' || (selectedCategory !== "fruits" ? product.category === selectedCategory : product.category === selectedCategory || product.category === "pre-cut fruits")));
    
    }

    filteredProducts.forEach((product) => {
        const listItem = document.createElement("div");

        const productImage = document.createElement("img");
        productImage.src = product.image;
        productImage.alt = product.name;

        const productInfo = document.createElement("div");
        productInfo.textContent = `${product.name} - $${product.price.toFixed(2)}`;

        const qty = document.createElement("input");
        qty.className="qty-input";
        qty.type = "number";
        qty.min = "0";

        const addToCartButton = document.createElement("button");
        addToCartButton.textContent = "Add to Cart";

        addToCartButton.addEventListener("click", () => {
            if(qty.value>product.inventory){
                alert(`Not enough inventory`);
                return;
            }
            product.inventory -= qty.value;
            addToCart(product,qty.value);
            qty.value = "";
            alert(`Added ${product.name} to the cart!`);
        });

        listItem.appendChild(productImage);
        listItem.appendChild(productInfo);
        listItem.appendChild(qty);
        listItem.appendChild(addToCartButton);

        productList.appendChild(listItem);
    });
}

function displayCart(cartList){
    cartList.innerHTML = '';
    total = 0;
    cartProducts.forEach((product) => {
        const listItem = document.createElement("div");

        const productInfo = document.createElement("div");
        productInfo.textContent = `${product.name} - $${product.price} - ${product.qty} - $${product.total}`;
        total += parseInt(product.total);

        listItem.appendChild(productInfo);

        cartList.appendChild(listItem);
    });
    const listItem = document.createElement("div");
    const productInfo = document.createElement("div");
    productInfo.textContent = `Total --------------------------- $${total}`;
    listItem.appendChild(productInfo);
    cartList.appendChild(listItem);
}

function objectToXml(obj) {

    var xmlString = '<products>';
    obj.forEach((data)=>{
        if(data.dataType == "xml"){
            xmlString += '<product>'
            for (var key in data) {
                xmlString += '<' + key + '>' + data[key] + '</' + key + '>';
            }
            xmlString += '</product>'
        }
    });

    xmlString += '</products>';
    return xmlString;
}

function returnJSON(data){
    jsonData = data.filter(each=>each.dataType == "json");
    return JSON.stringify(jsonData);
}

// function addToCart(product,qty){
//     if(qty ===""){
//         qty="1";
//     }
//     seen = false;
//     products.forEach((prod) =>{
//         if (prod.name == product.name){
//             prod.inventory = (Number(prod.inventory) - Number(qty)).toString();

//         }
//     })
//     cartProducts.forEach((prod) => {
//         if (prod.name == product.name){
//             prod.qty = (Number(prod.qty)+Number(qty)).toString();
//             prod.total = (Number(prod.qty)*Number(prod.price)).toString();
//             seen = true              
//         }
//     });
//     if(!seen){
//         cartProducts.push({name: product.name,qty: qty.toString(),price: product.price.toString(),total:(qty*product.price).toString()});
//     }
//     localStorage.setItem('uniqueCart', JSON.stringify(cartProducts));
//     const productList = document.getElementById("cart-products");
//     displayCart(productList);
// }

function addToCart(product,qty){
    if(qty < 0){
        alert("Quantity should be more than 0")
        return
    }
    if(qty ===""){
        qty="1";
    }

    seen = false;
    cartProducts.forEach((prod) => {
        if (prod.name == product.name){
            prod.qty = (Number(prod.qty)+Number(qty)).toString();
            prod.total = (Number(prod.qty)*Number(prod.price)).toString();
            seen = true              
        }
    });

    if(!seen){
        cartProducts.push({name: product.name,qty: qty.toString(),price: product.price.toString(),total:(qty*product.price).toString()});
    }

    localStorage.setItem('uniqueCart', JSON.stringify(cartProducts));
    const productList = document.getElementById("cart-products");
    displayCart(productList);

    async function updateXMLData(products) {
        try {
            await $.ajax({
                url: 'index.php',
                type: 'post',
                data: {action: 'updateXML', data: objectToXml(products)},
                success: function(response) {
                    console.log(response);
                },
                error: function() {
                    console.log('Error occurred');
                }
            });
        } catch (error) {
            console.log('Error occurred', error);
        }
    }

    async function updateJSONData(products) {
        try {
            await $.ajax({
                url: 'index.php',
                type: 'post',
                data: {action: 'updateJSON', data: returnJSON(products)},
                success: function(response) {
                    console.log(response);
                },
                error: function() {
                    console.log('Error occurred');
                }
            });
        } catch (error) {
            console.log('Error occurred', error);
        }
    }

    updateXMLData(products);
    updateJSONData(products);
}

const cartButtons = document.getElementById("cartButtons");

var button1 = document.getElementById("remove");
var button2 = document.getElementById("buy");

button1.addEventListener("click", function (e) {
        products.forEach((product) =>{
            cartProducts.forEach((prod) => {
                if (product.name == prod.name){
                    product.inventory = (Number(product.inventory)+Number(prod.qty));              
                }
            });
        })

        cartProducts = [];
        localStorage.setItem('uniqueCart', JSON.stringify(cartProducts));
        const productList = document.getElementById("cart-products");
        displayCart(productList);

        async function updateXMLData(products) {
            try {
                await $.ajax({
                    url: 'index.php',
                    type: 'post',
                    data: {action: 'updateXML', data: objectToXml(products)},
                    success: function(response) {
                        console.log(response);
                    },
                    error: function() {
                        console.log('Error occurred');
                    }
                });
            } catch (error) {
                console.log('Error occurred', error);
            }
        }

        async function updateJSONData(products) {
            try {
                await $.ajax({
                    url: 'index.php',
                    type: 'post',
                    data: {action: 'updateJSON', data: returnJSON(products)},
                    success: function(response) {
                        console.log(response);
                    },
                    error: function() {
                        console.log('Error occurred');
                    }
                });
            } catch (error) {
                console.log('Error occurred', error);
            }
        }
    updateJSONData(products);
    updateXMLData(products);
})

button2.addEventListener("click", function(e){
    cartProducts = [];
    localStorage.setItem('uniqueCart', JSON.stringify(cartProducts));
    const productList = document.getElementById("cart-products");
    displayCart(productList);

})


const productList = document.getElementById("products-list");
addProductsToPage(productList);

const cartList = document.getElementById("cart-products");
displayCart(cartList);

function hasNumbers(inputString) {
    const regex = /\d/;
    return regex.test(inputString);
}



const searchForm = document.getElementById("search-form");
searchForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const searchInput = document.getElementById("search-input");
    const searchTerm = searchInput.value.toLowerCase();
    
    if(hasNumbers(searchTerm)){
        alert(`Numbers are not allowed in the search`);
        return;
    }
    const categorySelector = document.getElementById('categorySelector');
    const selectedCategory = categorySelector.value;
    const selectedType = document.getElementById('type').value;

    const filteredProducts = products.filter((product) => {
        return product.type === selectedType && (selectedCategory === 'all' || product.category === selectedCategory) && product.name.toLowerCase().includes(searchTerm);
    });

    addProductsToPage(productList, filteredProducts);
});


function validateForm() {
    
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    var confirmPassword = document.getElementById('confirmPassword').value;
    var firstName = document.getElementById('firstName').value;
    var lastName = document.getElementById('lastName').value;
    var dob = document.getElementById('dob').value;
    var email = document.getElementById('email').value;
    var address = document.getElementById('address').value;

    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return false;
    }

    if (password.length < 8) {
        alert("Password must be at least 8 characters.");
        return false;
    }

    var dobRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!dob.match(dobRegex)) {
        alert("Date of birth must be in MM/DD/YYYY format.");
        return false;
    }

    var emailRegex = /\S+@\S+\.\S+/;
    if (!email.match(emailRegex)) {
        alert("Invalid email format.");
        return false;
    }

    let object = {
        username:username,
        password:password,
        firstName:firstName,
        lastName:lastName,
        dob:dob,
        email:email,
        address:address    
    }

    async function registerCustomer() {
        try {
            await $.ajax({
                url: 'index.php',
                type: 'post',
                data: {action: 'registerCustomer', data: returnJSON(object)},
                success: function(response) {
                    console.log(response);
                },
                error: function() {
                    console.log('Error occurred');
                }
            });
        } catch (error) {
            console.log('Error occurred', error);
        }
    }

    registerCustomer();
}

var registerButton = document.getElementById("register");

if(registerButton){
    registerButton.addEventListener("click", function (e) {
        validateForm()
    })
}
});

function updateTime() {
    const timeElement = document.getElementById("time");
    const currentTime = new Date();
    const date = currentTime.getDate();
    const month = currentTime.getMonth();
    const year = currentTime.getFullYear();
    const formattedTime = currentTime.toLocaleTimeString();

    timeElement.textContent = "Date: " + month+"-"+date+"-"+year + " Current time: " + formattedTime;
    setInterval(updateTime, 1000);
}

