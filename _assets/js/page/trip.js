// set current trip variables
var currentTripId = $("#map").data("trip-id");
var currentTrip = eval(currentTripId);
var tripId = currentTrip.id;
var route = currentTrip.route.features[0].geometry;
var routeStart = route.coordinates[0];
var routeEnd = route.coordinates.pop();

// create map object with settings
mapboxgl.accessToken =
  "pk.eyJ1IjoiaGFtaXNoamdyYXkiLCJhIjoiY2pkbjBmeGN6MDd1YzMzbXI3cWdpNThjayJ9.3YE8T1H2QUyqNIkxdKWxkg";
var tripMap = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/hamishjgray/cjmkjea7r1apf2rrsneiy7sxa",
  logoPosition: "bottom-right",
  zoom: 4.5,
  minZoom: 4.5, // stops zooming out too far
  center: [-2.36967, 54.237933]
});

// center the map on the entire route line
var bounds = new mapboxgl.LngLatBounds();
currentTrip.preroute.features.forEach(function (feature) {
  bounds.extend(feature.geometry.coordinates);
});
tripMap.fitBounds(bounds, { padding: 42 }); // inner margin for markers

// init map - happens on page load
function makeMap(map) {
  map.dragRotate.disable(); // disable map rotation using right click + drag
  map.touchZoomRotate.disableRotation(); // disable map rotation using touch rotation gesture
  map.on("load", function () {
    ///////////////////////////////////////////////////////////// add route line
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
    ////////////////////////////////////////////////////// add route start + end
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
    //////////////////////////////////////////////////////////// add POI markers
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
    ///////////////////////////////////////////// click to scroll to POI content
    map.on("click", tripId + "-pois", function (e) {
      // smooth scroll to stop on page
      var el = $("#" + e.features[0].properties.id);
      var elHeight = el.height();
      var viewportHeight = $(window).height();
      // check if there is enough viewport space to center element
      if (elHeight < viewportHeight) {
        // show in center of viewport
        var elScrollPosition =
          el.offset().top - (viewportHeight - elHeight) / 2;
      } else {
        // show at top of viewport
        var elScrollPosition = el.offset().top;
      }
      // scroll to POI content
      $("html, body").animate({ scrollTop: elScrollPosition }, 500);
      currentSection = e.features[0].properties.id; // update current marker
      focusOnMarker(currentSection); // focus map on this marker
    });
    ///////////////////////////////////////////////// focus POI marker on scroll
    var currentSection = "";
    // create scroll markers for each POI
    $(".js-trip-stop").each(function () {
      // create scrollmagic scene
      new ScrollMagic.Scene({
        duration: $(this).outerHeight(), // pixel amount that event should trigger
        triggerElement: $(this)[0] // element that triggers event
      })
        .on(
          "enter", // when new section is entered, update state and focus marker
          function () {
            var sectionId = this.triggerElement().id;
            if (currentSection !== sectionId) {
              currentSection = sectionId; // update currentSection
              mapFocus(currentSection); // focus map on this marker
            }
          }
        )
        .addTo(controller); // adds scene to page
    });
  });
}

////////////////////////////////////////////////////////// load map on page load
makeMap(tripMap);

///////////////////////////////////////////////////// focus on single POI marker
var mapFocus = debounce(function (markerId) {
  focusOnMarker(markerId);
}, 500);

// find poi coordinates by id
function focusOnMarker(markerId) {
  for (let i = 0; i < currentTrip.pois.features.length; i++) {
    if (currentTrip.pois.features[i].properties.id === markerId) {
      // focus map view onto POI marker
      tripMap.flyTo({
        curve: 1, // limits the zooming in and out of animation
        maxDuration: 2500, // limit reall slow animations
        center: currentTrip.pois.features[i].geometry.coordinates,
        zoom: 10.5
      });
      break; // only need to find first instance
    }
  }
}

///////////////////////////////////////////////////////////////////// sticky map

// init scrollMagic
var controller = new ScrollMagic.Controller(); // Controller({ addIndicators: true }) // this + plugin visualises triggers
var tripContentHeight =
  $(".js-trip-content").outerHeight() - $(window).height();

// create a scrollMagic scene
new ScrollMagic.Scene({
  duration: tripContentHeight, // pixel amount that element should be sticky for
  triggerElement: ".js-trip-content", // element that triggers sticky
  triggerHook: "onLeave" // scroll position from top of viewport, not center
})
  .setPin(".js-sticky-map") // makes this element sticky
  .addTo(controller); // init this scene
