////////////////////////////////////////////////////////////////////////////////
// route geojson generator
////////////////////////////////////////////////////////////////////////////////

// rather than call the mapbox API on every page load, use this snippet in
// overview.js to get the response data. Then copy this into the map data js
// file for each trip.

// This code doesn't get run on the final site, just for build / data entry

// change trip id here
var trip = tripOne;

mapboxgl.accessToken =
  "pk.eyJ1IjoiaGFtaXNoamdyYXkiLCJhIjoiY2pkbjBmeGN6MDd1YzMzbXI3cWdpNThjayJ9.3YE8T1H2QUyqNIkxdKWxkg";
// get the stops for the route into one string
var coordString = [];
var coord;
var total = trip.preroute.features.length;
for (var i in trip.preroute.features) {
  if (i == total - 1) {
    coord = trip.preroute.features[i].geometry.coordinates;
  } else {
    coord = trip.preroute.features[i].geometry.coordinates + ";";
  }
  coordString += coord;
}
// get the URL request to get all of the live route data from mapbox
console.log(
  "https://api.mapbox.com/directions/v5/mapbox/driving/" +
    coordString +
    "?overview=full&geometries=geojson&access_token=" +
    mapboxgl.accessToken
);
