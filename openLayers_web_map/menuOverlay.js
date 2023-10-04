
// Layers
var layers = [
  new ol.layer.Tile({
    source: new ol.source.BingMaps({
      key: 'AoIRFyUI6p_bKWn-cA4QNwijjpNbVMSR4mbiJHc2FLtR60jUS7Zef30xmrs-IQOy',
      imagerySet: 'Road'
      //AerialWithLabels, Road, CanvasDark,Ordnane
    }),
    visible: true
  })
]

// The map
var map = new ol.Map({
  target: 'js-map',
  view: new ol.View({
    center: [76, 20], // X,Y
    zoom: 6.5,
    // rotation: 0.1,
    projection: 'EPSG:4326',
  }),
  layers: layers
});

// Overlay
var menu = new ol.control.Overlay({
  closeBox: true,
  className: "slide-left menu",
  content: $("#menu").get(0)
});
map.addControl(menu);

// A toggle control to show/hide the menu
var t = new ol.control.Toggle({
  html: '<i class="fa fa-bars" ></i>',
  className: "menu",
  title: "Menu",
  onToggle: function () { menu.toggle(); }
});
map.addControl(t);

// GeoJSON layer
var vectorSource = new ol.source.Vector({
  url: './data/fond_guerre.geojson',
  projection: 'EPSG:3857',
  format: new ol.format.GeoJSON(),
  attributions: ["&copy; <a href='https://data.culture.gouv.fr/explore/dataset/fonds-de-la-guerre-14-18-extrait-de-la-base-memoire'>data.culture.gouv.fr</a>"],
  logo: "https://www.data.gouv.fr/s/avatars/37/e56718abd4465985ddde68b33be1ef.jpg"
});

map.addLayer(new ol.layer.Vector({
  name: 'Fonds de guerre 14-18',
  source: vectorSource
}));

// Control Select 
var select = new ol.interaction.Select({});
map.addInteraction(select);

// On selected => show/hide popup
select.getFeatures().on('add', function (e) {
  var feature = e.element;
  var img = $("<img>").attr("src", feature.get("img"));
  var info = $("<div>").append($("<p>").text(feature.get("text")));
  var content = $("<div>")
    .append(img)
    .append(info);
  $(".data").html(content);
});
select.getFeatures().on('remove', function (e) {
  $(".data").html("");
});
