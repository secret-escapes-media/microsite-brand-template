// load all external trip marker data into the same variable
var allTrips = [tripOne, tripTwo, tripThree];

// get trip content from id
function getTrip(trip) {
  for (var tripI = 0; tripI < tripContent.length; tripI++) {
    if (tripContent[tripI].id === trip) return tripContent[tripI];
  }
}

// get POI content from trip and poi ids
function getPoi(trip, poiId) {
  var thisTripContent = getTrip(trip);
  for (var poiI = 0; poiI < thisTripContent.stops.length; poiI++) {
    if (thisTripContent.stops[poiI].id === poiId)
      return thisTripContent.stops[poiI];
  }
}

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
    // load data in for each trip
    for (var i = 0; i < allTrips.length; i++) {
      var tripId = allTrips[i].id;
      var route = allTrips[i].route.features[0].geometry;
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
        metadata: { tripId: tripId },
        type: "symbol",
        source: {
          type: "geojson",
          data: allTrips[i].pois
        },
        layout: {
          "icon-image": "pin-michelin-star",
          "icon-size": 0.7,
          "icon-anchor": "bottom",
          "icon-allow-overlap": true
        }
      });
      // POI click event to show popup window in map
      map.on("click", tripId + "-pois", function (e) {
        var coordinates = e.features[0].geometry.coordinates.slice();
        var poiId = e.features[0].properties.id;
        var thisTripId = e.features[0].layer.metadata.tripId;
        var poiContent = getPoi(thisTripId, poiId);
        var tripLink = baseurl + getTrip(thisTripId).url;
        var poiDescriptionLimited =
          poiContent.description.substring(0, 155) + "...";
        var description =
          '<div class="bg-black bg-ratio bg-ratio--3-2" style="background-image:url(\'' +
          imgPath +
          "/content/" +
          thisTripId +
          '/bg.jpg\')"><a href="' +
          tripLink +
          '" class="absolute top-0 left-0 right-0 bottom-0"></a></div><div class="p-6"><h3 class="h5">' +
          poiContent.title +
          '</h3><p class="text-sm leading-loose pt-1">' +
          poiDescriptionLimited +
          ' <a href="' +
          tripLink +
          '" class="text-primary-400 underline">Read More</a></p><div class="h-3"></div><a href="' +
          tripLink +
          '" class="btn btn--sm">See the full trip</a></div>';
        new mapboxgl.Popup({
          focusAfterOpen: false
        })
          .setLngLat(coordinates)
          .setHTML(description)
          .setMaxWidth("360px")
          .addTo(map);
      });
    }
  });
}

// load map on page load
map();

// reveal map
$(".js-open-map").on("click", function (e) {
  e.preventDefault();
  $(".js-map-cover").addClass("hidden");
});
