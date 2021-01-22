// Creating map object
var myMap = L.map("map", {
  center:[38.0902, -96.7129],
  zoom: 5,
});

// Adding Gray Scale Tile layer to the map
var grayscale = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/light-v10",
  accessToken: API_KEY
}).addTo(myMap);



// Load in GeoJson data
var earthquakesUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


d3.json(earthquakesUrl, function(earthData) {
    
  console.log(earthData);

  // Function to Determine Color of circle Based on the Magnitude of the Earthquake
  function markerColor(magnitude) {

    switch(true) {
      case magnitude <= 1:
           return "#51ef24";

      case magnitude <= 2:
           return "#b3de69";

      case magnitude <= 3:
           return "#fec44f";

      case magnitude <= 4:
           return "#ec7014";

     case magnitude <= 5:
          return "#d7301f";

      default:
        return "#b30000";
      }

}

  // Function to Determine Size of Marker Based on the Magnitude of the Earthquake
  // Preventing the error from happening for those magnitude that are = Zero
  function markerSize(magnitude){

      if (magnitude === 0)
        {
          return 1;
        }

      return magnitude * 5;
}

  function styleInfo(feature) {
      return {
          radius: markerSize(feature.properties.mag),
          fillColor: markerColor(feature.properties.mag),
          color: '#fff', // border color
          weight: .5,
          opacity: 1,
          fillOpacity: .7,
          stroke: true,
        };

  }

  // Marks the circles on map
  L.geoJson(earthData, { 

    pointToLayer: function(feature, latlng){
      //console.log(latlng);
        return L.circleMarker(latlng);
    },
    style : styleInfo,

    onEachFeature: function(feature, layer) {
      layer.bindPopup("<h3> Location: <br></h3>" + feature.properties.place + "<hr><p>" +
                      "<h3> Date: <br></h3>"+ new Date(feature.properties.time) + "<hr><p>" +
                      "<h3>Magnitude: <br></h3>" + feature.properties.mag + "</p>");
                    }


  }).addTo(myMap);

  function getColor(d) {
    return d > 90 ? '#b10026' :
           d > 70 ? '#e31a1c' :
           d > 50 ? '#fb7f6f' :
           d > 30 ? '#f9b748' : 
           d > 10 ? '#ddff51' :
                    '#a0f815';
}

  var legend = L.control({position: 'bottomright'});
  legend.onAdd = function (map) {
  
  var div = L.DomUtil.create('div', 'info legend');
  labels = [],
  levels = [-10, 10, 30, 50, 70, 90];
  
  for (var i = 0; i < levels.length; i++) 
    {
    div.innerHTML += 
    '<i style="background:' + getColor(levels[i] + 1) + '"></i> ' + levels[i] + (levels[i + 1] ? '&ndash;' + levels[i + 1] + '<br>' : '+');
    }
    return div;
    };
  legend.addTo(myMap)


})

