var tripFour = {
  id: "tripFour",
  ////////////////////////////////////////////////////////////////// POI markers
  pois: {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {
          id: "stopOne"
        },
        geometry: {
          type: "Point",
          coordinates: [0, 0]
        }
      },
      {
        type: "Feature",
        properties: {
          id: "hotelNameOne",
          type: "hotel"
        },
        geometry: {
          type: "Point",
          coordinates: [0, 0]
        }
      }
    ]
  },
  ///////////////////////////////////////////// route markers - pre API response
  preroute: {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {},
        geometry: {
          type: "Point",
          coordinates: [0, 0]
        }
      },
      {
        type: "Feature",
        properties: {},
        geometry: {
          type: "Point",
          coordinates: [0, 0]
        }
      }
    ]
  },
  ///////////////////////////////////////////////// route markers - API response
  route: {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: [] // add coords here
        }
      }
    ]
  }
};
