let products = [];

document.addEventListener('DOMContentLoaded', async function() {

    let user;

    var login = document.getElementById("logIN");
    var signup = document.getElementById("signUP");
    var logout = document.getElementById("logOUT");
    var adminPage = document.getElementById("adminPage");

    if (localStorage.getItem('user')) {
        user = JSON.parse(localStorage.getItem('user'))['user'];
        if(!user.Isadmin){
            adminPage.style.display = "none";
        }
        login.style.display = "none";
        signup.style.display = "none";
    }else{
        logout.style.display = "none";
    }

let selectedCategory = "all";
const categorySelector = document.getElementById('categorySelector');
const productsContainer = document.getElementById('products');
const cartItems = document.getElementById('cartItems');
updateTime();


// async function readXMLData(){
//     try{
//         let data = await $.ajax({
//             url: 'index.php',
//             type: 'post',
//             data: {action: 'readXML'}
//         })
    
//         const parser = new DOMParser();
//         const xmlDoc = parser.parseFromString(data, "text/xml");
//         const productNodes = xmlDoc.getElementsByTagName("product");

//         let temp = [];
//         for (let i = 0; i < productNodes.length; i++) {
//             let productNode = productNodes[i];
//             let category = "";
//             const name = productNode.getElementsByTagName("name")[0].textContent;
//             const type = productNode.getElementsByTagName("type")[0].textContent;
//             const dataType = productNode.getElementsByTagName("dataType")[0].textContent;
//             const price = parseInt(productNode.getElementsByTagName("price")[0].textContent);
            
//             if(productNode.getElementsByTagName("category") && productNode.getElementsByTagName("category")[0]){
//                 category = productNode.getElementsByTagName("category")[0].textContent;
//             }
//             const inventory = parseInt(productNode.getElementsByTagName("inventory")[0].textContent);
//             const image = productNode.getElementsByTagName("image")[0].textContent;

//             temp.push({ name, type, price, dataType, category, inventory, image });
//         }
//         products = temp;
//         }
//     catch{
//         console.log('Error occurred');
//     }
            
// }


// async function readJSONData(){
//     try{
//         let data = await $.ajax({
//             url: 'index.php',
//             type: 'post',
//             data: {action: 'readJSON'}
//         })
//         products = products.concat(data);
//     }
//     catch{
//         console.log('Error occurred');
//     }
            
// }


// await readXMLData();
// await readJSONData();

async function getProducts() {
    try {
        const response = await fetch('get_inventory.php', {
            method: 'POST',
            // Add headers if needed, e.g., 'Content-Type': 'application/json'
            // headers: {
            //     'Content-Type': 'application/json',
            // },
            // You can add a body here if you need to send data with the request
            // body: JSON.stringify({ key: 'value' }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.text();

        // console.log(data);

        if (data.includes('Error')) {
            alert('unsuccessful');
        } else {
            // console.log(data);
            products = JSON.parse(data);
            const productList = document.getElementById("products-list");
            addProductsToPage(productList);
        }
    } catch (error) {
        console.error('An error occurred during the fetch request:', error);
    }
}

await getProducts(); // No need for 'await' here, as 'getProducts' is not an asynchronous function now


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
        productInfo.textContent = `${product.name} - $${Number(product.price).toFixed(2)}`;

        const qty = document.createElement("input");
        qty.className="qty-input";

        const addToCartButton = document.createElement("button");
        addToCartButton.textContent = "Add to Cart";

        addToCartButton.addEventListener("click", () => {
            if(qty.value>Number(product.inventory)){
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

function getCustomerID() {
    // Retrieve the 'user' object from localStorage
    const userJson = localStorage.getItem('user');
    
    // Parse the JSON string to an object
    const userObj = JSON.parse(userJson);
    
    // Access the 'Customer_ID' property of the 'user' object
    const customerID = userObj.user.Customer_ID;
    
    return customerID;
}

async function getCart() {
    try {
    } catch (error) {
        console.error('An error occurred during the fetch cart:', error);
    }
}

await getProducts();

function addProductsToPage(productList,filteredProducts) {

    productList.innerHTML = '';
    selectedType = document.getElementById('type').value;
    
    
    if(filteredProducts ==  null && products.length !== 0){
        filteredProducts = products.filter(product => product.type === selectedType && (selectedCategory === 'all' || (selectedCategory !== "fruits" ? product.category === selectedCategory : product.category === selectedCategory || product.category === "pre-cut fruits")));
    
    }
    if(filteredProducts){
        filteredProducts.forEach((product) => {
            const listItem = document.createElement("div");
    
            const productImage = document.createElement("img");
            productImage.src = product.image;
            productImage.alt = product.name;
    
            const productInfo = document.createElement("div");
            productInfo.textContent = `${product.name} - $${Number(product.price).toFixed(2)}`;
    
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
}


function displayCart(cartList){
    cartList.innerHTML = '';
    total = 0;
    const customerID = getCustomerID();
    console.log('Customer ID:', customerID);

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

    // async function updateXMLData(products) {
    //     try {
    //         await $.ajax({
    //             url: 'index.php',
    //             type: 'post',
    //             data: {action: 'updateXML', data: objectToXml(products)},
    //             success: function(response) {
    //                 console.log(response);
    //             },
    //             error: function() {
    //                 console.log('Error occurred');
    //             }
    //         });
    //     } catch (error) {
    //         console.log('Error occurred', error);
    //     }
    // }

    // async function updateJSONData(products) {
    //     try {
    //         await $.ajax({
    //             url: 'index.php',
    //             type: 'post',
    //             data: {action: 'updateJSON', data: returnJSON(products)},
    //             success: function(response) {
    //                 console.log(response);
    //             },
    //             error: function() {
    //                 console.log('Error occurred');
    //             }
    //         });
    //     } catch (error) {
    //         console.log('Error occurred', error);
    //     }
    // }

    // updateXMLData(products);
    // updateJSONData(products);
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

        // async function updateXMLData(products) {
        //     try {
        //         await $.ajax({
        //             url: 'index.php',
        //             type: 'post',
        //             data: {action: 'updateXML', data: objectToXml(products)},
        //             success: function(response) {
        //                 console.log(response);
        //             },
        //             error: function() {
        //                 console.log('Error occurred');
        //             }
        //         });
        //     } catch (error) {
        //         console.log('Error occurred', error);
        //     }
        // }

        // async function updateJSONData(products) {
        //     try {
        //         await $.ajax({
        //             url: 'index.php',
        //             type: 'post',
        //             data: {action: 'updateJSON', data: returnJSON(products)},
        //             success: function(response) {
        //                 console.log(response);
        //             },
        //             error: function() {
        //                 console.log('Error occurred');
        //             }
        //         });
        //     } catch (error) {
        //         console.log('Error occurred', error);
        //     }
        // }

    // updateJSONData(products);
    // updateXMLData(products);



    updateInventory(products);
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
if(cartList)
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

const loginForm = document.getElementById("login-Form");
if(loginForm){
    loginButton = document.getElementById("login");
    loginButton.addEventListener("click", function (e) {
        
        async function loginCustomer() {
        
            var username = document.getElementById('username').value;
            var password = document.getElementById('password').value;
            
            var formData = new FormData();
                    formData.append('username', username);
                    formData.append('password', password);
        
            var xhr = new XMLHttpRequest();
            xhr.open('POST', 'login.php', true);
            xhr.onreadystatechange = function () {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    if (xhr.status === 200) {
                        console.log(xhr.responseText);
                        let data = xhr.responseText.toString();

                        if(data.includes("Error")){
                            alert("Login unsuccessful");
                        }else{
                            localStorage.setItem("user",data);
                            window.location.href = 'http://localhost/wpl/index.html';
                        }
                        
                    } else {
                        console.error('An error occurred during the AJAX request.');
                    }
                }
            };
            xhr.send(formData);

        }
        loginCustomer();
    });
}

const signupForm = document.getElementById("signup-Form");
if(signupForm){
    registerButton = document.getElementById("register");
    registerButton.addEventListener("click", function (e) {
        async function registerCustomer() {
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

        var formData = new FormData();
                formData.append('userName', username);
                formData.append('password', password);
                formData.append('firstName', firstName);
                formData.append('lastName', lastName);
                formData.append('email', email);
                formData.append('dob', dob);
                formData.append('address', address);
    
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'registerCustomer.php', true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    console.log(xhr.responseText);

                    let data = xhr.responseText.toString();

                    if(data.includes("Error")){
                        alert("Registration unsuccessful");
                    }else{
                        alert("Registered successfully")
                    }
                } else {
                    console.error('An error occurred during the AJAX request.');
                }
            }
        };
        xhr.send(formData);

        }
        registerCustomer();
    });
}




function validateForm() {
    
    
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


function triggerFileInput(inputId) {
    const fileInput = document.getElementById(inputId);
    fileInput.click();
    readJSONFile();
}

function triggerXMLFileInput(inputId) {
    const fileInput = document.getElementById(inputId);
    fileInput.click();
    readXMLFile();
}

async function readJSONFile() {
    const input = document.getElementById('jsonFileInput');

        const file = input.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = async function (e) {
                const jsonData = JSON.stringify(JSON.parse(e.target.result));
                console.log('JSON Data:', jsonData);

                var xhr = new XMLHttpRequest();
                    xhr.open('POST', 'insert_new_inventory.php', true);
                    xhr.onreadystatechange = function () {
                        if (xhr.readyState === XMLHttpRequest.DONE) {
                            if (xhr.status === 200) {
                                console.log(xhr.responseText);

                                let data = xhr.responseText.toString();

                                if(data.includes("Error")){
                                    alert("Registration unsuccessful");
                                }
                            } else {
                                console.error('An error occurred during the AJAX request.');
                            }
                        }
                    };
                    xhr.send(jsonData);
            };

            reader.readAsText(file);
        }
}

function readXMLFile() {
    const input = document.getElementById('xmlFileInput');


    const file = input.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(e.target.result, 'text/xml');
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
            
            console.log(temp)
            const jsonData = JSON.stringify(temp);
            console.log('JSON Data:', jsonData);

            var xhr = new XMLHttpRequest();
            xhr.open('POST', 'insert_new_inventory.php', true);
            xhr.onreadystatechange = function () {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    if (xhr.status === 200) {
                        console.log(xhr.responseText);

                        let data = xhr.responseText.toString();

                        if(data.includes("Error")){
                            alert("Registration unsuccessful");
                        }
                    } else {
                        console.error('An error occurred during the AJAX request.');
                    }
                }
            };
            xhr.send(jsonData);

        };

        reader.readAsText(file);
    }

}

const transactions = [
    {
        id: 1,
        status: "shipped",
        items: [
            { id: 101, name: "Product A", quantity: 2 },
            { id: 102, name: "Product B", quantity: 1 }
        ]
    },
    {
        id: 2,
        status: "not shipped",
        items: [
            { id: 103, name: "Product C", quantity: 3 },
            { id: 104, name: "Product D", quantity: 1 }
        ]
    },
    // Add more transactions as needed
];

function displayTransactions() {
    const tableBody = document.getElementById('transactionTableBody');
    tableBody.innerHTML = '';

    transactions.forEach(transaction => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${transaction.id}</td>
            <td>${transaction.status}</td>
            <td>${transaction.items.map(item => `${item.name} (Qty: ${item.quantity})`).join(', ')}</td>
            <td>${transaction.status === 'not shipped' ? `<button onclick="cancelTransaction(${transaction.id})">Cancel</button>` : ''}</td>
        `;
        tableBody.appendChild(row);
    });
}

function cancelTransaction(transactionId) {
    const transactionIndex = transactions.findIndex(transaction => transaction.id === transactionId);

    if (transactionIndex !== -1) {
        const canceledTransaction = transactions.splice(transactionIndex, 1)[0];
        console.log(`Transaction ${canceledTransaction.id} canceled.`);

        // Update inventory (example: increase quantities)
        canceledTransaction.items.forEach(item => {
            // Your inventory update logic here
            console.log(`Inventory updated for ${item.name}: Quantity increased by ${item.quantity}`);
        });

        // Refresh the displayed transactions after cancelation
        displayTransactions();
    }
}

function filterTransactions() {
    const filterType = document.getElementById('filterType').value;
    const monthFilter = document.getElementById('monthFilter').value;
    const yearFilter = document.getElementById('yearFilter').value;

    let filteredTransactions = [...transactions];

    switch (filterType) {
        case 'month':
            filteredTransactions = transactions.filter(transaction => {
                // Assuming date information is available in each transaction
                const transactionMonth = new Date(transaction.date).getMonth() + 1; // Months are 0-based
                return transactionMonth.toString() === monthFilter;
            });
            break;
        case 'last3months':
            const currentDate = new Date();
            const currentMonth = currentDate.getMonth() + 1; // Months are 0-based
            const last3Months = Array.from({ length: 3 }, (_, index) => (currentMonth - index + 12) % 12 + 1);
            filteredTransactions = transactions.filter(transaction => {
                const transactionMonth = new Date(transaction.date).getMonth() + 1; // Months are 0-based
                return last3Months.includes(transactionMonth);
            });
            break;
        case 'year':
            filteredTransactions = transactions.filter(transaction => {
                // Assuming date information is available in each transaction
                const transactionYear = new Date(transaction.date).getFullYear();
                return transactionYear.toString() === yearFilter;
            });
            break;
    }

    // Display the filtered transactions
    displayTransactions(filteredTransactions);
}

// Initial display of transactions
let acc = document.getElementById('account');
if(acc){
    displayTransactions();
}


function displayInventory() {
    const tableBody = document.getElementById('inventoryTableBody');
    tableBody.innerHTML = '';
    const temp = products; // Ensure 'products' is defined and accessible
    // console.log(temp);
    // console.log(Array.isArray(products))
    temp.forEach((each) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${each.id}</td>
            <td>${each.name}</td>
            <td>${each.type}</td>
            <td>${each.category}</td>
            <td>${each.inventory}</td>
            <td>${each.price}</td>
        `;
        tableBody.appendChild(row);
    });
}


function displayLowInventory() {
    const tableBody = document.getElementById('inventoryTableBody');
    tableBody.innerHTML = '';
    temp = products.filter(each=>{
        if(each.inventory<3){
            return true;
        }
    });
    temp.forEach(each => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${each.id}</td>
            <td>${each.name}</td>
            <td>${each.type}</td>
            <td>${each.subCategory}</td>
            <td>${Number(each.inventory)}</td>
            <td>${each.price}</td>
        `;
        tableBody.appendChild(row);
    });
}

function date2Customers() {
    date = document.getElementById('formDate');
    formData = new formData()
    formData.append('date',date);
    xhr.open('POST', 'get_customers_by_date.php', true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {

                let temp = JSON.parse(xhr.responseText);
                const tableBody = document.getElementById('customerTableBody');
                tableBody.innerHTML = '';
                
                temp.forEach(each => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${each.id}</td>
                        <td>${each.name}</td>
                    `;
                    tableBody.appendChild(row);
                });

                if(data.includes("Error")){
                    alert("Registration unsuccessful");
                }else{
                    console.log(data)
                }
            } else {
                console.error('An error occurred during the AJAX request.');
            }
        }
    };
    xhr.send(formData);
}

