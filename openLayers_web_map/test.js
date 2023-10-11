window.onload = init

function init(){
  const options = {
    // Required: API key
    key: 'nOvfHgPrO3TUSt90zdE9pFKnC7Gt8kjL', // REPLACE WITH YOUR KEY !!!
  
    // Put additional console output
    verbose: false,
  
    // Optional: Initial state of the map
    lat: 80.024,
    lon: 21.596,
    zoom: 5,
  };
  
  // Initialize Windy API
  windyInit(options, windyAPI => {
    // windyAPI is ready, and contain 'map', 'store',
    // 'picker' and other usefull stuff
  
    const { map } = windyAPI;
    // .map is instance of Leaflet map
  
    L.popup()
      .setLatLng([21.596, 80.024])
      .setContent('Hello World')
      .openOn(map);
  });
}
