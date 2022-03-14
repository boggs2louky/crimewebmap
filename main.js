window.onload = init;


function init() {

  // Attribution Control
  const attributionControl = new ol.control.Attribution({
    collapsible: true
  })

  // Map object
  const map = new ol.Map({
    view: new ol.View({
      center: [-9539583.27533542, 3505188.454827129],
      zoom: 3,
      extent: [-9589203.828347333, 4568076.611899183, -9478223.868263576, 4661889.737198758]
    }),
    //layers: [
    //  new ol.layer.Tile({
    //    source: new ol.source.OSM()
    //  })
    //],
    target: 'openlayers-map',
    controls: ol.control.defaults({ attribution: false }).extend([attributionControl])
  })


  //Base Layers
  //Open Street Map Standard
  const openstreetMapStandard = new ol.layer.Tile({
    source: new ol.source.OSM(),
    visible: true,
    title: 'OSMStandard'
  })

  //Bing Maps
  const bingMaps = new ol.layer.Tile({
    source: new ol.source.BingMaps({
      key: "Put your key here",
      imagerySet: 'Aerialwithlabels'
    }),
    visible: false,
    title: 'BingMaps'
  })

  // Layer Group
  const baseLayerGroup = new ol.layer.Group({
    layers: [
      openstreetMapStandard, bingMaps
    ]
  })
  map.addLayer(baseLayerGroup);

  // Layer Switcher Logic for BaseLayers
  const baseLayerElements = document.querySelectorAll('.column-navigation > input[type=radio]')
  for (let baseLayerElement of baseLayerElements) {
    baseLayerElement.addEventListener('change', function () {
      let baseLayerElementValue = this.value;
      baseLayerGroup.getLayers().forEach(function (element, index, array) {
        let baseLayerName = element.get('title');
        element.setVisible(baseLayerName === baseLayerElementValue)
      })
    })
  }

  //Vector Layers
 

  //Symbology for Vector Layer (Neighborhood only)
  const fillStyle = new ol.style.Fill({
    color: [128, 128, 128, .5]
  }) 
 
  //Style for Polygons edges
   const strokeStyle = new ol.style.Stroke({
    color: [30, 30, 31, 1],
    width: 1.0
  }) 

  //Neighborhoods Polygon Data 
  const neighborhoodsgeojson = new ol.layer.Vector({
    source: new ol.source.Vector({
      url: './data/Neighborhoods.geojson',
      format: new ol.format.GeoJSON()
    }),
    visible: false,
    title: 'Neighborhoods',
    style: new ol.style.Style({
      fill: fillStyle,
      stroke: strokeStyle
    })
  })
  //map.addLayer(neighborhoodsgeojson);

  //Fetch External API for LMPD Districts
  const PoliceDistricts = new ol.layer.Vector({
    source: new ol.source.Vector({
      url: 'https://opendata.arcgis.com/datasets/a4c6dc9193494272949631a9f48414e8_26.geojson',
      format: new ol.format.GeoJSON()
    }),
    visible: false,
    title: 'Police Districts'

  })
  
   //Styling of Crime Data Points

   //Burglary Point Style
   /*const burglaryCrimeStyle = new ol.style.Style({
     fill: new ol.style.Fill({
       color: [255, 0, 0, .5]
     })
   }) */

   //Robbery Point Style
   /*const robberyCrimeStyle = new ol.style.Style({
    fill: new ol.style.Fill({
      color: [0, 0, 204, .5]
    })
  }) */

   // Point Style
   const pointStyle = new ol.style.Style({
     image: new ol.style.Circle({
       fill: new ol.style.Fill({
         color: [255, 0, 0, 1]
       }),
       radius: 4,
       stroke: new ol.style.Stroke({
         color: [30, 30, 31, 1],
         width: 1
       }) 
     })
   })

   const CrimePointsStyle = function(feature){
    let geometryType = feature.getGeometry().getType();
    let crimeData = feature.get('UOR_DESC');

    if(geometryType === 'Point') {
      feature.setStyle([pointStyle]) 

      /*if(crimeData === 'Burglary') {
        feature.setStyle([burglaryCrimeStyle])
      };

      if(crimeData === 'Robbery') 
        feature.setStyle([robberyCrimeStyle]) */
      } 
    } 

   
  //Crime Point Data 2021 
  const crimedatageojson = new ol.layer.Vector({
    source: new ol.source.Vector({
      url: './data/CrimeData2021.geojson',
      format: new ol.format.GeoJSON()
    }),
    visible: false,
    title: 'Crime Data 2021',
    style: CrimePointsStyle
  })

  //map.addLayer(crimedatageojson);

  //HeatMap
  const heatMapCrimeData = new ol.layer.Heatmap ({
    source: new ol.source.Vector({
      url: './data/HeatmapCrimeData2021.geojson',
      format: new ol.format.GeoJSON()  
    }),
    radius: 6,
    blur: 12,
    visible: false,
    title: 'Crime Heatmap'         
  })
  //map.addLayer(heatMapCrimeData);


  // Vector Layer Group
  const layerGroup = new ol.layer.Group({
    layers: [
      neighborhoodsgeojson, crimedatageojson, heatMapCrimeData, PoliceDistricts
    ]
  })
  map.addLayer(layerGroup);


  // Layer Switcher Logic for Vector Layers
  const tileRasterLayerElements = document.querySelectorAll('.column-navigation > input[type=checkbox]');
  for (let tileRasterLayerElement of tileRasterLayerElements) {
    tileRasterLayerElement.addEventListener('change', function () {
      let tileRasterLayerElementValue = this.value;
      let tileRasterLayer;

      layerGroup.getLayers().forEach(function (element, index, array) {
        if (tileRasterLayerElementValue === element.get('title')) {
          tileRasterLayer = element;
        }
      })
      this.checked ? tileRasterLayer.setVisible(true) : tileRasterLayer.setVisible(false)
    })
  }

  //Vector Feature Layers Popup Info
  const overlayContainerElement = document.querySelector('.overlay-container')
  const overlayLayer = new ol.Overlay({
    element: overlayContainerElement  
  })
  map.addOverlay(overlayLayer);
  const overlayFeatureName = document.getElementById('feature-name');
  const overlayFeaturAdditionalInfo = document.getElementById('feature-additional-info');

  //Vector Feature Layers Popup Logic
  map.on('click', function(e){
    overlayLayer.setPosition(undefined);
    map.forEachFeatureAtPixel(e.pixel, function(feature, layer){
      let clickedCoordinate = e.coordinate;
      let clickedFeatureName = feature.get('NH_NAME');
      let clickedFeatureAdditionalInfo = feature.get('UOR_DESC');
      overlayLayer.setPosition(clickedCoordinate);
      overlayFeatureName.innerHTML = clickedFeatureName; 
      overlayFeaturAdditionalInfo.innerHTML = clickedFeatureAdditionalInfo;
       
    })
  })



}

