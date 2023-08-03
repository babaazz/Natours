const locations = JSON.parse(document.getElementById("map").dataset.locations);

mapboxgl.accessToken =
  "pk.eyJ1IjoiYmFiYS1uYXN0eWMiLCJhIjoiY2xrcG43cHlwMDl0ajNncG5mem8zOHVreiJ9.aQNMeBNCf2yzg9hTBf6big";
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/streets-v12", // style URL
  center: [-74.5, 40], // starting position [lng, lat]
  zoom: 9, // starting zoom
});
