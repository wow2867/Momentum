async function setBackground() {
    const body = document.querySelector("body");

    const result = await axios.get("https://picsum.photos/1920/1080", {
        responseType : "blob"
    });
    const data = URL.createObjectURL(result.data);

    body.style.backgroundImage = `url(${data})`;
}

// --------------------------------------------------------------------
// Weather
function getPosition(options) {
    return new Promise(function(resolve, reject) {
        navigator.geolocation.getCurrentPosition(resolve, reject, options);
    });
}

async function getWeather(lat, lon) {
    if(lat && lon) {
        const data = await axios.get(`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=dcbb04233592f1b2083e6d75ed0a47f2`)
        return data;
    }
}

function matchIcon(weatherData) {
    if(weatherData === "Clear") return "./../images/039-sun.png"
    else if(weatherData === "Clouds") return "./../images/001-cloud.png"
    else if(weatherData === "Rain") return "./../images/003-rainy.png"
    else if(weatherData === "Snow") return "./../images/006-snowy.png"
    else if(weatherData === "Thunderstorm") return "./../images/008-storm.png"
    else if(weatherData === "Drizzle") return "./../images/031-snowflake.png"
    else if(weatherData === "Atomsphere") return "./../images/033-hurricane.png"
    else return "./../images/location.png"
}

function weatherWrapperComponent(e) {
    const changeToCelsius = (temp) => (temp - 273.15).toFixed(1);
    
    return `
        <div class="card text-black" style="width: 18rem;">
            <div class = "card-header text-center ">
                ${e.dt_txt.split(" ")[0]}
            </div>
            <div class = "card-body">
                <h5>${e.weather[0].main}</h5>
                <img src="${matchIcon(e.weather[0].main)}" class="card-img-top" alt="...">
                <p class="card-text text-center">${changeToCelsius(e.main.temp)}</p>
            </div>
        </div>
    `
}

function setModalBtn(e) {
    const modal_icon = document.querySelector(".modal_btn");
    modal_icon.style.backgroundImage = `url(${matchIcon(e[0].weather[0].main)})`
}

async function renderWeather() {
    let latitude = "";
    let longitude = "";

    try {
        const position = await getPosition();
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
    } catch {
        
    }

    const result = await getWeather(latitude, longitude);
    const weatherData = result.data;
    
    const weatherList = weatherData.list.reduce((acc, cur) => {
        if(cur.dt_txt.indexOf("18:00:00") > 0){
            acc.push(cur);
        }
        return acc;
    }, [])

    setModalBtn(weatherList);

    const modalBody = document.querySelector(".modal-body");
    modalBody.innerHTML = weatherList.map((e) => {
        return weatherWrapperComponent(e);
    })
}

// --------------------------------------------------------------------
// Time
function setTime() {
    const timer = document.querySelector(".timer");
    const timer_txt = document.querySelector(".timer_txt");

    setInterval(() => {
        const date = new Date();
        const hour = String(date.getHours()).padStart(2, "0");
        const min = String(date.getMinutes()).padStart(2, "0");
        const sec = String(date.getSeconds()).padStart(2, "0");

        timer.textContent = `${hour}:${min}:${sec}`;

        let txt = "";
        if(hour >= 12) {
            txt = "Evening";
        }
        else {
            txt = "Morning";
        }

        timer_txt.textContent = `Good ${txt}, Hong!`
    }, 1000);
}

// --------------------------------------------------------------------
// toDo
function getToDo() {
    const toDo = document.querySelector(".toDo");
    const toDoValue = localStorage.getItem("todo")
    toDo.textContent = toDoValue;
}

function setToDo() {
    const toDoInput = document.querySelector(".toDo_input");
    toDoInput.addEventListener("keyup", function(e) {
        if(e.code === "Enter" && e.currentTarget.value) {
            localStorage.setItem("todo", e.currentTarget.value);
            getToDo();
            toDoInput.value = "";
        }
    })
}

setBackground();
setInterval(() => {
    setBackground();
}, 10000);

renderWeather();

setTime();

setToDo();