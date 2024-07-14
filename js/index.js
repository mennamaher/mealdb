/// <reference types="../@types/jquery" />


let dataa = document.getElementById("dataa")
let searchDiv = document.getElementById("searchDiv")
let apiData = [];
let catData = []

$(document).ready(() => {
    getSearchByName("").then(() => {
        $(".loading-screen").fadeOut(500)
        $("body").css("overflow", "auto")
    });
})

$('.fa-xmark').on('click', function(){
    $('.inner-bar').hide(100)
    $('.side-bar').animate({left:"0%"})
    $('.fa-xmark').hide(1)
    $('.fa-bars').show(1)
})
$('.fa-bars').on('click', function(){
    $('.inner-bar').show(300)
    $('.side-bar').animate({left:"18%"})
    $('.fa-xmark').show(1)
    $('.fa-bars').hide(1)
    
})


////////////// get data
getData();
async function getData(){
    $(".inner-loading-screen").fadeIn(200)
    let Api = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=`);
    let apiData = await Api.json();
    console.log(apiData);
    displayData(apiData.meals)
    $(".inner-loading-screen").fadeOut(200)
}

function displayData(apiData){
    let data = ``;
    for(let i=0; i<apiData.length; i++){
        data += `     
        <div class=" col-lg-3 col-md-6 col-sm-12">
            <div class=" image rounded-3 position-relative p-1 z-0" onclick="getMealsById('${apiData[i].idMeal}')">
                    <img src="${apiData[i].strMealThumb}" alt="img" class=" w-100 rounded-3">
                <div class="layer bg-white opacity-75 position-absolute rounded-3 d-flex flex-column justify-content-center">
                    <h3>${apiData[i].strMeal}</h3>
                </div>
            </div> 
            </div>    `
    }
    dataa.innerHTML= data;
}


////// details

async function getMealsById(idMeal){
    $(".inner-loading-screen").fadeIn(200)
    let api = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`);
    let ID = await api.json()
    displayDetail(ID)
    $(".inner-loading-screen").fadeOut(200)
    // console.log(idMeal, 'id');
    $('.inner-bar').hide(100)
    $('.side-bar').animate({left:"0%"})
}

function displayDetail(ID){
    let tags = ID.meals[0].strTags;
    let resultTags = ``;
    if (tags != null) {
        let arrTags = tags.split(',');
        for (let i = 0; i < arrTags.length; i++)
            resultTags += ` <li class=" p-1 alert alert-secondary list-unstyled">${arrTags[i]}</li>
`
    }

let resReci=``;
let ingArr=[]; let unitArr=[]; let reciArr=[];
for(let i=1; i<=20; i++){
    const ingredient = `strIngredient${i}`;
    const measure = `strMeasure${i}`;
    const ingredients = ID.meals[0][ingredient];
        const measures = ID.meals[0][measure];
        if (ingredients !== "" && ingredients !== null) {
            console.log(measures, ' ', ingredients, ' ', i);
            ingArr.push(ingredients);
            unitArr.push(measures);
        }
}
for (let i = 0; i < unitArr.length; i++) {
    const measuresArray = unitArr[i];
    const ingredientsArray = ingArr[i];
    reciArr.push(`${measuresArray} ${ingredientsArray}`);
    resReci += `<li class=" m-2 p-1 alert alert-secondary">${reciArr[i]}</li>`
}

let res=`
        <div class=" col-md-4"> 
                <img src="${ID.meals[0].strMealThumb}" class=" w-100 rounded-3" alt="kk">
                <h3 class=" text-white">${ID.meals[0].strMeal}</h3>
            </div>
            <div class=" col-md-8 text-white">
                <h3 class=" fw-bold">Instructions</h3>
                <p>${ID.meals[0].strInstructions}</p>
                <h3 class=" fw-bold">Area: ${ID.meals[0].strArea}</h3>
                <h3 class=" fw-bold">category:  ${ID.meals[0].strCategory}</h3>
                <div class="">
                    <h3 class=" fw-bold">Recipe</h3>
                    <ul class="d-flex flex-wrap gap-2 list-unstyled  ">
                        ${resReci}
                    </ul>
                </div>
                <div class="">
                    <h3 class=" fw-bold">Tags: ${resultTags}</h3>
                    <ul class="d-flex flex-wrap gap-2 list-unstyled ">
                    </ul>
                </div>
                <button class=" btn b1 bg-success btn-success  border border-0 rounded-3 p-2"><a href="${ID.meals[0].strSource}">source</a></button>
                <button class=" btn b2 bg-danger btn-success  border border-0 rounded-3 p-2"><a href="${ID.meals[0].strYoutube}">youtube</a></button>
            </div>
`

dataa.innerHTML = res
}




