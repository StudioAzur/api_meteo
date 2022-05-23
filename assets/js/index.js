import { WEATHER_API_KEY } from "./config.js";

let display = document.querySelector("#display");
let h2Title = document.querySelector("#h2_title");
let inputCity = document.querySelector("#input_city");
let section = document.querySelector("#section_jour_a_venir");

// On initialise nos variables de location
let longitude;
let latitude;
let city = "";


/**
 * Il prend un tableau d'objets, crée une liste, puis parcourt le tableau et crée un élément de liste
 * pour chaque objet du tableau.
 * 
 * Le problème est que la fonction ne fonctionne pas comme prévu.
 * 
 * La fonction est censée créer un élément de liste pour chaque objet du tableau, mais elle ne crée
 * qu'un seul élément de liste.
 * 
 * L'élément de liste contient les valeurs du dernier objet du tableau.
 * 
 * J'ai essayé de déboguer la fonction, mais je n'arrive pas à comprendre ce qui ne va pas.
 * 
 * J'ai également essayé de réécrire la fonction, mais je n'arrive pas à la faire fonctionner.
 * 
 * J'apprécierais toute aide.
 * 
 * Merci d'avance.
 * @param listDayMeteo - [{…}, {…}, {…}, {…}, {…}, {…}, {…}]
 */
const displayMeteo = (listDayMeteo) => {
    let listePrevision = document.createElement("ul");
    section.appendChild(listePrevision);
    listDayMeteo.forEach((day) => {
        console.log(day);
        let divData = document.createElement("div");
        divData.setAttribute("class", "meteo");
        // On formate nos données en objet
        let meteo = {
            description: day.weather[0].description,
            icon: day.weather[0].icon,
            temperature: day.main.temp,
            min: day.main.temp_min,
            max: day.main.temp_max,
        };
       let keys = Object.keys(meteo);
       let values = Object.values(meteo);

        for (let i = 0; i < meteo.length; i++) {
            console.log(`${keys[i]} : ${values[i]}`);
            const liMeteo = document.createElement("li");
            liMeteo.setAttribute("id", `meteo${i}`);
            liMeteo.textContent = `${keys[i]} : ${values[i]}`;
            listePrevision.appendChild(liMeteo);
        }
    });
   
};

/**
 * Il prend la latitude et la longitude de la position de l'utilisateur, puis utilise l'API
 * OpenWeatherMap pour récupérer les données météorologiques pour cette position.
 *
 * La fonction est appelée de la manière suivante :
 * @param lat - latitude
 * @param long - longitude
 */
const fetchPosition = (lat, long) => {
    let queryPosition = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&lang=fr&units=metric&appid=${WEATHER_API_KEY}`;
    let dataPosition = async () => (await fetch(queryPosition)).json();
    dataPosition()
        .then((result) => {
            h2Title.innerHTML = result.city.name;
            let listDayMeteo = result.list;
            console.log(result.list);
            displayMeteo(listDayMeteo);
        })
        .catch((error) => {
            console.log(error);
        });
};

/**
 * Il prend une ville comme paramètre, crée une chaîne de requête, récupère la requête, puis enregistre
 * la réponse
 * @param city - Le nom de la ville
 */
const fetchCity = (city) => {
    let queryCity = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${WEATHER_API_KEY}`;
    let dataCity = async () => (await fetch(queryCity)).json();
    dataCity()
        .then((result) => {
            latitude = result[0].lat.toString();
            longitude = result[0].lon.toString();
            fetchPosition(latitude, longitude);
        })
        .catch((error) => {
            console.log(error);
        });
};

display.addEventListener("click", (e) => {
    e.preventDefault();
    city = inputCity.value;
    fetchCity(city);
});
