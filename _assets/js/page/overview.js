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
    style: "mapbox://styles/hamishjgray/ckm4wxqbda6k617qo3vedd0eg",
    logoPosition: "bottom-right",
    zoom: 5.64,
    minZoom: 4.5,
    center: [-4.002956, 54.452665]
  });
  map.dragRotate.disable(); // disable map rotation using right click + drag
  map.touchZoomRotate.disableRotation(); // disable map rotation using touch rotation gesture

  // center the map on all road trip routes
  var bounds = new mapboxgl.LngLatBounds();
  for (let i = 0; i < allTrips.length; i++) {
    for (let j = 0; j < allTrips[i].preroute.features.length; j++) {
      var feature = allTrips[i].preroute.features[j];
      bounds.extend(feature.geometry.coordinates);
    }
  }
  map.fitBounds(bounds, { padding: 120 }); // inner margin for markers

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
            "line-width": 2,
            "line-color": "#575a6b"
          },
          layout: {
            "line-cap": "round",
            "line-join": "round"
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
          "circle-stroke-color": "#575a6b"
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
          "icon-image": "pin-aa",
          "icon-size": 1,
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
        // take first paragraph of description if multiple
        if (typeof poiContent.description === "object") {
          var poiDescription = poiContent.description[0];
        } else {
          var poiDescription = poiContent.description;
        }
        // limit description character length
        var poiDescriptionLimited = poiDescription.substring(0, 155) + "...";
        var description =
          '<div class="bg-black bg-ratio bg-ratio--3-2" style="background-image:url(\'' +
          imgPath +
          "/content/" +
          thisTripId +
          "/" +
          poiId +
          '.jpg\')"><a href="' +
          tripLink +
          "#" +
          poiId +
          '" class="absolute top-0 left-0 right-0 bottom-0"></a></div><div class="p-6"><h3 class="h5">' +
          poiContent.title +
          '</h3><p class="text-sm leading-loose pt-1">' +
          poiDescriptionLimited +
          ' <a href="' +
          tripLink +
          "#" +
          poiId +
          '" class="text-primary-400 underline">Read More</a></p><div class="h-3"></div><a href="' +
          tripLink +
          '" class="btn btn--sm">See the full trip</a></div>';
        new mapboxgl.Popup({
          focusAfterOpen: false,
          anchor: "bottom"
        })
          .setLngLat(coordinates)
          .setHTML(description)
          .setMaxWidth("360px")
          .addTo(map);
      });
    }
    /////////////////////////////////////////////////////////dd se offers to map
    var spreadsheetID = "14g1IiRy-0A3yFke6WRhvB_AOn_bNVESIDasUVcc93PM"; // ID of Google Spreadsheet
    var apiKey = "AIzaSyBww8fHIRizAYPWsYyNGcRvLvzTLvvKmkw"; // API key for accessing G Sheet
    var sheetName = "UK - map";
    $.ajax({
      method: "GET",
      url:
        "https://sheets.googleapis.com/v4/spreadsheets/" +
        spreadsheetID +
        "/values/" +
        sheetName +
        "!A3:Z?&key=" +
        apiKey
    }).done(function (data) {
      // create geojson object
      var seOffersGeojson = {
        type: "FeatureCollection",
        features: []
      };
      // add map pin for each SE offer
      for (var i = 0; i < data.values.length; i++) {
        var offer = data.values[i];
        seOffersGeojson.features.push({
          type: "Feature",
          properties: {
            id: offer[0],
            title: offer[1],
            location: offer[2],
            price: offer[3],
            priceDescription: offer[4],
            saving: offer[5],
            image: offer[7],
            link: offer[6]
          },
          geometry: {
            type: "Point",
            coordinates: [offer[10], offer[9]]
          }
        });
      }
      // add se offer layer to map, below POIs & only at certain zoom level
      map.addLayer(
        {
          id: "se-offers",
          type: "symbol",
          source: {
            type: "geojson",
            data: seOffersGeojson
          },
          layout: {
            "icon-image": "pin-se",
            "icon-size": 0.7,
            "icon-anchor": "bottom",
            "icon-allow-overlap": true
          },
          minzoom: 8
        },
        "country-label"
      );
      ///////////////////////////////////////////////////////// offer card popup
      map.on("click", "se-offers", function (e) {
        var coordinates = e.features[0].geometry.coordinates.slice();
        var offer = e.features[0].properties;
        var description =
          '<div class="offer-card"><div class="image bg-ratio bg-ratio--3-2" style="background-image: url(\'' +
          offer.image +
          '\')" ></div><div class="content"><div class="location">' +
          offer.location +
          '</div><div class="title">' +
          offer.title +
          '</div><div class="bottom"><div class="left"><div class="price"><div>From <span>£' +
          offer.price +
          "</span></div><div>" +
          offer.priceDescription +
          '</div></div></div><div class="right"><div class="saving">Up to <span>-' +
          offer.saving +
          '%</span></div></div></div></div><a class="link" href="' +
          offer.link +
          '"></a></div>';
        new mapboxgl.Popup({
          focusAfterOpen: false
        })
          .setLngLat(coordinates)
          .setHTML(description)
          .setMaxWidth("360px")
          .addTo(map);
      });
    });
  });
}

// load map on page load
map();

// reveal map
$(".js-open-map").on("click", function (e) {
  e.preventDefault();
  $(".js-map-cover").fadeOut(500);
});
