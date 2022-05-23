import { WEATHER_API_KEY } from "./config.js";

/* Sélection des éléments form, input et section depuis le DOM. */
let form = document.querySelector("form");
let inputCity = document.querySelector("#input_city");
let section = document.querySelector("#section_jour_a_venir");

/* En écoutant le formulaire et lorsque le formulaire est soumis, il réinitialisera la section,
empêchera l'action par défaut, obtiendra la valeur de l'entrée, puis récupérera la ville. */
form.addEventListener("submit", (event) => {
  reset();
  event.preventDefault();
  let city = inputCity.value;
  fetchCity(city);
});

/**
 * Il récupère les données météo de l'API OpenWeatherMap et les affiche sur la page
 * @param city - le nom de la ville
 * @returns le response.json() qui est la valeur de la réponse.
 */
const fetchCity = (city) => {
  let query = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&lang=fr&appid=${WEATHER_API_KEY}`;
  fetch(query)
    .then(function (response) {
      if (response.ok) {
        return response.json();
      }
    })
    .then(function (value) {
      let coord = value.city.coord;
      displayCity(value);
      fetchLocation(coord);
    })
    .catch(function (error) {
      console.log(error);
    });
};

/**
 * Il récupère les données météorologiques de l'API et les affiche sur la page.
 * @param coord - {
 * @returns La réponse est un objet JSON.
 */
const fetchLocation = (coord) => {
  let query = `http://api.openweathermap.org/data/2.5/forecast?lat=${coord.lat}&lon=${coord.lon}&lang=fr&units=metric&appid=${WEATHER_API_KEY}`;
  fetch(query)
    .then(function (response) {
      if (response.ok) {
        return response.json();
      }
    })
    .then(function (value) {
      let listDay = value.list;
      displayMeteo(listDay);
    })
    .catch(function (error) {
      console.log(error);
    });
};

/**
 * Il prend une valeur comme paramètre, puis il affiche la latitude et la longitude de la ville dans le
 * HTML.
 * @param value - la réponse de l'API
 */
const displayCity = (value) => {
  let latitude = value.city.coord.lat;
  let longitude = value.city.coord.lon;
  let spanLat = document.querySelector("#latitude");
  let spanLon = document.querySelector("#longitude");
  let h2Title = document.querySelector("#h2_title");
  spanLat.textContent = `La latitude de cette ville est ${latitude}`;
  spanLon.textContent = `La longitude de cette ville est ${longitude}`;
  h2Title.textContent = value.city.name;
};

/**
 * Il prend un tableau de tableaux et pousse chaque tableau dans un nouveau tableau.
 * @param listDay - [{
 */
const displayMeteo = (listDay) => {
  let listOfDay = [];
  listDay.forEach((list) => {
    listOfDay.push(list);
  });
  createObjectDay(listOfDay);
};

/**
 * Il prend un tableau d'objets, et pour chaque objet du tableau, il crée un nouvel objet avec
 * certaines des propriétés de l'objet d'origine, puis appelle une fonction pour créer un nouvel
 * élément dans le DOM.
 * @param listOfDay - un tableau d'objets
 */
const createObjectDay = (listOfDay) => {
  let meteo = [];
  listOfDay.forEach((day) => {
    console.log(day);
    meteo.push({
      id: day.dt,
      date: day.dt_txt,
      description: day.weather[0].description,
      icon: day.weather[0].icon,
      temperature: day.main.temp,
      min: day.main.temp_min,
      max: day.main.temp_max,
    });
  });
  for (let index = 0; index < listOfDay.length; index++) {
    createAreaDay(meteo[index]);
  }
};

/**
 * Il prend un objet meteo comme argument et renvoie une chaîne HTML qui est ensuite ajoutée à
 * l'élément section.
 * @param meteo - {
 */
const createAreaDay = (meteo) => {
  let area = `
    <div class="prevision" id=${meteo.id}>
    <p>Temps prévu : ${meteo.description}</p>
    <img src="http://openweathermap.org/img/w/${meteo.icon}.png">
    <p> le ${meteo.date} </p>
        <ul>
            <li> Température : ${meteo.temperature} °C</li>
            <li>Temparature minimum : ${meteo.min} °C</li>
            <li>Température maximum : ${meteo.max} °C</li>
        <ul>
    </div>`;
  section.innerHTML += area;
};

/**
 * Il réinitialise le innerHTML de l'élément de section sur une chaîne vide.
 */
const reset = () => {
  section.innerHTML = "";
};
