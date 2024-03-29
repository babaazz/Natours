export const displayMap = (locations) => {
  mapboxgl.accessToken =
    "pk.eyJ1IjoiYmFiYS1uYXN0eWMiLCJhIjoiY2xrcG43cHlwMDl0ajNncG5mem8zOHVreiJ9.aQNMeBNCf2yzg9hTBf6big";

  const map = new mapboxgl.Map({
    container: "map", // container ID
    style: "mapbox://styles/mapbox/streets-v12",
    scrollZoom: false,
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    //creating marker
    const el = document.createElement("div");
    el.className = "marker";

    //adding marker
    new mapboxgl.Marker({
      element: el,
      anchor: "bottom",
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    //Add Popup
    new mapboxgl.Popup({
      offset: 30,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    //extends map bounds to include current location
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100,
    },
  });
};
