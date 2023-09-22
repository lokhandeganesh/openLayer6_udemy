// adding Controls
// Search by attributes of layer
const SearchFeature = new ol.control.SearchFeature();
// Initiating Map
const extent = [70.41, 15.25, 80.35, 25.9];

const map = new ol.Map({
  view: new ol.View({
    center: [76.34, 19.61], // X,Y
    zoom: 6.5,
    // rotation: 0.1,
    projection: 'EPSG:4326',
    // You can not pan-out beyond defined extent area
    extent: extent,
  }),
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM(),
      visible: true,
    })
  ],
  target: 'js-map',
  KeyboardEventTarget: document,
  // change of expression in V7
  controls: ol.control.defaults.defaults({
    zoom: true,
    attribution: true,
    rotate: false
  })
    // Adding new external controls on map
    .extend([SearchFeature]),
})


const nrmProjectVectorSource = new ol.source.Vector({
  url: "http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard_V2/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=PoCRA_Dashboard_V2%3Anrm_point_data_pocra_structures&outputFormat=application%2Fjson",
  projection: 'EPSG:4326',
  format: new ol.format.GeoJSON(),
})

// Cluster Source
var clusterSource = new ol.source.Cluster({
  distance: 40,
  source: nrmProjectVectorSource
});
// Animated cluster layer
// var clusterLayer = new ol.layer.Vector({
//   source: clusterSource,
// });
// map.addLayer(clusterLayer);

const styleCache = {};
const clusters = new ol.layer.Vector({
  source: clusterSource,
  style: function (feature) {
    const size = feature.get('features').length;
    let style = styleCache[size];
    if (!style) {
      style = new ol.style.Style({
        image: new ol.style.Circle({
          radius: 10,
          stroke: new ol.style.Stroke({
            color: '#fff',
          }),
          fill: new ol.style.Fill({
            color: '#3399CC',
          }),
        }),
        text: new ol.style.Text({
          text: size.toString(),
          fill: new ol.style.Fill({
            color: '#fff',
          }),
        }),
      });
      styleCache[size] = style;
    }
    return style;
  },
});

map.addLayer(clusters);

map.on('click', (e) => {
  clusters.getFeatures(e.pixel).then((clickedFeatures) => {
    if (clickedFeatures.length) {
      // Get clustered Coordinates
      const features = clickedFeatures[0].get('features');
      if (features.length > 1) {
        const extent = new ol.extent.boundingExtent(
          features.map((r) => r.getGeometry().getCoordinates())
        );
        map.getView().fit(extent, { duration: 1000, padding: [50, 50, 50, 50] });
      }
    }
  });
});