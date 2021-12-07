//Packages to be utilized
const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');

//using the packages 
const app = express();
app.use(bodyParser.urlencoded({
    extended: true
}));

//routes 
app.get("/", (req, res) => {

    res.sendFile(__dirname + "/index.html")
})

app.post("/", (req, res) => {

    //Build the url 
    const apiKey = "API_Key"
    const metric = "metric"
    const town = req.body.town;

    //  console.log(town)
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + town + "&appid=" + apiKey+"&units=metric";

    https.get(url, (response) => {

        response.on("data", (data) => {
            const weatherData = JSON.parse(data);
          //  console.log(weatherData);

                const town = weatherData.name; 
                const feels_like = weatherData.main.feels_like; 
                const temp = weatherData.main.temp; 
                const description = weatherData.weather[0].description; 
                const img = weatherData.weather[0].icon 
                const urlImage = "http://openweathermap.org/img/wn/"+img+"@2x.png"

                res.write(`<h1> The Weather in ${town} </h1>`)
                res.write(`<p> The Weather in ${town} </p>`)
                res.write(`<p> The Temperature is ${temp} degrees Celsius <br> Although it feels like ${feels_like} </p>`)
                res.write(`<p> It is ${description} </p>`)
                res.write(`<p>  <img src="${urlImage}" alt="Clouds"> </p>`)
                res.status(200).send(); 
        })
    })




})

app.listen(3002, () => {

    console.log("App is listening on port 3002")
})