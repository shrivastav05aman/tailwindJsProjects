const country = document.getElementById("country"),
state = document.getElementById("state"),
city = document.getElementById("city")


state.style.pointerEvents = "none"
city.style.pointerEvents = "none"
state.disabled = true
city.disabled = true

//storing data for country, states and cities
const data = {
    url: "https://api.countrystatecity.in/v1/countries",
    key: "NHhvOEcyWk50N2Vna3VFTE00bFp3MjFKR0ZEOUhkZlg4RTk1MlJlaA=="
}

let countries = [],
states = [],
cities = []

// function to fetch countries
const showCountries = ()=>{

    var headers = new Headers();
    headers.append("X-CSCAPI-KEY", data.key);

    var requestOptions = {
        method: 'GET',
        headers: headers,
        redirect: 'follow'
    };

    fetch(data.url, requestOptions)
    .then(response => response.json())
    .then(result => {
        result.forEach((value,index)=>{
            let option = document.createElement("option")
            option.innerText = value.name
            option.classList.add("text-lg")
            country.add(option)

            //storing countries and their iso names in countries array
            countries.push({
                cunt: value.name,
                iso : value.iso2
            })
        })
    })
    .catch(error => console.log('error', error));
}


country.addEventListener("change",showStates)

//function to fetch states
function showStates(){
    state.style.pointerEvents = "auto"
    state.disabled = false

    state.innerHTML = '<option>Choose State</option>'
    city.innerHTML = '<option>Choose City</option>'

    let iso = ""

    // access iso of selected country for states of country
    countries.forEach((value,index)=>{
        if(country.value === value.cunt)
            iso = value.iso
    })


    var headers = new Headers();
    headers.append("X-CSCAPI-KEY", data.key);

    var requestOptions = {
        method: 'GET',
        headers: headers,
        redirect: 'follow'
    };

    fetch(`${data.url}/${iso}/states`, requestOptions)
    .then(response => response.json())
    .then(result =>{

        result.forEach((value,index)=>{
            let option = document.createElement("option")
            option.innerText = value.name
            option.classList.add("text-lg")
            state.add(option)

            //storing states and their iso in states array
            states.push({
                st: value.name,
                iso : value.iso2
            })
        })        
    })
    .catch(error => console.log('error', error));
}


state.addEventListener("change",showCities)


//function to fetch cities
function showCities(){
    city.disabled = false
    city.style.pointerEvents = "auto"

    city.innerHTML = '<option>Choose City</option>'

    let iso = ""

    //get iso code of state to get cities of that state
    states.forEach((value,index)=>{
        if(state.value === value.st)
            iso = value.iso
    })

    let countryiso = ""

    countries.forEach((value,index)=>{
        if(country.value === value.cunt)
            countryiso = value.iso
    })

    var headers = new Headers();
    headers.append("X-CSCAPI-KEY", data.key);

    var requestOptions = {
        method: 'GET',
        headers: headers,
        redirect: 'follow'
    };

    fetch(`${data.url}/${countryiso}/states/${iso}/cities`, requestOptions)
    .then(response => response.json())
    .then(result => {
        result.forEach((value,index)=>{
            let option = document.createElement("option")
            option.innerText = value.name
            option.classList.add("text-lg")
            city.add(option)

            //storing cities and their coordinates in cities array
            cities.push({
                cit: value.name,                
                lat: value.latitude,
                long: value.longitude
            })
        })
    })
    .catch(error => console.log('error', error));
}

let zone = ''
let timeByCountry = '',
selectedCountry = '',
selectedState = '',
selectedCity = ''


//function to access time through longitude and latitude 
async function getTimeByTimezone(){
    let long = '',
    lat = ''

    cities.forEach((value,index)=>{
    if(city.value === value.cit)
        long = value.long
        lat = value.lat
    })

    let timeZoneurl = `https://api.wheretheiss.at/v1/coordinates/${lat},${long}`


    const response = await fetch(timeZoneurl)
    const data = await response.json()
    timeByCountry = (new Date().toLocaleString("en-US",{
        timeZone : data.timezone_id
    }))

    //storing time data for dom manipulation
    hrs = new Date(timeByCountry).getHours()
    mins = new Date(timeByCountry).getMinutes()
    secs = new Date(timeByCountry).getSeconds()
    exactDay = new Date(timeByCountry).getDay()

    console.log(timeByCountry)

    selectedCountry = country.value
    selectedState = state.value
    selectedCity = city.value
}

city.addEventListener("change",getTimeByTimezone)


showCountries()


let time = new Date()
let hrs = time.getHours()
let mins = time.getMinutes()
let secs = time.getSeconds(),
exactDay = time.getDay()

const hour = document.querySelector(".hour"),
min = document.querySelector(".min"),
sec = document.querySelector(".sec")


//function to get name of day
function getDayName(n){
    switch(n){
        case 0:
            return "Sunday";
        case 1:
            return "Monday";
        case 2:
            return "Tuesday";
        case 3:
            return "Wednesday";
        case 4:
            return "Thursday";
        case 5:
            return "Friday";
        case 6:
            return "Saturday";
        default:
            return "Unknown Day"
    }
}

//set interval for time clock
setInterval(() => {

    if(secs < 59)
        secs++
    else if(mins >=59){
        hrs++
        mins = 0
    }else{
        secs = 0
        mins++
    }

    let exactHrs = String(hrs).padStart(2,"0")
    let exactMins = String(mins).padStart(2,"0")
    let exactSecs = String(secs).padStart(2,"0")

    const exactTimeElem = document.querySelector(".exacttime")    
    let exactTime = `${exactHrs}:${exactMins}:${exactSecs}`
    

    if(selectedCity && selectedCountry && selectedState){
        exactTimeElem.innerHTML = `<p class="text-xl font-bold tracking-wider">${getDayName(exactDay)}, <span>${exactTime}</span></p>
        <p class="text-xl font-bold tracking-wider">${selectedCountry}, ${selectedState}, ${selectedCity}</p>`
    }else{
        exactTimeElem.innerHTML = `<p class="text-xl font-bold tracking-wider">${getDayName(exactDay)}, <span>${exactTime}</span></p>
        <p class="text-xl font-bold tracking-wider">Delhi, Delhi, India</p>`
    }
    
    //rotating hands of clock based on time
    sec.style.rotate = `${(exactTime.split(":")[2]*6)-90}deg`
    min.style.rotate = `${(exactTime.split(":")[1]*6)-90}deg`
    hour.style.rotate = `${(exactTime.split(":")[0]*30)-90}deg`

},1000);