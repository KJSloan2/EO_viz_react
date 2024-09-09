document.addEventListener('DOMContentLoaded', function () {
  const { DeckGL, GeoJsonLayer, ColumnLayer, ScatterplotLayer, TextLayer} = deck;

  let columnLayer;
  let geoJsonLayer;
  let deckInstance;
  let textLayer;

  function updateLayers(radius) {
    const updatedColumnLayer = new ColumnLayer({
      id: 'columnLayer',
      data: columnLayer.props.data,
      diskResolution: 2,
      radius: 35,
      elevationScale: 3000,
      getPosition: d => d.centroid,
      getFillColor: d => [100, d.value_normalized * 255, d.value_normalized * 255, 255],
      getElevation: d => d.value_normalized
    });
    
    deckInstance.setProps({ layers: [updatedColumnLayer, geoJsonLayer, textLayer] });
  }

  function loadGeoJSON(filePath) {
    return fetch(filePath)
      .then(response => response.json())
      .then(geojsonData => geojsonData)
      .catch(error => {
        console.error('Error loading GeoJSON file', error);
      });
  }

  function loadJSON(filePath) {
    fetch(filePath, { mode: 'no-cors' })
      .then(response => response.json())
      .then(data => {
        const calculateCenter = (coordinates) => {
          const numCoords = coordinates.length;
          const sumLat = coordinates.reduce((sum, coord) => sum + coord[1], 0);
          const sumLng = coordinates.reduce((sum, coord) => sum + coord[0], 0);
          const avgLat = sumLat / numCoords;
          const avgLng = sumLng / numCoords;
          return { latitude: avgLat, longitude: avgLng };
        };

        const centerCoordinates = calculateCenter(data.map(entry => entry.centroid));

        const normalizeValues = (data) => {
          const values = data.map(entry => entry.lstf);
          const minValue = Math.min(...values);
          const maxValue = Math.max(...values);

          const normalizedData = data.map(entry => ({
            ...entry,
            value_normalized: (entry.lstf - minValue) / (maxValue - minValue),
          }));

          return normalizedData;
        };

        const normalizedJsonData = normalizeValues(data);
        data.forEach((entry, index) => {
          Object.assign(entry, normalizedJsonData[index]);
        });

        columnLayer = new ColumnLayer({
          id: 'columnLayer',
          data: data,
          diskResolution: 6,
          radius: 50,
          elevationScale: 3000,
          getPosition: d => d.centroid,
          getFillColor: d => [d.value_normalized * 255, 50, 50, 100],
          getElevation: d => d.value_normalized
        });

        // Load external GeoJSON file
        loadGeoJSON('./data/A0_tileReferencePolygons.geojson')
          .then(polygonGeoJson => {
            geoJsonLayer = new GeoJsonLayer({
              id: 'geoJsonLayer',
              data: polygonGeoJson, // Use the data from the external GeoJSON file
              pickable: true,        // Make the polygon interactive
              stroked: true,         // Draw the outline of the polygon
              filled: true,          // Fill the polygon
              lineWidthMinPixels: 1, // Minimum line width for the polygon's stroke
              getLineColor: [255, 255, 255], // Red outline
              getFillColor: [255, 51, 51, 25]  // Blue fill with transparency
            });

            textLayer = new TextLayer({
              id: 'text-layer',
              data: polygonGeoJson.features,
              pickable: true,
              getPosition: (d) => {
                const centroid = turf.centroid(d);
                return centroid.geometry.coordinates;
              },
              getText: (d) => d.properties.name, // Get the text from the GeoJSON properties
              getSize: 32, // Text size
              getColor: [255, 255, 255, 255], // Text color (black)
              getTextAnchor: 'middle',
              getAlignmentBaseline: 'center'
            });

            if (!deckInstance) {

              // Create a new DeckGL instance if it doesn't exist yet
              deckInstance = new DeckGL({
                container: 'deck-container-lstf',
                mapStyle: 'https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json',
                initialViewState: {
                  longitude: centerCoordinates.longitude,
                  latitude: centerCoordinates.latitude,
                  zoom: 9.3,
                  maxZoom: 15,
                  pitch: 45,
                  bearing: 45
                },
                controller: true,
                layers: [columnLayer, geoJsonLayer, textLayer] // Add both layers
              });
            } else {
              // Update the deck instance with new data
              deckInstance.setProps({
                layers: [columnLayer, geoJsonLayer, textLayer],
                initialViewState: {
                  longitude: centerCoordinates.longitude,
                  latitude: centerCoordinates.latitude,
                  zoom: 9.3,
                  pitch: 45,
                  bearing: 45
                }
              });
            }
          });
      })
      .catch(error => {
        console.error('Error loading JSON file', error);
      });
  }

  // Event listener for dropdown selection
  const jsonSelector = document.getElementById('json-selector');
  jsonSelector.addEventListener('change', function () {
    const yearTile = jsonSelector.value;
    const directoryName = './data/tiles/A0_';
    const ext = '_V1.json';
    const filePath = `${directoryName}${yearTile}${ext}`;
    loadJSON(filePath); // Load the selected JSON file
  });

  // Load the default JSON file on page load
  loadJSON('./data/tiles/A0_2013_0-0_V1.json');
});