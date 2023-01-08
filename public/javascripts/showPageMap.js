mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/light-v11",
  center: coffeeshop.geometry.coordinates,
  zoom: 15,
});

const marker = new mapboxgl.Marker()
  .setLngLat(coffeeshop.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(`<h6>${coffeeshop.title}</h6>`)
  )
  .addTo(map);

const nav = new mapboxgl.NavigationControl({
  visualizePitch: true,
});
map.addControl(nav, "bottom-right");
