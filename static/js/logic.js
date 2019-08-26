function createMap(earthquakeMarkers) {

  // Create the tile layer that will be the background of our map
  var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
    maxZoom: 10,
    id: "mapbox.light",
    accessToken: API_KEY
    });

    
  // Create the satellite layer that will be the background of our map
    var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
    maxZoom: 10,
    id: "satellite-v9",
    accessToken: API_KEY
    });

    
  // Create the outdoor layer that will be the background of our map
    var outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v11/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
    maxZoom: 10,
    id: "outdoors-v11",
    accessToken: API_KEY
    });


    // Create a baseMaps object to hold the basemap layers
    var baseMaps = {
        "Greyscale Map": lightmap,
        "Outdoor Map": outdoors,
        "Satellite Map": satellite 
    };

    // Create an overlayMaps object to hold the earthquake layer
    var overLayMaps = {
        "earthquakes": earthquakeMarkers
    };

    // Create the map object with options
    var map = L.map("map", {
        center: [32.918476, -117.138237],
        zoom: 4,
        layers: [lightmap, outdoors, satellite, earthquakeMarkers]
    })

    // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
    L.control.layers(baseMaps, overLayMaps, {
        collapsed: false
    }).addTo(map)

     // Create a legend to display information about our map
     var legend = L.control({
         position: "bottomright"
     });

     // When the layer control is added, insert a div with the class of "legend"
     legend.onAdd = function() {
        var div = L.DomUtil.create('div', 'legend');
            div.innerHTML += 
            ['<strong>Magnitude</strong><br><br><div class="square" style="background-color: #32CD32;"></div><div class="hello">0-1</div>',
             '<div class="square" style="background-color: #7CFC00;"></div><div class="hello">1-2</div>',
             '<div class="square" style="background-color: yellow;"></div><div class="hello">2-3</div>',
             '<div class="square" style="background-color: #FF8C00;"></div><div class="hello">3-4</div>',
             '<div class="square" style="background-color: red;"></div><div class="hello">4-5</div>'].join("<br><br>");
        return div;
        };

  legend.addTo(map);
  

}

function createMarkers(response) {
    console.log(response)
    // 
    var earthquakes = response.features;
  
    // Initialize an array to hold circle markers
    var earthquakeMarkers = [];
  
    // Loop through the earthquake array lat long
    for (var index = 0; index < earthquakes.length; index++) {
      var earthquake = earthquakes[index];
      // For each lat and long, create a circle and bind a popup with the location's name
      var earthquakeMarker = L.circle([earthquake.geometry.coordinates[1], earthquake.geometry.coordinates[0]],
        { color: "black", 
        weight:1, 
        fillOpacity:0.8, 
        fillColor: "red", 
        radius:20000*earthquake.properties.mag})
        .bindPopup("<h3>" + earthquake.properties.title + "<h3><h3>Magnitude: " + earthquake.properties.mag + "<h3>");
    
      var mag = earthquake.properties.mag;
      if (mag < 1){
        earthquakeMarker.
        setStyle({fillColor:"#32CD32"})
      }
      else if (mag < 2){
        earthquakeMarker.
        setStyle({fillColor:"#7CFC00"})
      }
      else if (mag < 3){
        earthquakeMarker.
        setStyle({fillColor:"yellow"})
      }
      else if (mag < 4){
        earthquakeMarker.
        setStyle({fillColor:"#FFD700"})
      }
      else if (mag < 5){
        earthquakeMarker.
        setStyle({fillColor:"#FF8C00"})
      }
      else{
        earthquakeMarker.
        setStyle({fillColor:"red"})
      }

  
      // Add the circle to the earthquakemarker array
      earthquakeMarkers.push(earthquakeMarker);
    }
  
    // Create a layer group made from the earthquake markers array, pass it into the createMap function
    createMap(L.layerGroup(earthquakeMarkers));
  }
  
  
  // Perform an API call to the USGS API to get lat long information. Call createMarkers when complete
  d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", createMarkers);
  