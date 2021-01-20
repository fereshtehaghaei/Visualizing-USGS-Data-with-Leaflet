// Use this link to get the geojson data
var earthquakesUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

var tectonicUrl = "https://github.com/fraxen/tectonicplates/blob/master/GeoJSON/PB2002_boundaries.json";

var earthquakes = L.layerGroup();
var tectonics = L.layerGroup();

// // =============================== Beginning of 3 Tile Layers | satellite | gray | outdoors | ================================

// // Define variables for our tile layers
// var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
//   attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
//   maxZoom: 18,
//   id: "mapbox.satellite",
//   accessToken: API_KEY
// });

// var grayscale = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
//   attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
//   maxZoom: 18,
//   id: "mapbox.light",
//   accessToken: API_KEY
// });

// var outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
//   attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
//   maxZoom: 18,
//   id: "mapbox.outdoors",
//   accessToken: API_KEY
// });

// // ================================ End of  3 Tile Layers | satellite | gray | outdoors | ================================

// // Only one base layer can be shown at a time
// var baseMaps = {
//     "Satellite": satellite,
//     "Grayscale": grayscale,
//     "Outdoors": outdoors
//   };

// // Overlays that may be toggled on or off
// var overlayMaps = {
//     "Tectonic Plates": tectonics,
//     "Earthquakes": earthquakes
//   };


//   var myMap = L.map("map", {
//     center: [
//     37.09, -95.71
//     ],
//     zoom: 4,
//     layers: [satellite, earthquakes]
// });




// // // Use this link to get the geojson data
// // var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// // var geojson;

// Perform a GET request to the query URL
d3.json(earthquakesUrl, function(data) {
    
    //console.log(data)

    createFeatures(data.features);
  });

function createFeatures(earthquakeData) {

    

    function onEachFeature(feature, layer) {
      layer.bindPopup("<h3> Location: " + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p><hr><p>Magnitude: " + feature.properties.mag + "</p>");
    }

    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature
      });
    
      // Sending our earthquakes layer to the createMap function
      createMap(earthquakes);

}

function createMap(earthquakes) {

    // Define variables for our tile layers
    var satellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
    });

    var grayscale = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
    });

    var outdoors = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.outdoors",
    accessToken: API_KEY
    });

    // Only one base layer can be shown at a time
    var baseMaps = {
        "Satellite": satellite,
        "Grayscale": grayscale,
        "Outdoors": outdoors
    };

    // Overlays that may be toggled on or off
    var overlayMaps = {
        "Tectonic Plates": tectonics,
        "Earthquakes": earthquakes
    };

    //   var overlayMaps = {
    //     Earthquakes: earthquakes
    //   };

    var myMap = L.map("map", {
        center: [
        37.09, -95.71
        ],
        zoom: 4,
        layers: [satellite, earthquakes]
    });


    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);


// Set up the legend 
// Add legend (don't forget to add the CSS from index.html)
var legend = L.control({ position: 'bottomleft' });

legend.onAdd = function () {
  var div = L.DomUtil.create('div', 'info legend');
  var limits = earthquakes.options.limits;
  var colors = earthquakes.options.colors;
  var labels = [];

  // Add min & max
//   div.innerHTML = "<h1>Median Income</h1>" +
//   "<div class=\"labels\">" +
//     "<div class=\"min\">" + limits[0] + "</div>" +
//     "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
//   "</div>";
   

//   limits.forEach(function (limit, index) {
//     labels.push('<li style="background-color: ' + colors[index] + '"></li>');
//     console.log(limit);
//     console.log(colors);
//   });


  div.innerHTML += '<ul>' + labels.join("") + '</ul>';
  return div;


};
// Adding Legend to Map
legend.addTo(myMap);


}


