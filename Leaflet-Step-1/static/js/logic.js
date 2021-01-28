// Creating map object
var myMap = L.map("mapid", {
    center: [39.8283, -98.5795],
    zoom: 4
  });
  
  
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
   attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
   tileSize: 512,
   maxZoom: 18,
   zoomOffset: -1,
   id: "mapbox/streets-v11",
   accessToken: API_KEY
}).addTo(myMap);
  
// Use this link to get the geojson data.
  var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";
  

  

  // Grabbing our GeoJSON data..
  d3.json(link, function(response) {
    console.log(response)
    for (var i = 0; i < response.features.length; i++) {

        var color = "";
        var location = response.features[i].geometry;
        var props = response.features[i].properties;

        if (location.coordinates[2] > 90) {
            color = "#ff4000";
        }
        else if (location.coordinates[2] > 70) {
            color = "#ff8000";
        }
        else if (location.coordinates[2] > 50) {
            color = "#ffbf00";
        }
        else if (location.coordinates[2] > 30) {
            color = "#ffff00";
        }
        else if (location.coordinates[2] > 10) {
            color = "#bfff00";
        }
        else {
            color = "#80ff00";
        }

      
      //console.log(location);
      if (location) {
        
        L.circle([location.coordinates[1], location.coordinates[0]],{
            fillOpacity: 0.8,
            color: "black",
            weight: 1,
            fillColor: color,
            radius: location.coordinates[2]*5000
        }).bindPopup("<h1>" + props.place + "</h1> <hr> <h3>Magnitude: " + props.mag + "</h3>" + "<h3>Depth: " + location.coordinates[2] + " km</h3>")
        .addTo(myMap);
      }
    }
    
    
  }); 


  var myColors = ["#ff4000", "#ff8000", "#ffbf00", "#ffff00", "#bfff00","#80ff00"];
  var legend = L.control({ position: 'bottomright' });

  legend.onAdd = function () {

    var div = L.DomUtil.create('div', 'info legend');
    labels = ["<div style='background-color: lightgray'><strong>&nbsp&nbspDepth (km)&nbsp&nbsp</strong></div>"];
    categories = ['+90', ' 70-90',' 50-70',' 30-50',' 10-30','-10-10'];
    for (var i = 0; i < categories.length; i++) {
        div.innerHTML +=
            labels.push(
                '<li class="circle" style="background-color:' + myColors[i] + '">' + categories[i] + '</li> '
            );
    }
    div.innerHTML = '<ul style="list-style-type:none; text-align: center">' + labels.join('') + '</ul>'
    return div;
};
legend.addTo(myMap);