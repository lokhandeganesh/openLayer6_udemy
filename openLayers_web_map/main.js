window.onload = init

function init() {
  // adding Controls
  // Search by attributes of layer
  const SearchFeature = new ol.control.SearchFeature();
  // Overview map
  const overViewMapControl = new ol.control.OverviewMap({
    collapsed: true,
    // label: '<i class="fa-solid fa-angles-left"></i>',
    collapseLabel: '\u00BB',
    label: '\u00AB',
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM()
      })
    ],
  });

  // Initiating Map
  const extent = [66.41, 7.25, 99.35, 36.9];

  const Map = new ol.Map({
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
        zIndex: 1,
        visible: false,
      })
    ],
    target: '-map',
    KeyboardEventTarget: document,
    // change of expression in V7
    controls: ol.control.defaults.defaults({
      zoom: true,
      attribution: true,
      rotate: false
    })
      // Adding new external controls on map
      .extend([SearchFeature, overViewMapControl]),
  })

  // LayerGroups
  const layerGroup = new ol.layer.Group({
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM({
          url: 'http://{a-c}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'
        }),
        zIndex: 0,
        visible: true,
        extent: extent,
      })
    ]
  });
  Map.addLayer(layerGroup);

  // adding Overlays
  const popupContainerElement = document.getElementById('popup-coordinates');
  const popup = new ol.Overlay({
    element: popupContainerElement
  });
  // Map.addOverlay(popup);
  Map.on('click', function (evt) {
    // console.log(evt.coordinate);
    const clickedCoordinate = evt.coordinate;
    console.log(clickedCoordinate)

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
  // Map.addInteraction(drawInteraction);

  drawInteraction.on('drawend', function (evt) {
    // console.log(evt)
    let parser = new ol.format.GeoJSON();
    let drawnFeatures = parser.writeFeatures([evt.feature]); //parser.writeFeaturesObject([evt.feature]);
    console.log(drawnFeatures);

    // Map.addLayer(drawnFeatures);
  })



  const SelectPopup = new ol.control.SelectPopup({
  })
  // Map.addControl(SelectPopup);

  // GeoJson Layer of NRM Project(PoCRA) Points
  const nrmProjectVectorSource = new ol.source.Vector({
    url: "http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard_V2/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=PoCRA_Dashboard_V2%3Anrm_point_data_pocra_structures&outputFormat=application%2Fjson",
    projection: 'EPSG:4326',
    format: new ol.format.GeoJSON(),
  })

  // Adding Layer to Map
  Map.addLayer(new ol.layer.Vector({
    name: 'NRM Project Locations',
    source: nrmProjectVectorSource,
    visible: true,
  }))
  const SelectCtl = new ol.control.Select({
    source: nrmProjectVectorSource,
    // property: $(".options select").val()
  });
  Map.addControl(SelectCtl);
  SelectCtl.on('select', function (evt) {
    console.log(evt)
  })

  // Print control
  var printControl = new ol.control.PrintDialog({
    // target: document.querySelector('.info'),
    // targetDialog: Map.getTargetElement() 
    // save: false,
    // copy: false,
    // pdf: false
  });
  printControl.setSize('A4');
  Map.addControl(printControl);

  /* On print > save image file */
  printControl.on(['print', 'error'], function (e) {
    // Print success
    if (e.image) {
      if (e.pdf) {
        // Export pdf using the print info
        var pdf = new jsPDF({
          orientation: e.print.orientation,
          unit: e.print.unit,
          format: e.print.size
        });
        pdf.addImage(e.image, 'JPEG', e.print.position[0], e.print.position[0], e.print.imageWidth, e.print.imageHeight);
        pdf.save(e.print.legend ? 'legend.pdf' : 'map.pdf');
      } else {
        // Save image as file
        e.canvas.toBlob(function (blob) {
          var name = (e.print.legend ? 'legend.' : 'map.') + e.imageType.replace('image/', '');
          saveAs(blob, name);
        }, e.imageType, e.quality);
      }
    } else {
      console.warn('No canvas to export');
    }
  });

}