//////  categories

async function getCategory(){
    $(".inner-loading-screen").fadeIn(200)
    let api = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`)
    let catData =await api.json()
    displayCategory(catData.categories)
    $(".inner-loading-screen").fadeOut(200)
    $('.inner-bar').hide(100)
    $('.side-bar').animate({left:"0%"})
}

function displayCategory(catData){
    let res =``;
    for(let i=0; i< catData.length; i++){
        res += `
            <div class=" col-lg-3 col-md-6 col-sm-12 ">
                <div class=" image rounded-3 position-relative p-1" onclick="catDetails('${catData[i].strCategory}')">
                    <img src="${catData[i].strCategoryThumb}" alt="img" class=" w-100 rounded-3">
                <div class="layer bg-white opacity-75 position-absolute top-0 start-0 p-2 rounded-3 d-flex flex-column justify-content-center">
                    <h3>${catData[i].strCategory}</h3>
                    <p>${catData[i].strCategoryDescription}</p>
                </div></div>
            </div>
        `
    }
    dataa.innerHTML= res;
}
async function catDetails(categoryName) {
    $(".inner-loading-screen").fadeIn(200)
    let api = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoryName.trim()}`);
    let details = await api.json();
    details = details.meals.slice(0, 20);
    displayData(details);
    $(".inner-loading-screen").fadeOut(200)
    $('.inner-bar').hide(100)
    $('.side-bar').animate({left:"0%"})
}


/////    Area

async function getArea(){
    $(".inner-loading-screen").fadeIn(200)
    let api = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`)
    let areaData = await api.json()
    displayArea(areaData.meals)
    $(".inner-loading-screen").fadeOut(200)
    $('.inner-bar').hide(100)
    $('.side-bar').animate({left:"0%"})
}

function displayArea(areaData){
    let res =``
    for(let i=0; i<areaData.length; i++){
        res += `
            <div class=" col-lg-3 col-md-6 col-sm-12 rounded-3 p-1" onclick="areaDetail('${areaData[i].strArea}')">
                <div class=" text-white p-2 rounded-3 d-flex flex-column justify-content-center">
                    <i class="fa-solid fa-house-laptop fs-1 text-center"></i>
                    <h3 class=" text-center">${areaData[i].strArea}</h3>
                </div>
            </div>
        `
    }
    dataa.innerHTML = res

}
async function areaDetail(areaName) {
    $(".inner-loading-screen").fadeIn(200)
    let api = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${areaName}`);
    let details = await api.json();
    details = details.meals.slice(0, 20);
    displayData(details);
    $(".inner-loading-screen").fadeOut(200)
    $('.inner-bar').hide(100)
    $('.side-bar').animate({left:"0%"})
}


//// Ingredients

async function getIngredient(){
    $(".inner-loading-screen").fadeIn(200)
    let api = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`)
    let IngData = await api.json()
    IngData = IngData.meals.slice(0,20)
    displayIngr(IngData)
    $(".inner-loading-screen").fadeOut(200)
    $('.inner-bar').hide(100)
    $('.side-bar').animate({left:"0%"})
}

function displayIngr(IngData){
    let res = ``
    for(let i=0; i<IngData.length; i++){
        res +=`
        
            <div class=" col-lg-3 col-md-6 col-sm-12 rounded-3 p-1 " onclick="ingredDetail('${IngData[i].strIngredient}')">
                <div class=" text-white p-2 rounded-3 d-flex flex-column justify-content-center ">
                    <i class="fa-solid fa-drumstick-bite fs-1 text-center"></i>
                    <h3 class=" text-center">${IngData[i].strIngredient}</h3>
                    <p class=" text-center">${IngData[i].strDescription.slice(0,120)}</p>
                </div>
            </div>
        `
    }
    dataa.innerHTML = res;
}

async function ingredDetail(ingredientName) {
    $(".inner-loading-screen").fadeIn(300)
    let filterByIngredientsAPI = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredientName}`);
    let filterByIngredientsList = await filterByIngredientsAPI.json();
    filterByIngredientsList = filterByIngredientsList.meals.slice(0, 20);
    displayData(filterByIngredientsList);
    $(".inner-loading-screen").fadeOut(300)
}





////    search

