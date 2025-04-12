import { addFunctionality } from "./products.js"


//get data from local storage
let cartProducts = JSON.parse(localStorage.getItem("cartProducts"))

const cartSection = document.querySelector(".cartSection")
const cartContainer = document.querySelector(".cartContainer"),
cartTotal = document.querySelector(".cartTotal")


// get total value of cart products
let total = 0

cartProducts.forEach((value,index)=>{
    total+= value.price
})




//function to show cart
function showCartProducts(product){
    
    if(cartContainer){
        cartContainer.innerHTML = []

    product.forEach((value,index)=>{
        cartContainer.innerHTML += `<div class="product border-4 border-yellow-300 rounded-3xl bg-white flex flex-col justify-center items-center p-4 ">
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
                <button class="removeCartBtn border-2 border-yellow-400 w-full rounded-lg my-2 px-2 py-3 text-xl font-bold hover:scale-105 cursor-pointer">Remove from Cart</button>                
                </div>                
                `
            })

        cartTotal.innerHTML = `<h1 class = "text-white mt-8 text-4xl font-bold tracking-widest">Total Cart Value : $${total.toFixed(2)}</h1>`
    }
    
}


//showing cart
if(cartSection){
    if(!cartProducts || cartProducts.length === 0){
        const emptyCart = document.querySelector(".emptyCart")
        emptyCart.innerHTML =`<h1 class="text-white text-7xl font-bold tracking-widest">Your Cart is Empty</h1>`
    }    
    else{
        showCartProducts(cartProducts)
        addFunctionality(cartProducts)
}    
}


//remove products from cart
const removeCartBtn = document.querySelectorAll(".removeCartBtn")

for(let i=0; i<removeCartBtn.length; i++){
    removeCartBtn[i].addEventListener("click",()=>{
        cartProducts.splice(i,1)
        localStorage.setItem("cartProducts",JSON.stringify(cartProducts))
        showCartProducts(cartProducts)
        addFunctionality(cartProducts)
        location.reload()
        console.log(removeCartBtn)
    })
}

