window.onload = init

function init() {
  const austrCenterCoordinates = [15091875.539375868, -2890099.0297847847];
  const initZoom = 1;

  const Map = new ol.Map({
    view: new ol.View({
      center: austrCenterCoordinates,
      zoom: initZoom,
      extent: [8700313.865909653, -9512187.262171041, 21430987.92760313, 2627132.214786]

    }),
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM(),
      })
    ],
    target: 'project-map'
  });

  const mapView = Map.getView();

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

  //To bind the event 
  Map.on('singleclick', function (evt) {
    // Checking if feature is present then get information of it
    let isFeatureAtPixel = Map.hasFeatureAtPixel(evt.pixel);

    if (isFeatureAtPixel) {
      Map.forEachFeatureAtPixel(evt.pixel, (feature, layer) => {
        // Accessing feature properties
        let featureCityName = feature.get('Cityname');
        let featureCityImage = feature.get('Cityimage');

        let navElement = navElements.children.namedItem(featureCityName);
        // let navElement = $(`#${featureCityName}`)
        mainLogic(feature, navElement);
      })

    }
    // No feature is present on map click then go to Home Navigation.
    else {
      let navHomeElement = $('#Home')[0]
      mainLogic(undefined, navHomeElement);
    }



  })

  // Function for logic
  function mainLogic(selFeature, clickedAnchorElement) {
    // Re-assign active class to the clicked element
    let currentActiveStyledElement = document.querySelector(".active");
    // let currentActiveStyledElement = $(".active");

    currentActiveStyledElement.className = currentActiveStyledElement.className.replace('active', '');
    // currentActiveStyledElement.removeClass("active");

    clickedAnchorElement.className = 'active';
    // clickedAnchorElement.addClass('active');

    // Default Style for features    
    // assigning default style to un-selected feature
    let aussieCitiesFeatures = austCitiesLayer.getSource().getFeatures();
    aussieCitiesFeatures.forEach((unSelFeature) => {
      unSelFeature.setStyle(aussieCitiesStyle);
    });

    // Home Element : Change content in the menu to Home
    if (clickedAnchorElement.id === 'Home') {
      // Animate to Home
      mapView.animate({ center: austrCenterCoordinates }, { zoom: initZoom })

      // Changing title and image of for city    
      cityNameElement.innerHTML = $('#cityname').data("original-value");
      cityImageElement.src = $('#cityimage').data("original-value");
    }
    // Change view, and content in the menu based on the feature
    else {
      // Styling Selected feature
      selFeature.setStyle(selectedFeatureStyle);
      // Change view based on the feature
      let featureCoordinates = selFeature.get('geometry').getCoordinates();
      // console.log(featureCoordinates)
      // Animate to feature
      mapView.animate({ center: featureCoordinates }, { zoom: 5 })
      // Accessing feature properties
      let featureCityName = selFeature.get('Cityname');
      let featureCityImage = selFeature.get('Cityimage');

      // Changing title and image of for city    
      cityNameElement.innerHTML = `Name of the City: ${featureCityName}`;
      cityImageElement.src = `${IMAGE_PATH}/${featureCityImage}.jpg`;
    };


  };

  // Navigation Button Logic
  const anchorNavElements = document.querySelectorAll('.column-navigation > a');
  for (let anchorNavElement of anchorNavElements) {
    anchorNavElement.addEventListener('click', (evt) => {

      let clickedAnchorElement = evt.currentTarget;
      let clickedAnchorElementId = clickedAnchorElement.id;

      let aussieCitiesFeatures = austCitiesLayer.getSource().getFeatures();

      aussieCitiesFeatures.forEach((feature) => {
        // console.log(feature);
        let featureCityName = feature.get('Cityname');
        let featureCityImage = feature.get('Cityimage');

        if (clickedAnchorElementId === featureCityName) {
          mainLogic(feature, clickedAnchorElement);
        }
      });

      // Home Navigation Case
      if (clickedAnchorElementId === 'Home') {
        mainLogic(undefined, clickedAnchorElement);

      }
    });
  };

  // Feature :hover logic
  const popoverTextElement = $('#popover-text').get(0)  //document.getElementById('popover-text');
  const popoverTextLayer = new ol.Overlay({
    element: popoverTextElement,
    positioning: 'bottom-center',
    stopEvent: false
  });

  Map.addOverlay(popoverTextLayer);

  // Changing style
  Map.on('pointermove', (evt) => {
    let isFeatureAtPixel = Map.hasFeatureAtPixel(evt.pixel);
    if (isFeatureAtPixel) {
      let featureAtPixel = Map.getFeaturesAtPixel(evt.pixel);
      let featureName = featureAtPixel[0].get('Cityname');
      popoverTextLayer.setPosition(evt.coordinate);
      popoverTextElement.innerHTML = featureName;
      // Map.getViewport().style.cursor = 'pointer';
    } else {
      popoverTextLayer.setPosition(undefined);
      // Map.getViewport().style.cursor = '';
    };

    // Changing cursor style for feature to 'pointer'
    let viewPortStyle = Map.getViewport().style
    isFeatureAtPixel ? viewPortStyle.cursor = 'pointer' : viewPortStyle.cursor = ''

  });


};