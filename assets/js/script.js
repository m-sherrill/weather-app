// General Variables 
let city = $("#city")
let apiKey = "a38d9f511d30c352d92d46b549dfdcd9"
let cityURL
let completeURL
let currentDay = moment().format('MMMM Do YYYY')
let futureArray = [0, 1, 2, 3, 4, 5]

localStorageArray = JSON.parse(localStorage.getItem("City")) || []

// fetching the city API to get Lat/Lon Values and city name
function fetchUserQuery(cityUrl) {
    fetch(cityUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            $("#five-day-container").text("")
            $("#currentContainer").text("")
            currentName = data.name
            completeURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${data.coord.lat}&lon=${data.coord.lon}&exclude=minutely,hourly,alerts&units=imperial&appid=${apiKey}`
            fetchComplete()
        })
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
            currentTemp = Math.round((data.current.temp))
            currentHumidity = Math.round((data.current.humidity))
            currentIcon = (data.current.weather[0].icon)
            currentWindSpeed = Math.round((data.current.wind_speed))
            currentUVI = (data.current.uvi)

            // Future Data Loop
            for (let i = 0; i < futureArray.length; i++) {
                futureIcon = (data.daily[i].weather[0].icon)
                futureTemp = Math.round((data.daily[i].temp.day))
                futureHumidity = Math.round((data.daily[i].humidity))
                futureWindSpeed = Math.round((data.daily[i].wind_speed))
                futureIconArray.push(futureIcon)
                futureTempArray.push(futureTemp)
                futureHumidityArray.push(futureHumidity)
                futureWindSpeedArray.push(futureWindSpeed)
            }

            // Future Day Loop
            for (let i = 1; i < futureArray.length; i++) {
                futureDay = moment().add([i], 'days').format("MMM Do YYYY")
                futureDayArray.push(futureDay)
            }
            addContent()
        })
}

// add's content to the page after search
function addContent() {

    // current day's information container
    let currentHTML = `<div class="row" id="current-day-header">What can I expect today? <b>Current Forecast</b></div>
    <div class="container center-align">
    <div class="row" id="current-city">${currentName}<h6>${currentDay}<h6></div>
    <div class="container" id="current-flex">
        <div id="current-el"><h6>Temperature</h6><p>${currentTemp}° F</p></div>
        <div id="current-icon"><img src="https://openweathermap.org/img/wn/${currentIcon}@2x.png"></div>
        <div id="current-el"><h6>Humidity</h6><p>${currentHumidity}%</p></div>
    </div>
    <div class="container" id="current-flex">
        <div class="col s6" id="current-el2"><h6>Wind Speed</h6><p>${currentWindSpeed} mph</p><img src="assets/images/wind.png"></div>
        <div class="col s6" id="current-el2"><h6>UV Index</h6><p>${currentUVI}</p><p><div class="uvicolor">Color Code</div></p></div>
    </div>`

    $("#currentContainer").append(currentHTML)

    // five day forcast container
    for (let i = 0; i < futureArray.length - 1; i++) {
        let fiveDayHTMLContent = `<div class="" id="five-day-el" name="day"><h6>${futureDayArray[i]}</h6><img src="https://openweathermap.org/img/wn/${futureIconArray[i]}@2x.png"><br/><b>Temperature:</b> ${futureTempArray[i]}° F<br/><b>Humidity:</b> ${futureHumidityArray[i]}%<br/><b>Wind Speed:</b> ${futureWindSpeedArray[i]} mph</div>`

        $("#five-day-container").append(fiveDayHTMLContent)
    }
    // Color coding of the UV Index
    if (currentUVI <= 2) {
        $(".uvicolor").attr("style", "background-color: green;").text("Low")
    } else if (3 <= currentUVI <= 5) {
        $(".uvicolor").attr("style", "background-color: yellow;").text("Moderate")
    } else if (6 <= currentUVI <= 7) {
        $(".uvicolor").attr("style", "background-color: orange;").text("High")
    } else if (8 <= currentUVI <= 10) {
        $(".uvicolor").attr("style", "background-color: red;").text("High")
    } else if (11 <= currentUVI) {
        $(".uvicolor").attr("style", "background-color: violet;").text("High")
    }
}

// Taking the data from user input
$("#searchBtn").on("click", function () {

    cityURL = `https://api.openweathermap.org/data/2.5/weather?q=${city.val()}&units=imperial&appid=${apiKey}`

    $("#five-day-header").css("display", "block")
    //adding Search Item to Local Storage
    localStorageArray.push(city.val())
    localStorage.setItem("City", JSON.stringify(localStorageArray))

    //adding the newest searched city to the list of buttons
    let pTag = $("<p>")
    let savedBtn = $("<button>")
    savedBtn.attr("id", "saved-btn").attr("class", "btn waves-effect waves indigo lighten-4").attr("name", city.val()).html(city.val())
    pTag.append(savedBtn)
    $("#local-storage-history").prepend(pTag)

    //Starting the first fetch
    fetchUserQuery(cityURL)

    city.val("")
})


// populates the page on load with what is in local storage
function localStorageSave() {
    let savedCities = JSON.parse(localStorage.getItem("City")) || []

    for (let i = 0; i < savedCities.length; i++) {
        let pTag = $("<p>")
        let savedBtn = $("<button>")
        savedBtn.attr("id", "saved-btn").attr("class", "btn waves-effect indigo lighten-4").attr("name", savedCities[i]).html(savedCities[i])
        pTag.append(savedBtn)
        $("#local-storage-history").prepend(pTag)
    }
}

// Renders what is saved in local storage to the page when your load
localStorageSave()

// Searches from the buttons selected from the search history
$(document).on("click", "#saved-btn", function () {
    cityURL = `https://api.openweathermap.org/data/2.5/weather?q=${$(this).attr("name")}&units=imperial&appid=${apiKey}`
    $("#five-day-header").css("display", "block")
    fetchUserQuery(cityURL)
})

// Clears out the search history
$("#clear-storage-btn").on("click", function () {
    $("#local-storage-history").text("")
    localStorage.removeItem("City")
})

