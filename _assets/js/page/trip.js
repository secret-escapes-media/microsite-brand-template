var currentTripId = $("#map").data("trip-id");
var currentTrip = eval(currentTripId);

function map() {
  // launch map with settings
  mapboxgl.accessToken =
    "pk.eyJ1IjoiaGFtaXNoamdyYXkiLCJhIjoiY2pkbjBmeGN6MDd1YzMzbXI3cWdpNThjayJ9.3YE8T1H2QUyqNIkxdKWxkg";
  var map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/hamishjgray/cjmkjea7r1apf2rrsneiy7sxa",
    logoPosition: "bottom-right",
    zoom: 5.64,
    minZoom: 4.5,
    center: [-4.002956, 54.452665]
  });
  map.dragRotate.disable(); // disable map rotation using right click + drag
  map.touchZoomRotate.disableRotation(); // disable map rotation using touch rotation gesture

  // builds map with custom functionality
  map.on("load", function () {
    var tripId = currentTrip.id;
    var route = currentTrip.route.features[0].geometry;
    var routeStart = route.coordinates[0];
    var routeEnd = route.coordinates.pop();
    // draw route on map
    map.addLayer(
      {
        id: tripId + "-route",
        type: "line",
        source: {
          type: "geojson",
          data: {
            type: "Feature",
            geometry: route
          }
        },
        paint: {
          "line-width": 1.33,
          "line-color": "#27509b"
        }
      },
      "road-label"
    );
    // draw route start and end point on map
    map.addLayer({
      id: tripId + "-route-start-and-end",
      type: "circle",
      source: {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: routeStart
              }
            },
            {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: routeEnd
              }
            }
          ]
        }
      },
      paint: {
        "circle-radius": 4,
        "circle-color": "#ffffff",
        "circle-stroke-width": 2,
        "circle-stroke-color": "#27509b"
      }
    });
    // add POI markers to map
    map.addLayer({
      id: tripId + "-pois",
      type: "symbol",
      source: {
        type: "geojson",
        data: currentTrip.pois
      },
      layout: {
        "icon-image": "pin-michelin-star",
        "icon-size": 0.7,
        "icon-anchor": "bottom",
        "icon-allow-overlap": true
      }
    });
    // POI click event
    map.on("click", tripId + "-pois", function (e) {
      console.log(e.features[0].properties.id);
    });
    // center the map on the route line
    var bounds = new mapboxgl.LngLatBounds();
    currentTrip.preroute.features.forEach(function (feature) {
      bounds.extend(feature.geometry.coordinates);
    });
    var iconPadding = { padding: 42 };
    map.fitBounds(bounds, iconPadding); // adds padding so markers aren't on edge
  });
}

// load map on page load
map();