function zip2Customers() {
    xhr.open('POST', 'get_inventory.php', true);
    pincode = document.getElementById('pincode');
    month = document.getElementById('month');
    formData = new formData()
    formData.append('pincode',pincode);
    formData.append('month',month);
    xhr.open('POST', 'get_customers_by_zip_and_month.php', true);

    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {

                let temp = JSON.parse(xhr.responseText);
                const tableBody = document.getElementById('customerTableBody');
                tableBody.innerHTML = '';
                
                temp.forEach(each => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${each.id}</td>
                        <td>${each.name}</td>
                    `;
                    tableBody.appendChild(row);
                });

                if(data.includes("Error")){
                    alert("Registration unsuccessful");
                }else{
                    console.log(data)
                }
            } else {
                console.error('An error occurred during the AJAX request.');
            }
        }
    };
    xhr.send(formData);
}


let inventoryTable = document.getElementById('inventoryTableBody');

if(inventoryTable){
    displayInventory();
}


async function modifyInventory(){
    xhr.open('POST', 'update_inventory_item.php', true);
    item = document.getElementById('updateID');
    price = document.getElementById('updatePrice');
    inventory = document.getElementById('updateInventory');
    formData = new formData()
    formData.append('itemNumber',item);
    formData.append('unitPrice',price);
    formData.append('quantityInInventory',inventory);
    xhr.open('POST', 'update_inventory_item.php', true);

    xhr.onreadystatechange = async function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                await getProducts();
            } else {
                console.error('An error occurred during the AJAX request.');
            }
        }
    };
    xhr.send(formData);
}