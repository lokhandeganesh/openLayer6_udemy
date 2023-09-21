window.onload = init

function init() {
  const Map = new ol.Map({
    view: new ol.View({
      center: [0, 0], // X,Y
      zoom: 2
    }),
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM()
      })
    ],
    target: 'js-map'
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

  })
}