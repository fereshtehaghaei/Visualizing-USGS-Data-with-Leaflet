// // Creating map object
// var myMap = L.map("map", {
//     center:[38.0902, -96.7129],
//     zoom: 5,
//   });
  
//Adding Gray Tile Layer to the map
  var grayscaleLayer = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: API_KEY
  });
 

//Adding Satellite Tile Layer to the map
var satelliteLayer = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
});


//Adding Outdoors Tile Layer to the map
var outdoorsLayer = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "outdoors-v11",
  accessToken: API_KEY
});

// Initialize all of the LayerGroups we'll be using
var layers = {
    EARTHQUAKES: new L.LayerGroup(),
    TECTONIC_PLATES: new L.LayerGroup(),
    GRAYSCALE: new L.LayerGroup(),
    SATELLITE: new L.LayerGroup(),
    OUTDOORS: new L.LayerGroup()

};



// Create the map with our layers, passing satelliteLayer & earthquakes as our default layer to display once page loads

var myMap = L.map("map", {
    center:[38.0902, -96.7129],
    zoom: 4,
    layers: [
        satelliteLayer, 
        layers.EARTHQUAKES,
    ]
});


// Create Overlays to hold overlays that may be toggled on or off on map
var overlays = {
    "Earthquakes" : layers.EARTHQUAKES,
    "Tectonic Plates" : layers.TECTONIC_PLATES
};


// Define baseMaps Object to Hold Base Layers & Only one base layer can be shown at a time
var baseMaps = {
    "Satellite": satelliteLayer,
    "Grayscale": grayscaleLayer,
    "Outdoors": outdoorsLayer
};

// Create a Control for our Layers & Pass in baseMaps and overlays then Add the Layer Control to the Map
L.control.layers(baseMaps, overlays, {collapsed: true,}).addTo(myMap);

// =========================
// Load in GeoJson datas
// =========================
 // Earthquakes GeoJson URL Variables
var earthquakesUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Tectonic Plates GeoJson URL Variables
var tectonicPlatesUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

d3.json(tectonicPlatesUrl, function(platesData) {
    
    console.log(platesData);

    L.geoJson(platesData.features, {
                color: "#DC143C",
                weight: 3
    
    }).addTo(layers.TECTONIC_PLATES).addTo(myMap);
    
});
  
  //====== <<Function>> === for Grabbing Data with d3 === <<Begins>> ========
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
  
        return magnitude * 4;
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
  
  
    }).addTo(layers.EARTHQUAKES).addTo(myMap);
  
    function getColor(d) {
      return d > 90 ? '#d7301f' :
             d > 70  ? '#ec7014' :
             d > 50  ? '#fad410' :
             d > 30  ? '#fec44f' : 
             d > 10   ? '#92fd1c' :
             d > -10   ? '#98F42F' :
                        '#AEC6F9';
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