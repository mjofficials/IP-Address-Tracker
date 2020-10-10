// getting elements from html document using DOM manipulation technique
const searchedItem = document.getElementById("inputSearch");
const form = document.getElementById("inputForm");

const ipAddress = document.querySelector(".ipAddress");
const locale = document.getElementById("location");
const timezone = document.getElementById("timezone");
const isp = document.getElementById("isp");


// hoisting variables
let initialResult;
let finalResult;
let data = '';
let API_MAP;

let locationIcon = L.icon({
    iconUrl: 'images/icon-location.svg',
});

// Storing users data in a "data" variable
searchedItem.addEventListener('input', (e) => {
    data = e.target.value;
});

// adding an event-listener to the form
form.addEventListener('submit', (e) => {
    e.preventDefault();
    initialSearch();
});

// fetching data from a url using asynchronous function
const fetchIp = async () => {
    const API_KEY = 'at_lrRdOQfyUqyjklo7iGcx27OX3590Q';

    initialResult = await fetch(`https://geo.ipify.org/api/v1?apiKey=${API_KEY}&ipAddress=${data}`)
        .then(response => response.json())
        .then(initialResult => {
            finalResult = initialResult;
            if (finalResult.code === 422) {
                alert("Not a valid IP Address")
                ipAddress.innerHTML = "";
                locale.innerHTML = "";
                timezone.innerHTML = "";
                isp.innerHTML = "";
                searchedItem.value = "";
            } else {

            };
        })
        .catch(error => {
            alert("Please try again.");
            console.log(error);
        })
};

// 
const onMap = (finalResult) => {
    if (API_MAP) {
        API_MAP.remove();
    };
    const lat = finalResult.location.lat;
    const long = finalResult.location.lng;

    API_MAP = L.map('mapid', {
        center: [(lat - 0.02), long],
        zoom: 11,
        zoomControl: false
    });
    L.marker([lat, long], { icon: locationIcon }).addTo(API_MAP);
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1IjoiY2hyaXMzMzk4MCIsImEiOiJja2Z5MjY0NWcwMmExMnZueXRlcHBneHdkIn0.g2f3VXQ-DfaFS2gAi2dysw'
    }).addTo(API_MAP);
}

const result = finalResult => {
    ipAddress.innerHTML = finalResult.ip;
    locale.innerHTML = `${finalResult.location.city}, ${finalResult.location.region}`;
    timezone.innerHTML = `UTC ${finalResult.location.timezone}`;
    isp.innerHTML = finalResult.isp;
}

const initialSearch = async () => {
    await fetchIp(data);
    result(finalResult);
    onMap(finalResult);
}

const init = (() => {
    initialSearch();
});