function displaySearch(){
    let searchIn = `
            <div class="row py-5">
                <div class=" col-md-6 ">
                <input onkeyup="getSearchByName(this.value)" type="text" class=" form-control  text-white bg-transparent" placeholder=" search by Name ">
            </div>
            <div class="  col-md-6 ">
                <input onkeyup="getSearchByFirstLetter(this.value)" maxlength="1" type="text" class=" form-control  text-white bg-transparent" placeholder=" search by First Letter ">
            </div>
            </div>
    `
    $('.inner-bar').hide(100)
    $('.side-bar').animate({left:"0%"})
searchDiv.innerHTML=searchIn;
dataa.innerHTML=``;
}
async function getSearchByName(searchQuery) {
    $(".inner-loading-screen").fadeIn(200)
    // $('.inner-bar').hide(100)
    // $('.side-bar').animate({left:"0%"})
    let searchByNameAPI = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchQuery}`);
    let searchByNameList = await searchByNameAPI.json();
    displaySearchByName_FirstLetter(searchByNameList);
}

async function getSearchByFirstLetter(searchQuery) {
    $(".inner-loading-screen").fadeIn(200)
    // $('.inner-bar').hide(100)
    // $('.side-bar').animate({left:"0%"})
    let searchByFirstLetterAPI = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchQuery}`);
    let searchByFirstLetterList = await searchByFirstLetterAPI.json();
    displaySearchByName_FirstLetter(searchByFirstLetterList);
}
function displaySearchByName_FirstLetter(searchQuery) {
    if (searchQuery.meals != null)
        displayData(searchQuery.meals);
        $(".inner-loading-screen").fadeOut(200)
        // $('.inner-bar').hide(100)
        // $('.side-bar').animate({left:"0%"})
}




////// Contact

