window.onload = init

function init() {
  const Map = new ol.Map({
    view: new ol.View({
      center: [0, 0], // X,Y
      zoom: 2,
      rotation: 0.5
    }),
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM()
      })
    ],
    target: 'js-map',
    KeyboardEventTarget: document
  })

  const popupContainerElement = document.getElementById('popup-coordinates');
  const popup = new ol.Overlay({
    element: popupContainerElement
  });

  Map.addOverlay(popup);

  Map.on('click', function (evt) {
    // console.log(evt.coordinate);
    const clickedCoordinate = evt.coordinate;

    popup.setPosition(undefined);
    popup.setPosition(clickedCoordinate);
    popupContainerElement.innerHTML = clickedCoordinate
  });

  // adding Interactions
  const dragRotateInteraction = new ol.interaction.DragRotate({
    condition: ol.events.condition.altKeyOnly
  })
  Map.addInteraction(dragRotateInteraction);

  // adding Draw interaction
  const drawInteraction = new ol.interaction.Draw({
    type: 'Polygon'
  })
  Map.addInteraction(drawInteraction);

  drawInteraction.on('drawend', function (evt) {
    // console.log(evt)
    let parser = new ol.format.GeoJSON();
    let drawnFeatures = parser.writeFeatures([evt.feature]); //parser.writeFeaturesObject([evt.feature]);
    console.log(drawnFeatures);

    // Map.addLayer(drawnFeatures);
  })



}