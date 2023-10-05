Completely free and open source, front-end JavaScript library for building interactive web maps.

Can display different types of geospatial data such as raster, vector, markers from any source.

Advantages of OpenLayers

- One of the mature and popular web mapping frameworks.
- Developing web mapping application is easy and fun.
- Has strong community of developers.
- Recognized by the Open Source Geospatial Foundation (OSGeo), which supports the development of open source geospatial technologies and data.

For a map to render you need at minimum 3 things:

- View
- Layers
- Target Container

Key concepts in OpenLayers

- Map
  - View
  - Layer
  - Overlay
  - Interaction
  - Controls

Layers in OpenLayers

- BaseLayer

  - Layer
    - BaseImageLayer
    - BaseTileLayer
    - BaseVectorLayer

  - LayerGroup

Source of Layer in OpenLayers

- Sources
  - Tile Source
    - UTF Grid (Tile JSOM format (MapBox))
    - URL Tile (HTRP request)
      - Tile Image
        - Bing Maps
        - XYZ
          - CartoDB
          - OSM
          - Stamen
          - TileDebug
        - TileArc GISRest
        - Tile WMS (Web Map Service)
        - WMTS
        - Zoomify
        - IIIF
      - Vector Tile
  - Image Source
    - Image ArcGIS Rest
    - Image Canvas Source
    - Image Map Guide
    - Image Static
    - Image WMS
    - Raster Source
  - Vector Source

- Base Vector Layer
  - Vector Tile Layer
  - Vector Image Layer
  - Vector Layer