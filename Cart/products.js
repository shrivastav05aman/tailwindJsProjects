// ----------------------products section-----------------------
const productTag = document.querySelector(".product"),
productsTag = document.querySelector(".products")
const productsUrl = "https://dummyjson.com/products"

const products = []

//fetching products
const getProducts = async()=>{
    const response = await fetch(productsUrl)
    const data = await response.json()
    
    return data.products
}

const fetchedProducts = await getProducts()

fetchedProducts.forEach((value,index)=>{
    products.push({
        title: value.title,
        img: value.thumbnail,
        price: value.price,
        description: value.description,
        rating: value.rating,
        category: value.category
    })
})

//function to show products
function showProducts(product){
    if(productsTag){
        productsTag.innerHTML = []

        product.forEach((value,index)=>{
            productsTag.innerHTML += `<div class="product border-4 border-yellow-300 rounded-3xl bg-white flex flex-col justify-center items-center p-4 ">
                    <img src=${value.img}>                    
                    <h1 class="title text-2xl font-bold tracking-wider">${value.title}</h1>
                    <h3 class="price text-xl">Price : <span class="font-extrabold">$${value.price}</span> </h3>
                    <div class="descriptions">
                        <h1 class="description text-sm inline">${value.description}</h1>
                        <button class="readMore inline cursor-pointer text-blue-950 font-bold">Read More...</button>
                        <button class="readLess hidden cursor-pointer text-blue-950 font-bold">Read Less...</button>
                    </div>                    
                    <div class="rating font-bold text-blue-900 text-lg">
                        <p>Ratings : <span>${Math.floor(value.rating)}</span></p>
                        <div>
                            <i class="fa-regular fa-star text-yellow-600"></i>
                            <i class="fa-regular fa-star text-yellow-600"></i>
                            <i class="fa-regular fa-star text-yellow-600"></i>
                            <i class="fa-regular fa-star text-yellow-600"></i>
                            <i class="fa-regular fa-star text-yellow-600"></i>                            
                        </div>
                    </div>
                    <p class="category font-bold text-yellow-600 text-lg capitalize">Category : <span>${value.category}</span></p>
                    <button class="addToCartBtn border-2 border-yellow-400 w-full rounded-lg my-2 px-2 py-3 text-xl font-bold cursor-pointer hover:scale-105">Add To Cart</button>                
                    </div>                
                    `
                })
        }    
}


//function to add function like read more, read less and rating stars

function addFunctionality(products){
    const description = document.querySelectorAll(".description")


    const readMoreBtn = document.querySelectorAll(".descriptions .readMore"),
    readLessBtn = document.querySelectorAll(".descriptions .readLess")
    const ratingsTag = document.querySelectorAll(".rating div"),
    ratingNumber = document.querySelectorAll(".rating p span")

    
    if(products){
        for(let i=0; i<products.length;i++){

        if(description[i]){
            const descriptionText = description[i].innerText
            const readMoreFunction = ()=>{
            let text = descriptionText
            description[i].innerText = text
        }

        let text = ""
        for(let j=0; j<10; j++){
            text+= descriptionText.split(" ")[j]
            text+= " "
        }
        description[i].innerText = text

        if(readMoreBtn[i]){
            readMoreBtn[i].addEventListener("click",()=>{
                readMoreFunction()
                readMoreBtn[i].classList.add("hidden")
                readMoreBtn[i].classList.remove("inline")
                readLessBtn[i].classList.add("inline")
                readLessBtn[i].classList.remove("hidden")        
            })
        }

    
        if(readLessBtn[i]){
            readLessBtn[i].addEventListener("click",()=>{
                description[i].innerText = text
                readLessBtn[i].classList.add("hidden")
                readLessBtn[i].classList.remove("inline")
                readMoreBtn[i].classList.remove("hidden")
                readMoreBtn[i].classList.add("inline")
            })
        }
    }
    

    
    if(ratingNumber[i]){
        for(let k=0; k<ratingNumber[i].innerText; k++){
            ratingsTag[i].children[k].classList.add("fa-solid")
            ratingsTag[i].children[k].classList.remove("fa-regular")
        }
    }    
    
    }
    }    
}

showProducts(products)
addFunctionality(products)



let categories = []

products.forEach((value,index)=>{
    categories.push(value.category)
})

categories = categories.filter((value, index, arr)=> arr.indexOf(value)=== index)



const categoryTag = document.querySelector(".categories"),
categoryBtn = document.querySelector(".categorybtn"),
priceTag = document.querySelector(".prices"),
priceBtn = document.querySelector(".pricebtn"),
filterPrices = document.querySelectorAll(".prices div"),
resetBtn = document.querySelector(".resetBtn")


//filter by categories
categories.forEach((value,index)=>{
    if(categoryTag){
        categoryTag.innerHTML += `
        <div class="filterCategory">
            <input type="checkbox" name=${value} id="" class="">
            <label for="groceries" class="text-xl font-bold capitalize">${value}</label>
        </div>`
    }    
})

const filtercategory = document.querySelectorAll(".filterCategory")

if(categoryBtn){
    categoryBtn.addEventListener("click",()=>{
    let filterCategories = []
    let filteredProducts = []
    
    for(let i=0; i<filtercategory.length;i++){
        if(filtercategory[i].children[0].checked)
            filterCategories.push(filtercategory[i].children[1].innerText)
    }

    if(filterCategories.length > 0){
        filterCategories.forEach((value,index)=>{
            let filteredProduct = []
            filteredProduct = products.filter((product)=> product.category === value.toLowerCase())
            filteredProducts.push(...filteredProduct)
        })

        showProducts(filteredProducts)
        addFunctionality(filteredProducts)
    }
    })
}


//filter by prices
if(priceBtn){
    priceBtn.addEventListener("click",()=>{
        let filterPrice = []
        let filteredProducts = []
        for(let i=0; i<filterPrices.length; i++){
            if(filterPrices[i].children[0].checked)
                filterPrice.push(filterPrices[i].children[1].innerText)
        }
        filterPrice.forEach((value,index)=>{
            products.forEach((product,index)=>{
                if(product.price > value.split("-")[0] && product.price < value.split("-")[1])
                    filteredProducts.push(product)
            })
        })
        showProducts(filteredProducts)
        addFunctionality(filteredProducts)
    })
}



//reset filters
if(resetBtn){
    resetBtn.addEventListener("click",()=>{
        for(let i=0; i<filtercategory.length;i++){
            filtercategory[i].children[0].checked = false
        }

        for(let i=0; i<filterPrices.length; i++){
            filterPrices[i].children[0].checked = false
        }

        showProducts(products)
        addFunctionality(products)
    })
}


//storing products in local storage to access data in cart section after adding in cart

let cartProducts = localStorage.getItem("cartProducts")? JSON.parse(localStorage.getItem("cartProducts")) : []

const addToCartBtn = document.querySelectorAll(".addToCartBtn")
for(let i=0; i<addToCartBtn.length; i++){
    addToCartBtn[i].addEventListener("click",()=>{
        let name = (addToCartBtn[i].parentElement.firstChild.nextSibling.nextSibling.nextSibling.innerText)
        let cartProduct = (products.filter((product)=> product.title === name))
        cartProducts.push(...cartProduct)
        localStorage.setItem("cartProducts", JSON.stringify(cartProducts))
    })
}

//export add functionality
export {addFunctionality}