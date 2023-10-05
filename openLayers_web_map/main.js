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
  // 
  const attributionControl = new ol.control.Attribution({
    collapsible: true,
  })

  // 


  // Initiating Map
  const extent = [72, 15, 82, 23];

  const Map = new ol.Map({
    view: new ol.View({
      center: [76, 20], // X,Y
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
    target: 'js-map',
    KeyboardEventTarget: document,
    // change of expression in V7
    controls: ol.control.defaults.defaults({
      zoom: true,
      attribution: false,
      rotate: false
    })
      // Adding new external controls on map
      .extend([SearchFeature, overViewMapControl, attributionControl]),
  })

  // LayerGroups
  const layerGroup = new ol.layer.Group({
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM({
          url: 'http://{a-c}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'
        }),
        zIndex: 0,
        visible: false,
        extent: extent,
      }),
      // Bing Maps Base Layer
      new ol.layer.Tile({
        source: new ol.source.BingMaps({
          key: 'AoIRFyUI6p_bKWn-cA4QNwijjpNbVMSR4mbiJHc2FLtR60jUS7Zef30xmrs-IQOy',
          imagerySet: 'Road'
          //AerialWithLabels, Road, CanvasDark,Ordnane
        }),
        visible: true
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
  // Map.on('click', function (evt) {

  //   // console.log(evt.coordinate);    
  //   // const clickedCoordinate = evt.coordinate;
  //   // console.log(clickedCoordinate)

  //   popup.setPosition(undefined);
  //   popup.setPosition(clickedCoordinate);
  //   popupContainerElement.innerHTML = clickedCoordinate
  // });

  // adding Interactions
  const dragRotateInteraction = new ol.interaction.DragRotate({
    condition: ol.events.condition.altKeyOnly
  });
  Map.addInteraction(dragRotateInteraction);

  // adding Draw interaction
  const drawInteraction = new ol.interaction.Draw({
    type: 'Polygon'
  });
  // Map.addInteraction(drawInteraction);

  drawInteraction.on('drawend', function (evt) {
    // console.log(evt)
    let parser = new ol.format.GeoJSON();
    let drawnFeatures = parser.writeFeatures([evt.feature]); //parser.writeFeaturesObject([evt.feature]);
    console.log(drawnFeatures);
    // Map.addLayer(drawnFeatures);
  });

  // Select PopUp control
  const SelectPopup = new ol.control.SelectPopup({
  });
  // Map.addControl(SelectPopup);

  // GeoJson Layer of NRM Project(PoCRA) Points
  const nrmProjectVectorSource = new ol.source.Vector({
    url: "http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard_V2/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=PoCRA_Dashboard_V2%3Anrm_point_data_pocra_structures&outputFormat=application%2Fjson",
    projection: 'EPSG:4326',
    format: new ol.format.GeoJSON(),
  });

  const nrmProjectLocStyle = (feature) => {
    // console.log(feature);

    // "activity_name", "activity_code", "structure_type"
    // "Construction of Earthen Nala Bunds",	"A3.2.2",	"ENB"
    // "Gabian Structure",	"A3.2.4",	"GB"
    // "Construction of Cement Nala Bunds",	"A3.2.3",	"CNB"
    // "Recharge Shaft",	"A3.2.6",	"RS"
    // "Desilting of old water storage structure",	"A3.4.1",	"DeSWS"
    // "Construction of Loose bolder Structures",	"A3.2.1",	"LBS"
    // "Recharge Shaft with Recharge Trench",	"A3.2.7",	"RST"
    // "Composite Gabian Structure-RC Pardi",	"A3.2.8",	"GB"
    // "INDIVIDUAL FARM POND-BJS",	"A3.3.6",	"FP-I"

    var structure_type = feature.get("structure_type");
    // dynamic icon & color depending upon properties
    (structure_type === 'DeSWS')
      ? (src = './assets/icon/icon.svg', color = [255, 0, 0])
      : structure_type === 'CNB'
        ? (src = './assets/icon/icon.svg', color = [0, 255, 0])
        : (src = './assets/icon/icon_copy.svg', color = [0, 0, 255]);

    // defining custom style
    const style = new ol.style.Style({
      image: new ol.style.Icon({
        opacity: 1,
        scale: .5,
        src: src,
        color: color,
      }),
    });

    return style
  };
  const nrmProjectVector = new ol.layer.Vector({
    name: 'NRM Project Locations',
    source: nrmProjectVectorSource,
    visible: true,
    style: nrmProjectLocStyle,
  });

  // Adding Layer to Map
  Map.addLayer(nrmProjectVector);

  // Manupulation of layer properties
  // setAttributions
  nrmProjectVector.getSource().setAttributions('<a>@ManualAttr.com</a>');
  // console.log(nrmProjectVector.getKeys());
  // nrmProjectVector.set('maxZoom', 9);

  // Project District Vector Layer
  const mh_districtSource = new ol.source.Vector({
    url: "./assets/data/mh_district.json",
    projection: 'EPSG:4326',
    format: new ol.format.GeoJSON(),
  });

  // Custom Style for District Vector layer
  const mh_districtVectorStyle = (feature) => {
    // console.log(feature);    
    (feature.get('is_pocra') === 1)
      ? color = [255, 128, 0, 0.8] // for Project District
      : color = [105, 105, 105, 0.8] // for Non-Project District

    return new ol.style.Style({
      text: new ol.style.Text({
        text: feature.get('dtmname'), //.toString(),
        font: 'bold 18px sans-serif',
        fill: new ol.style.Fill({
          color: '#fff'
        })
      }),
      stroke: new ol.style.Stroke({
        width: 1,
        color: [255, 255, 255, 1],
        lineDash: [5, 8],
        lineCap: 'round',
      }),
      fill: new ol.style.Fill({
        color: color
      })
    })
  };
  // const mh_districtVector = new ol.layer.VectorImage({
  // for faster rendering during interaction and animations, at the cost of less accurate rendering.
  const mh_districtVector = new ol.layer.Vector({
    name: 'mh_district',
    source: mh_districtSource,
    visible: false,
    style: mh_districtVectorStyle,
  });

  // Adding Layer to Map
  Map.addLayer(mh_districtVector);

  /* 
    // Overlay (Display an overlay with a content on the map)
    var menu = new ol.control.Overlay({
      closeBox: true,
      className: "slide-left menu",
      content: $("#menu").get(0)
    });
    Map.addControl(menu);
   
    // Toggle control to show/hide the menu
    var tog = new ol.control.Toggle({
      html: '<i class="fa fa-bars"></i>',
      className: 'menu',
      title: "Menu",
      onToggle: function () { menu.toggle(); }
    });
    Map.addControl(tog);
  */

  // Adding SelectInteraction on Map to District Layer
  var selectIn = new ol.interaction.Select({
    // hitTolerance: 5,
    condition: ol.events.condition.singleClick
    // condition: ol.events.condition.pointerMove
  });

  // Vector features can be Selected on MouseClick
  // Map.addInteraction(selectIn);
  Map.getInteractions().extend([selectIn]);

  // Select Feature When event occurs, possible event can be one of the below
  // [DblClickDragZoom, DoubleClickZoom, DragAndDrop, KeyboardPan,
  //   KeyboardZoom, Link, MouseWheelZoom, PointerInteraction, Select
  // ]

  // Displaying and Accessing feature on Select event.
  var displayFeatureInfo = function (pixel) {
    var features = [];

    Map.forEachFeatureAtPixel(pixel, function (feature, layer) {
      // console.log(layer.get("name"));
      features.push(feature);

      // Displaying District information
      if (layer.get("name") === 'mh_district') {
        var container = document.getElementById('information');
        // 
        if (features.length > 0) {
          var info = [];
          for (var i = 0, length = features.length; i < length; ++i) {
            info.push(features[i].get('dtmname'));
          }
          container.innerHTML = info.join(', ') || '(unknown)';
        } else {
          container.innerHTML = '&nbsp;';
        }
      }
    },
      // filtering layers according to its properties
      // {
      //   layerFilter: function (layerCandidate) {
      //     // console.log(layerCandidate.get("name"));
      //     return layerCandidate.get("name") === "mh_district"
      //   }
      // }
    );


  };


  selectIn.on('select', function (evt) {
    // console.log(evt)
    var pixel = evt.mapBrowserEvent.pixel;
    // Passing value to function
    displayFeatureInfo(pixel);
    // OR

    // Selection of features
    var feature = evt.selected[0];
    // console.log(feature)
    if (feature) {
      var prop = feature.getProperties();
      // console.log(prop['dtncode']);
    }
  })


  /*
   // On selected => show/hide popup
   selectIn.getFeatures().on('add', function (e) {
     var feature = e.element;
     // var img = $("<img>").attr("src", feature.get("img"));
     var info = $("<div>").append($("<p>").text(feature.get("dtncode")));
     var content = $("<div>")
       // .append( img )
       .append(info);
     $(".data").html(content);
   });
   selectIn.getFeatures().on('remove', function (e) {
     $(".data").html("");
   });
  */

  // Tile Json of Vector 
  /* 
  const mh_districtTile = new ol.source.TileJSON({
    url: "http://localhost:3000/mh_district?f=tilegeojson",
    crossOrigin: 'anonymous',
  });
  
  const mh_districMVT = new ol.layer.Tile({
    name: 'mh_district',
    source: mh_districtTile,
    visible: false,
  });
  */

  // Adding Layer to Map
  // Map.addLayer(mh_districMVT);


  // Select (by Attributes) Control on Map
  const SelectCtl = new ol.control.Select({
    source: mh_districtSource,
  });
  // 
  Map.addControl(SelectCtl);
  SelectCtl.on('select', function (evt) {
    console.log(evt)
  })

  // Changing Cursor Style When feature is present on Map
  Map.on('pointermove', function (e) {
    var pixel = Map.getEventPixel(e.originalEvent);
    var hit = Map.hasFeatureAtPixel(pixel);
    Map.getViewport().style.cursor = hit ? 'pointer' : '';
  });

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