 // Base Layers
  // Openstreet Map Standard
  const openstreetMapStandard = new ol.layer.Tile({
    source: new ol.source.OSM(),
    visible: true,
    title: 'OSMStandard'
  })

  // Bing Maps Basemap Layer
  const bingMaps = new ol.layer.Tile({
    source: new ol.source.BingMaps({
      key: "Ao75RyMRTkOtlKghEazvIKEfaSVjC9MMfQjPJSOKOEAg23raFs03yhndHuQGvkqo",
      imagerySet: 'Aerial'  // Road, CanvasDark, CanvasGray
    }),
    visible: false,
    title: 'BingMaps'
  })



  // Layer Group
  const baseLayerGroup = new ol.layer.Group({
    layers: [
      openstreetMapStandard, openstreetMapHumanitarian, bingMaps, cartoDBBaseLayer,
      StamenTerrainWithLabels, StamenTerrain
    ]
  })
  map.addLayer(baseLayerGroup);

  // Layer Switcher Logic for BaseLayers
  const baseLayerElements = document.querySelectorAll('.sidebar > input[type=radio]')
  for (let baseLayerElement of baseLayerElements) {
    baseLayerElement.addEventListener('change', function () {
      let baseLayerElementValue = this.value;
      baseLayerGroup.getLayers().forEach(function (element, index, array) {
        let baseLayerName = element.get('title');
        element.setVisible(baseLayerName === baseLayerElementValue)
      })
    })
  }

  const zoomSliderControl = new ol.control.ZoomSlider();

  console.log(ol.control.defaults())

  const popupContainerElement = document.getElementById('popup-coordinates');
  const popup = new ol.Overlay({
    element: popupContainerElement,
    positioning: 'top-center'
  })

  map.addOverlay(popup);

  map.on('click', function (e) {
    const clickedCoordinate = e.coordinate;
    popup.setPosition(undefined);
    popup.setPosition(clickedCoordinate);
    popupContainerElement.innerHTML = clickedCoordinate;
  })

  //Drag Roatate Interacion
  const dragRotateInteraction = new ol.interaction.DragRotate({
    condition: ol.events.condition.altKeyOnly
  })

  map.addInteraction(dragRotateInteraction)

  const drawInteraction = new ol.interaction.Draw({
    type: 'Polygon',
    //freehand: true

  })

  map.addInteraction(drawInteraction);

  drawInteraction.on('drawend', function (e) {
    let parser = new ol.format.GeoJSON();
    let drawnFeatures = parser.writeFeatures([e.feature]);
    console.log(drawnFeatures);

  })