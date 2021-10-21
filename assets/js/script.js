// GIVEN a weather dashboard with form inputs
// WHEN I search for a city
// THEN I am presented with current and future conditions for that city and that city is added to the search history
// WHEN I view current weather conditions for that city
// THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
// WHEN I view the UV index
// THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
// WHEN I view future weather conditions for that city
// THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city

//api key a38d9f511d30c352d92d46b549dfdcd9

// api.openweathermap.org/data/2.5/weather?q={city name},{state code}&appid={API key}

// Variables 

let contentEl = $("#contentContainer");
let searchBtnEl = $("#searchBtn");
let apiKey = "a38d9f511d30c352d92d46b549dfdcd9"
let city = $("#city")
let locBaseRequestUrl 
let completeURL 


// fetching the city API to get Lat/Lon Values
function fetchUserQuery(locBaseRequestUrl) {
    fetch(locBaseRequestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            console.log(data.name) // name
            console.log(data.main.temp) // temp
            console.log(data.main.humidity) // humidity
            console.log(data.coord.lat, data.coord.lon)
            let latlonURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${data.coord.lat}&lon=${data.coord.lon}&units=imperialappid=${apiKey}`
            completeURL = latlonURL
            fetchComplete ()
                
            }
        )
}

// fetching the complete data API now that I have the Lat/Lon values
function fetchComplete () {
    fetch(completeURL)
                    .then(function (response) {
                        return response.json()
                    })
                    .then(function (data) {
                            console.log(data);
                            console.log()
                    })
}

// Taking the data from user input
searchBtnEl.on("click", function() {
    console.log(city.val())
    // let city = city.val()
    // let state = state.val()
    let locBaseRequestUrl = `http://api.openweathermap.org/data/2.5/weather?q=${city.val()}&units=imperial&appid=${apiKey}`
    console.log(locBaseRequestUrl)

    fetchUserQuery(locBaseRequestUrl)
})

