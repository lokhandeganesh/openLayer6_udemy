window.onload = init

function init() {


  const Map = new ol.Map({
    view: new ol.View({
      center: [15091875.539375868, -2890099.0297847847],
      zoom: 1,
      extent: [8700313.865909653, -9512187.262171041, 21430987.92760313, 2627132.214786]

    }),
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM(),
      })
    ],
    target: 'project-map'
  });

  // Australian Cities GeoJson
  // Vector Styling
  const aussieCitiesStyle = function (feature) {
    // console.log(feature.getKeys())
    let cityId = feature.get('ID').toString();

    const style = [
      new ol.style.Style({
        image: new ol.style.Circle({
          fill: new ol.style.Fill({
            color: [77, 219, 105, 0.6]
          }),
          stroke: new ol.style.Stroke({
            color: [6, 125, 34, 1],
            width: 2
          }),
          radius: 12
        }),
        text: new ol.style.Text({
          text: cityId,
          scale: 1.5,
          fill: new ol.style.Fill({
            color: [232, 26, 26, 1]
          }),
          stroke: new ol.style.Stroke({
            color: [232, 26, 26, 1],
            width: 0.3
          })
        })
      })
    ];

    return style
  };

  // Vector Styling for Selected Feature
  const selectedFeatureStyle = function (feature) {
    // console.log(feature.getKeys())
    let cityId = feature.get('ID').toString();

    const style = [
      new ol.style.Style({
        image: new ol.style.Circle({
          fill: new ol.style.Fill({
            color: [247, 26, 10, 0.5]
          }),
          stroke: new ol.style.Stroke({
            color: [6, 125, 34, 1],
            width: 2
          }),
          radius: 12
        }),
        text: new ol.style.Text({
          text: cityId,
          scale: 1.5,
          fill: new ol.style.Fill({
            color: [87, 9, 9, 1]
          }),
          stroke: new ol.style.Stroke({
            color: [87, 9, 9, 1],
            width: 0.5
          })
        })
      })
    ];

    return style
  };

  // Vector Layer
  const austCitiesLayer = new ol.layer.Vector({
    source: new ol.source.Vector({
      format: new ol.format.GeoJSON(),
      url: './assets/project-data/aust_cities.geojson'

    }),
    style: aussieCitiesStyle
  })

  Map.addLayer(austCitiesLayer);

  // Map Features click logic

  const navElements = document.querySelector('.column-navigation');
  const cityNameElement = document.getElementById('cityname');
  const cityImageElement = document.getElementById('cityimage');
  // using JQuery
  /*
  const navElements = $('.column-navigation');
  const cityNameElement = $('#cityname');
  const cityImageElement = $('#cityimage');
 */
  const mapView = Map.getView();

  Map.on('singleclick', function (evt) {
    Map.forEachFeatureAtPixel(evt.pixel, (feature, layer) => {
      // console.log(feature);

      // Accessing feature properties
      let featureCityName = feature.get('Cityname');
      let featureCityImage = feature.get('Cityimage');

      let navElement = navElements.children.namedItem(featureCityName);
      // let navElement = $(`#${featureCityName}`)

      mainLogic(feature, navElement, featureCityName, featureCityImage);
    })
  })



  // Function for logic
  function mainLogic(selFeature, clickedAnchorElement, featureCityName, featureCityImage) {
    // Re-assign active class to the clicked element
    let currentActiveStyledElement = document.querySelector(".active");
    // let currentActiveStyledElement = $(".active");

    currentActiveStyledElement.className = currentActiveStyledElement.className.replace('active', '');
    // currentActiveStyledElement.removeClass("active");

    clickedAnchorElement.className = 'active';
    // clickedAnchorElement.addClass('active');

    // Change view based on the feature
    let featureCoordinates = selFeature.get('geometry').getCoordinates();
    // console.log(featureCoordinates)
    mapView.animate({ center: featureCoordinates }, { zoom: 5 })

    // assigning default style to un-selected feature
    let aussieCitiesFeatures = austCitiesLayer.getSource().getFeatures();
    aussieCitiesFeatures.forEach((unSelFeature) => {
      unSelFeature.setStyle(aussieCitiesStyle);
    });
    // Styling Selected feature
    selFeature.setStyle(selectedFeatureStyle);

    // Changing title and image of for city    
    cityNameElement.innerHTML = `Name of the City: ${featureCityName}`;
    cityImageElement.src = `${IMAGE_PATH}/${featureCityImage}.jpg`;


  }
};