// GIVEN a weather dashboard with form inputs
// WHEN I search for a city
// THEN I am presented with current and future conditions for that city and that city is added to the search history
// WHEN I view current weather conditions for that city
// THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature(x), the humidity(x), the wind speed (x), and the UV index (x)
// WHEN I view the UV index 
// THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe (will need to generate an if/else statement)
// WHEN I view future weather conditions for that city
// THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city

// UV index -- 1-2 (low) 3-5 (moderate) 6-7 (high) 8-10 (very high) 11+ (extreme)


// General Variables 

let contentEl = $("#five-day-container");
let searchBtnEl = $("#searchBtn");
let city = $("#city")
let apiKey = "a38d9f511d30c352d92d46b549dfdcd9"
let cityURL
let completeURL

// Current Day Variables
let currentTemp
let currentHumidity
let currentIcon
let currentWindSpeed
let currentUVI
let currentName
let currentDay = moment().format('MMMM Do YYYY')

// 5-day Forecast Arrays
let futureArray = [0, 1, 2, 3, 4, 5]
let futureDayArray = []
let futureTempArray = []
let futureIconArray = []
let futureWindSpeedArray = []
let futureHumidityArray = []

// 5-day Forecase Variables
let futureIcon
let futureTemp
let futureWindSpeed
let futureHumidity
let futureDay

// Local Storage Variables
let localStorageArray = []


// fetching the city API to get Lat/Lon Values and city name
function fetchUserQuery(cityUrl) {
    fetch(cityUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            contentEl.text("")
            $("#currentContainer").text("")
            currentName = data.name
            completeURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${data.coord.lat}&lon=${data.coord.lon}&exclude=minutely,hourly,alerts&units=imperial&appid=${apiKey}`
            fetchComplete()

        }
        )
}

// fetching the complete data API now that I have the Lat/Lon values
function fetchComplete() {
    fetch(completeURL)
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            // clear Arrays from previous search
            futureIconArray = []
            futureDayArray = []
            futureTempArray = []
            futureWindSpeedArray = []
            futureHumidityArray = []

            // Current Stats
            currentTemp = (data.current.temp)
            currentHumidity = (data.current.humidity)
            currentIcon = (data.current.weather[0].icon)
            currentWindSpeed = (data.current.wind_speed)
            currentUVI = (data.current.uvi)

            // Future Data Loop
            for (let i = 0; i < futureArray.length; i++) {
                futureIcon = (data.daily[i].weather[0].icon)
                futureTemp = (data.daily[i].temp.day)
                futureHumidity = (data.daily[i].humidity)
                futureWindSpeed = (data.daily[i].wind_speed)
                futureIconArray.push(futureIcon)
                futureTempArray.push(futureTemp)
                futureHumidityArray.push(futureHumidity)
                futureWindSpeedArray.push(futureWindSpeed)

            }

            // Future Day Loop
            for (let i = 1; i < futureArray.length; i++) {
                futureDay = moment().add([i], 'days').format("MMM Do YY")
                futureDayArray.push(futureDay)
                console.log()

            }
            console.log(futureDayArray)
            addContent()
        })
}

// add's content to the page after search
function addContent() {

    // current day's information container
    let currentHTML = `<div class="row" id="current-day-header">What can I expect today? Current Forecast</div><div class="container center-align">
<div class="row" id="current-city">${currentName}<h6>${currentDay}<h6></div>
<div class="container" id="current-flex">
    <div id="current-el"><h6>Tempurature</h6><p>${currentTemp}° F</p></div>
    <div id="current-icon"><img src="https://openweathermap.org/img/wn/${currentIcon}@2x.png"></div>
    <div id="current-el"><h6>Humidity</h6><p>${currentHumidity}%</p></div>
</div>
<div class="container" id="current-flex">
    <div class="col s6" id="current-el2"><h6>Wind Speed</h6><p>${currentWindSpeed} mph</p></div>
    <div class="col s6" id="current-el2"><h6>UV Index</h6><p>${currentUVI}</p><p><div class="uvicolor">Color Code</div></p></div>
</div>`

    $("#currentContainer").append(currentHTML)

    // five day forcast container
    


    for (let i = 0; i < futureArray.length-1; i++) {
        
        let fiveDayHTMLContent = `<div class="" id="five-day-el" name="day"><h6>${futureDayArray[i]}</h6><img src="https://openweathermap.org/img/wn/${futureIconArray[i]}@2x.png"><br/>Tempurature: ${futureTempArray[i]}°F<br/>Humidity: ${futureHumidityArray[i]}%<br/>Wind Speed: ${futureWindSpeedArray[i]}mph</div>`
        $("#five-day-container").append(fiveDayHTMLContent)

        }
    
        

    // for (let i = 0; i < futureIconArray.length; i++) {

    //     let icon = $("<p>")
    //     let iconHTML = `<img src="https://openweathermap.org/img/wn/${futureIconArray[i]}@2x.png" id="icons-el${[i]}">`
    //     icon.html(iconHTML)
    //     $("#five-day-el").append(icon)
    // } 
}

function newSearch() {
}

// Taking the data from user input
searchBtnEl.on("click", function () {
    console.log(city.val())
    cityURL = `https://api.openweathermap.org/data/2.5/weather?q=${city.val()}&units=imperial&appid=${apiKey}`

    //adding Search Item to Local Storage
    localStorageArray.push(city.val())
    localStorage.setItem("City", JSON.stringify(localStorageArray))

    //Starting the first fetch
    fetchUserQuery(cityURL)

})

