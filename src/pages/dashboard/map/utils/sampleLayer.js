// The API Key provided is restricted to JSFiddle website
// Get your own API Key on https://myprojects.geoapify.com
const myAPIKey = "6dc7fb95a3b246cfa0f3bcef5ce9ed9a";

const map = new maplibregl.Map({
  container: 'my-map',
  style: `https://maps.geoapify.com/v1/styles/klokantech-basic/style.json?apiKey=${myAPIKey}`,
  center: [-72.79419772520356, 44.53361448499783],
  zoom: 14
});
map.addControl(new maplibregl.NavigationControl());

const popup = new maplibregl.Popup();

// calculate and display routing:
// from 38.937165,-77.045590 (1208 Hourglass Drive, Stowe, VT 05672, United States of America)
const fromWaypoint = [-72.78056761690857, 44.53000255267429]; // longitude, latutude
const fromWaypointMarker = new maplibregl.Marker().setLngLat(fromWaypoint)
  .setPopup(new maplibregl.Popup().setText(
    '1208 Hourglass Drive, Stowe, VT 05672, United States of America'
  )).addTo(map);


// to 38.881152,-76.990693 (Switchback, Stowe, VT 05672-5111, United States of America)
const toWaypoint = [-72.80797096598127, 44.536552001130076]; // longitude, latutude
const toWaypointMarker = new maplibregl.Marker().setLngLat(toWaypoint)
  .setPopup(new maplibregl.Popup().setText(
    'Switchback, Stowe, VT 05672-5111, United States of America'
  )).addTo(map);

let routeData;
let routeStepsData;
let instructionsData;
let stepPointsData;

fetch(`https://api.geoapify.com/v1/routing?waypoints=lonlat:${fromWaypoint.join(",")}|lonlat:${toWaypoint.join(",")}&mode=hike&details=route_details,elevation&apiKey=${myAPIKey}`).then(res => res.json()).then(routeResult => {
  routeData = routeResult;
  const steps = [];
  const instructions = [];
  const stepPoints = [];

  routeData.features[0].properties.legs.forEach((leg, legIndex) => {
    const legGeometry = routeData.features[0].geometry.coordinates[legIndex];
    leg.steps.forEach((step, index) => {
      if (step.instruction) {
        instructions.push({
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": legGeometry[step.from_index]
          },
          properties: {
          	text: step.instruction.text
          }
        });
      }

      if (index !== 0) {
        stepPoints.push({
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": legGeometry[step.from_index]
          },
          properties: step
        })
      }

      if (step.from_index === step.to_index) {
        // destination point
        return;
      }

      const stepGeometry = legGeometry.slice(step.from_index, step.to_index + 1);
      steps.push({
        "type": "Feature",
        "geometry": {
          "type": "LineString",
          "coordinates": stepGeometry
        },
        properties: step
      });
    });
  });

  routeStepsData = {
    type: "FeatureCollection",
    features: steps
  }

  instructionsData = {
    type: "FeatureCollection",
    features: instructions
  }

  stepPointsData = {
    type: "FeatureCollection",
    features: stepPoints
  }

  map.addSource('route', {
    type: 'geojson',
    data: routeData
  });
  
  map.addSource('points', {
    type: 'geojson',
    data: instructionsData
  });
  
 	addLayerEvents();
  drawRoute();
}, err => console.log(err));

function drawRoute() {
  if (!routeData) {
    return;
  }

  if (map.getLayer('route-layer')) {
    map.removeLayer('route-layer')
  }
  
  if (map.getLayer('points-layer')) {
  	map.removeLayer('points-layer')
  }

  if (document.getElementById("showDetails").checked) {
    map.getSource('route').setData(routeStepsData);
    map.addLayer({
      'id': 'route-layer',
      'type': 'line',
      'source': 'route',
      'layout': {
        'line-join': "round",
        'line-cap': "round"
      },
      'paint': {
        'line-color': [
          'match',
          ['get', 'road_class'],
          'motorway',
          '#009933',
          'trunk',
          '#00cc99',
          'primary',
          '#009999',
          'secondary',
          '#00ccff',
          'tertiary',
          '#9999ff',
          'residential',
          '#9933ff',
          'service_other',
          '#ffcc66',
          'unclassified',
          '#666699',
          /* other */
          '#666699'
        ],
        'line-width': 8
      }
    });
    
    map.getSource('points').setData(stepPointsData);
    map.addLayer({
      'id': 'points-layer',
      'type': 'circle',
      'source': 'points',
      'paint': {
        'circle-radius': 4,
        'circle-color': "#ddd",
        'circle-stroke-color': "#aaa",
        'circle-stroke-width': 1,
      }
    });
  } else {
    map.getSource('route').setData(routeData);
    map.addLayer({
      'id': 'route-layer',
      'type': 'line',
      'source': 'route',
      'layout': {
        'line-cap': "round",
        'line-join': "round"
      },
      'paint': {
        'line-color': "#6084eb",
        'line-width': 8
      },
      'filter': ['==', '$type', 'LineString']
    });
    
    map.getSource('points').setData(instructionsData);
    map.addLayer({
      'id': 'points-layer',
      'type': 'circle',
      'source': 'points',
      'paint': {
        'circle-radius': 4,
        'circle-color': "#fff",
        'circle-stroke-color': "#aaa",
        'circle-stroke-width': 1,
      }
    });
  }
}

function addLayerEvents() {
  map.on('mouseenter', 'route-layer', () => {
  	map.getCanvas().style.cursor = 'pointer';
  });

  map.on('mouseleave', 'route-layer', () => {
  	map.getCanvas().style.cursor = '';
  });
  
  map.on('mouseenter', 'points-layer', () => {
  	map.getCanvas().style.cursor = 'pointer';
  });

  map.on('mouseleave', 'points-layer', () => {
  	map.getCanvas().style.cursor = '';
  });
  
  map.on('click', 'route-layer', (e) => { 
  	if (document.getElementById("showDetails").checked) {   
     	const stepData = e.features[0].properties;
    	const propertiesToShow = ["surface", "elevation", "elevation_gain"];
      const dataToShow = {};
      propertiesToShow.forEach(property => {
      	if (stepData[property] || stepData[property] === 0) {
        	dataToShow[property] = stepData[property];
        }
      });
      
      showPopup(dataToShow, e.lngLat);
    } else {
    	showPopup({
      	distance: `${e.features[0].properties.distance} m`,
        time: `${e.features[0].properties.time} s`
      }, e.lngLat);      
    }
    e.preventDefault();
  })

  map.on('click', 'points-layer', (e) => {
  	const properties = e.features[0].properties;
   	const point = e.features[0].geometry.coordinates;
    
    if (properties.text) {
    	popup.setText(properties.text);
      popup.setLngLat(point);
      popup.addTo(map);
      e.preventDefault();
    }
  });
}


function showPopup(data, lngLat) {
	let popupHtml = Object.keys(data).map(key => {
  	return `<div class="popup-property-container">
    					<span class="popup-property-label">${key}: </span>
              <span class="popup-property-value">${data[key]}</span>
            </div>`
  }).join(''); 
   
 	popup.setLngLat(lngLat).setHTML(popupHtml).addTo(map);
}