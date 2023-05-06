d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then
    (function(data){
    // console.log(data.features);
    createFeatures(data.features);
});

function createFeatures(earthquakeData)
{
    console.log(earthquakeData);

    function onEachFeature (feature,layer)
    {
        layer.bindPopup(
            `<center><h2>Place: ${feature.properties.place}</h2><hr><h3>Magnitude: ${feature.properties.mag}</h3></center>`
        )
    }

        function earthquakeDepth(depth)
        {switch(true){
            case (depth >90):
                return depth = "red";
            case (depth > 70):
                return depth = "orange";
            case (depth > 50):
                return depth = "lightorange";
            case (depth > 30):
                return depth = "yellow";
            case (depth > 10 ):
                return depth = "yellowgreen"
            default:  
                return depth = "lightgreen";
        }   
    
    }

        function calcRadius(mag){
            if (mag===0)
                return 1;
            else 
                return mag*5
        }

        function circleProperties(feature)
        {return{
               color:"green",
               fillColor: earthquakeDepth(feature.geometry.coordinates[2]),
                radius:calcRadius(feature.properties.mag),
                weight:1,
                fillOpacity:.3
            }
        };
            

    

    var earthquakes=L.geoJSON(earthquakeData,{
        onEachFeature: onEachFeature,
        pointToLayer: function (feature,latlng){return L.circleMarker(latlng)},
        style:circleProperties
    });

    createMap(earthquakes);
}

function createMap(earthquakes)
{
    var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
    
    var tiles={
        "Street Map":street,
        };

    var overlays={
        "Earthquake Data" : earthquakes
    };

    var myMap=L.map("map",
        {
            center:[37.0902, -95.7129],
            zoom:4,
            layers: [street, earthquakes]
        }
    );

    L.control.layers({},overlays,{
        collapsed:false
    }).addTo(myMap)

    var legend = L.control(
        {position: "bottomright"}
        ); 

        legend.onAdd=function() {
                var div= L.DomUtil.create("div","info legend");
                var depths= [-10,10,30,50,70,90];
                var colors= ["lightgreen","yellow","lightorange","orange",];
                    
                    
                    for (var i=0;i<depths.length;i++)
                    {   
                        div.innerHTML += "<i style='background: "
                            + colors[i] + "'></i> "
                            + depths[i]
                            + (depths[i + 1] ? "&ndash;" + depths[i + 1] + "<br>" : "+");
        };
                return div;
        };

        legend.addTo(myMap);
}