function contactForm() {
    let result = `
    <div class="min-vh-100 w-75 mx-auto d-flex align-items-center justify-content-center">

                    <form action="#">
                        <div class="row g-4" id="">
                            <div class="col-md-6">
                                <input type="text" id="nameInput"  class="form-control "
                                    placeholder="Enter Your Name">
                                <p id="nameAlert" class="alert alert-danger w-100 mt-2 d-none text-center">
                                    Special characters and numbers not allowed
                                </p>
                            </div>
                            <div class="col-md-6">
                                <input type="email" id="emailInput" class="form-control "
                                    placeholder="Enter Your Email">
                                <p id="emailAlert" class="alert alert-danger w-100 mt-2 d-none text-center">
                                    Email not valid *exemple@yyy.zzz
                                </p>
                            </div>
                            <div class="col-md-6">
                                <input type="tel" id="phoneInput"  class="form-control "
                                    placeholder="Enter Your Phone">
                                <p id="phoneAlert" class="alert alert-danger w-100 mt-2 d-none text-center">
                                    Enter valid Phone Number
                                </p>
                            </div>
                            <div class="col-md-6">
                                <input type="number" id="ageInput"  class="form-control "
                                    placeholder="Enter Your Age" min="18" max="60">
                                <p id="ageAlert" class="alert alert-danger w-100 mt-2 d-none text-center">
                                    Enter valid age
                                </p>
    
                            </div>
                            <div class="col-md-6">
                                <input type="password" id="passInput"  class="form-control "
                                    placeholder="Enter Your Password">
                                <p id="passAlert" class="alert alert-danger w-100 mt-2 d-none text-center">
                                    Enter valid password *Minimum eight characters, at least one letter and one number:*
                                </p>
                            </div>
                            <div class="col-md-6">
                                <input type="password" id="repassInput"  class="form-control "
                                    placeholder="RePassword">
                                <p id="repassAlert" class="alert alert-danger w-100 mt-2 d-none text-center">
                                    Enter valid repassword
                                </p>
                            </div>
                            <div class="col text-center">
                                <button id="submitBtn" class="btn b3 btn-outline-danger bg-transparent cursor-pointer" >Submit</button>
                            </div>
                        </div>
                    </form>
                </div>   
    `
    dataa.innerHTML = result;
    $('.inner-bar').hide(100)
        $('.side-bar').animate({left:"0%"})
    const nameInput = document.getElementById('nameInput');
    const emailInput = document.getElementById('emailInput');
    const phoneInput = document.getElementById('phoneInput');
    const ageInput = document.getElementById('ageInput');
    const passInput = document.getElementById('passInput');
    const repassInput = document.getElementById('repassInput');
    const nameAlert = document.getElementById('nameAlert');
    const emailAlert = document.getElementById('emailAlert');
    const phoneAlert = document.getElementById('phoneAlert');
    const ageAlert = document.getElementById('ageAlert');
    const passAlert = document.getElementById('passAlert');
    const repassAlert = document.getElementById('repassAlert');

    nameInput.addEventListener('blur', () => {
        if (nameInput.value !== '' && nameRegexFunc(nameInput.value))
            nameAlert.classList.replace('d-block', 'd-none');
        else
            nameAlert.classList.replace('d-none', 'd-block');
        checkAllValidation();
    });
    nameInput.addEventListener('input', () => {
        if (nameInput.value !== '' && nameRegexFunc(nameInput.value))
            nameAlert.classList.replace('d-block', 'd-none');
        else
            nameAlert.classList.replace('d-none', 'd-block');
        checkAllValidation();
    });
    emailInput.addEventListener('blur', () => {
        if (emailInput.value.trim() !== '' && emailRegexFunc(emailInput.value))
            emailAlert.classList.replace('d-block', 'd-none');
        else
            emailAlert.classList.replace('d-none', 'd-block');
        checkAllValidation();
    });
    emailInput.addEventListener('input', () => {
        if (emailInput.value !== '' && emailRegexFunc(emailInput.value))
            emailAlert.classList.replace('d-block', 'd-none');
        else
            emailAlert.classList.replace('d-none', 'd-block');
        checkAllValidation();
    });
    phoneInput.addEventListener('blur', () => {
        if (phoneInput.value.trim() !== '' && phoneRegexFunc(phoneInput.value))
            phoneAlert.classList.replace('d-block', 'd-none');
        else
            phoneAlert.classList.replace('d-none', 'd-block');
        checkAllValidation();
    });
    phoneInput.addEventListener('input', () => {
        if (phoneInput.value !== '' && phoneRegexFunc(phoneInput.value))
            phoneAlert.classList.replace('d-block', 'd-none');
        else
            phoneAlert.classList.replace('d-none', 'd-block');
        checkAllValidation();
    });
    ageInput.addEventListener('blur', () => {
        if (ageInput.value !== '' && ageRegexFunc(ageInput.value))
            ageAlert.classList.replace('d-block', 'd-none');
        else
            ageAlert.classList.replace('d-none', 'd-block');
        checkAllValidation();
    });
    ageInput.addEventListener('input', () => {
        if (ageInput.value !== '' && ageRegexFunc(ageInput.value))
            ageAlert.classList.replace('d-block', 'd-none');
        else
            ageAlert.classList.replace('d-none', 'd-block');
        checkAllValidation();
    });
    passInput.addEventListener('blur', () => {
        if (passInput.value !== '' && passRegexFunc(passInput.value))
            passAlert.classList.replace('d-block', 'd-none');
        else
            passAlert.classList.replace('d-none', 'd-block');
        checkAllValidation();
    });
    passInput.addEventListener('input', () => {
        if (passInput.value !== '' && passRegexFunc(passInput.value))
            passAlert.classList.replace('d-block', 'd-none');
        else
            passAlert.classList.replace('d-none', 'd-block');
        checkAllValidation();
    });
    repassInput.addEventListener('blur', () => {
        if (repassInput.value !== '' && passRegexFunc(repassInput.value) && repassInput.value === passInput.value)
            repassAlert.classList.replace('d-block', 'd-none');
        else
            repassAlert.classList.replace('d-none', 'd-block');
        checkAllValidation();
    });
    repassInput.addEventListener('input', () => {
        if (repassInput.value !== '' && passRegexFunc(repassInput.value) && repassInput.value === passInput.value)
            repassAlert.classList.replace('d-block', 'd-none');
        else
            repassAlert.classList.replace('d-none', 'd-block');
        checkAllValidation();
    });
}

function emailRegexFunc(value) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(value);
}

function nameRegexFunc(value) {
    const nameRegex = /^[A-Za-z]+$/;
    return nameRegex.test(value);
}

function phoneRegexFunc(value) {
    const phoneRegex = /^(\d{10}|\d{11})$/;
    return phoneRegex.test(value);
}

function ageRegexFunc(value) {
    const ageRegex = /^(1[8-9]|[2-5][0-9]|60)$/;
    return ageRegex.test(value);
}
function passRegexFunc(value) {
    const passRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passRegex.test(value);
}
function checkAllValidation() {
    const submitBtn = document.getElementById('submitBtn');
    if (nameRegexFunc(nameInput.value) && emailRegexFunc(emailInput.value) && phoneRegexFunc(phoneInput.value) && ageRegexFunc(ageInput.value) && passRegexFunc(passInput.value) && passRegexFunc(repassInput.value) && repassInput.value === passInput.value) {
        submitBtn.removeAttribute('disabled');
    }
    else {
        submitBtn.setAttribute('disabled', '');
    }
}