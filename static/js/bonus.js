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
L.control.layers(baseMaps, overlays, {collapsed: false,}).addTo(myMap);

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
    
    }).addTo(layers.EARTHQUAKES).addTo(myMap);
    
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
  //====== <<Function>> === for Grabbing Data with d3 === <<Ends>> ========
  
  
  // earthData.forEach(item => {
  
  //   var mark_color = "";
  
  //       if (item.mag > 3)
  //       {
  //         mark_color ="yellow"
  //       }
  
  //   L.circle(item.place, {
  //     fillOpacity: 0.75,
  //     color: "white",
  //     fillColor: mark_color,
  //     radius: markerSize(item.mg)
  //   }).bindPopup("<h3> Location: " + feature.properties.place +
  //           "</h3><hr><p>" + new Date(feature.properties.time) + 
  //           "</p><hr><p>Magnitude: " + feature.properties.mag + "</p>"); 
  
  // })
  
  // function markerSize(magnitude) {
  //   return magnitude * 3;
  // }
  
  
  
  //   // Create a new choropleth layer with Retrieved Data
  //   geojson = L.circle(response, {
     
  
    //Passing in our style object
      //style: geojson,  
  
    // // Define what  property in the features to use
    //   valueProperty: "mag", // which property in the features to use
      
    // // Set color scale
    //   scale: ["#ffffb2", "#b10026"],
      
    // // Number of breaks in step range
    //   steps: 5,
      
    // // q for quartile, e for equidistant, k for k-means
    //   mode: 'q',
  
      
  //   // Binding a pop-up to each layer
  //   	onEachFeature: function(feature, layer) {
  //         L.circle(properties.mag, {
  //           fillOpacity: .5,
  //           color:'red',
  //           fillcolor:'yellow',
  //           radius: markerSize(feature.properties.mag)
  //         })
  //         layer.bindPopup("<h3> Location: " + feature.properties.place +
  //         "</h3><hr><p>" + new Date(feature.properties.time) + 
  //         "</p><hr><p>Magnitude: " + feature.properties.mag + "</p>");
  // 	  }
  
  // // Adding legend to the map
  // }).addTo(myMap);
  
    
  //  // Set up the legend 
  // // Add legend (don't forget to add the CSS from index.html)
  // var legend = L.control({ position: 'bottomleft' });
  // legend.onAdd = function () {
  //   var div = L.DomUtil.create('div', 'info legend');
  //   var limits = geoJson.options.limits;
  //   var colors = geoJson.options.colors;
  //   var labels = [];
  
  //   // Add min & max
  //   div.innerHTML = "<h1>Magnitudes</h1>" +
  //   "<div class=\"labels\">" +
  //     "<div class=\"min\">" + limits[0] + "</div>" +
  //     "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
  //   "</div>";
  
  
  //   limits.forEach(function (limit, index) {
  //     labels.push('<li style="background-color: ' + colors[index] + '"></li>');
  //     console.log(limit);
  //     console.log(colors);
  //   });
  
  
  //   div.innerHTML += '<ul>' + labels.join("") + '</ul>';
  //   return div;
  
  
  // };
  // // Adding Legend to Map
  // legend.addTo(myMap);
  
  
  
  
  // // // =============================== Beginning of 3 Tile Layers | satellite | gray | outdoors | ================================
  
  // // // Define variables for our tile layers
  // // var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  // //   attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  // //   maxZoom: 18,
  // //   id: "mapbox.satellite",
  // //   accessToken: API_KEY
  // // });
  
  // // var grayscale = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  // //   attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  // //   maxZoom: 18,
  // //   id: "mapbox.light",
  // //   accessToken: API_KEY
  // // });
  
  // // var outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  // //   attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  // //   maxZoom: 18,
  // //   id: "mapbox.outdoors",
  // //   accessToken: API_KEY
  // // });
  
  // // // // ================================ End of  3 Tile Layers | satellite | gray | outdoors | ================================
  
  // // // // Only one base layer can be shown at a time
  // // // var baseMaps = {
  // // //     "Satellite": satellite,
  // // //     "Grayscale": grayscale,
  // // //     "Outdoors": outdoors
  // // //   };
  
  // // // // Overlays that may be toggled on or off
  // // // var overlayMaps = {
  // // //     "Tectonic Plates": tectonics,
  // // //     "Earthquakes": earthquakes
  // // //   };
  
  
  // // //   var myMap = L.map("map", {
  // // //     center: [
  // // //     37.09, -95.71
  // // //     ],
  // // //     zoom: 4,
  // // //     layers: [satellite, earthquakes]
  // // // });
  
  
  
  
  // // // // // Use this link to get the geojson data
  // // // // var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
  
  // // // // var geojson;
  
  // // // Perform a GET request to the earthquakesURL
  // // d3.json(earthquakesUrl, function(data) {
      
  // //     //console.log(data)
  
  // //     createFeatures(data.features);
  // //   });
  
  // // function createFeatures(earthquakeData,) {
  
      
  
  // //     function onEachFeature(feature, layer) {
        
  // //           layer.bindPopup("<h3> Location: " + feature.properties.place +
  // //                           "</h3><hr><p>" + new Date(feature.properties.time) + 
  // //                           "</p><hr><p>Magnitude: " + feature.properties.mag + "</p>");
  // //     }
  
  // //     var earthquakes = L.geoJSON(earthquakeData, {
  // //         onEachFeature: onEachFeature
  // //       });
  
      
  // //       // Sending our earthquakes layer to the createMap function
  // //       createMap(earthquakes);
  
  // // }
  
  
  
  // // // Perform a GET request to the tectonicUrl
  // // d3.json(tectonicUrl, function(datap) {
      
      
  // //     console.log(datap)
  
  // //     createFeatures(datap.coordinates);
  // //   });
  
  // // // function createFeatures(tectonicData,) {
  
      
  
  // // //     function onEachFeature(feature, layer) {
        
  // // //           layer.bindPopup("<h3> Location: " + feature.properties.place +
  // // //                           "</h3><hr><p>" + new Date(feature.properties.time) + 
  // // //                           "</p><hr><p>Magnitude: " + feature.properties.mag + "</p>");
  // // //     }
  
  // // //     var tectonics = L.geoJSON(tectonicData, {
          
  // // //         onEachFeature: onEachFeature
  // // //       });
      
  // // //       // Sending our earthquakes layer to the createMap function
  // // //       createMap(tectonics);
  
  // // // }
  
  
  
  
  // // function createMap(earthquakes) {
  
  // //     // Define variables for our tile layers
  // //     var satellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  // //         attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  // //     maxZoom: 18,
  // //     id: "mapbox.satellite",
  // //     accessToken: API_KEY
  // //     });
  
  // //     var grayscale = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  // //         attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  // //     maxZoom: 18,
  // //     id: "mapbox.light",
  // //     accessToken: API_KEY
  // //     });
  
  // //     var outdoors = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  // //         attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  // //     maxZoom: 18,
  // //     id: "mapbox.outdoors",
  // //     accessToken: API_KEY
  // //     });
  
  // //     // Only one base layer can be shown at a time
  // //     var baseMaps = {
  // //         "Satellite": satellite,
  // //         "Grayscale": grayscale,
  // //         "Outdoors": outdoors
  // //     };
  
  // //     // Overlays that may be toggled on or off
  // //     var overlayMaps = {
  // //         "Tectonic Plates": tectonics,
  // //         "Earthquakes": earthquakes
  // //     };
  
  // //     //   var overlayMaps = {
  // //     //     Earthquakes: earthquakes
  // //     //   };
  
  // //     var myMap = L.map("map", {
  // //         center: [
  // //         37.09, -95.71
  // //         ],
  // //         zoom: 4,
  // //         layers: [satellite, earthquakes]
  // //     });
  
  
  // //     L.control.layers(baseMaps, overlayMaps, {
  // //         collapsed: false
  // //     }).addTo(myMap);
  
  
  // // // Set up the legend 
  // // // Add legend (don't forget to add the CSS from index.html)
  // // var legend = L.control({ position: 'bottomleft' });
  
  // // legend.onAdd = function () {
  // //   var div = L.DomUtil.create('div', 'info legend');
  // //   var limits = earthquakes.options.limits;
  // //   var colors = earthquakes.options.colors;
  // //   var labels = [];
  
  // //   // Add min & max
  // // //   div.innerHTML = "<h1>Median Income</h1>" +
  // // //   "<div class=\"labels\">" +
  // // //     "<div class=\"min\">" + limits[0] + "</div>" +
  // // //     "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
  // // //   "</div>";
     
  
  // // //   limits.forEach(function (limit, index) {
  // // //     labels.push('<li style="background-color: ' + colors[index] + '"></li>');
  // // //     console.log(limit);
  // // //     console.log(colors);
  // // //   });
  
  
  // //   div.innerHTML += '<ul>' + labels.join("") + '</ul>';
  // //   return div;
  
  
  // // };
  // // // Adding Legend to Map
  // // legend.addTo(myMap);
  
  
  // // }
  
  
  