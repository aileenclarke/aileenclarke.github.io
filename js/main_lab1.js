//declare map variable globally so all functions have access
var map;
var dataStats = {};  


//step 1 create map
function createMap(){
    
    //create the map
    map = L.map('map', {
        center: [22.22,-97],
        zoom: 5,
        // set zoom level constraints
        minZoom: 5,
        maxZoom: 9,
        // set panning constraint
        maxBounds:[
            [33,-125],
            [13,-75]
        ]     
    });

    //add custom base map from mapbox
    L.tileLayer('https://api.mapbox.com/styles/v1/amclarke2/cl0g3m8oh000h14n0ok1oan43/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYW1jbGFya2UyIiwiYSI6ImNrczZtNjkwdjAwZngycW56YW56cHUxaGsifQ._Cc2V5nKC5p2zfrYqw7Aww', { 
        attribution: '&copy <a href="https://www.mapbox.com/map-feedback/">Mapbox</a> &copy <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    //call getData function
    getData(map);
};

// Calculate statistics of the dataset
function calcStats(data){
    //create empty array to store all data values
    var allValues = [];
    //loop through each state
    for(var state of data.features){
        //loop through each year
        for(var year = 1985; year <= 2017; year+=1){
              //get population for current year
              var value = state.properties["Pop_"+ String(year)];
              //add value to array
              if (value && value > 0){
                allValues.push(Number(value));
              }
        }
    }
    //get min, mean, max states for our array.
    dataStats.min = Math.min(...allValues);
    dataStats.max = Math.max(...allValues);
    dataStats.mid = 18
    /// tktk reduce
    var sum = allValues.reduce(function (a, b) {
        return a + b;
      });
      dataStats.mean = sum / allValues.length;

}

//calculate the radius of each proportional symbol
function calcPropRadius(attValue) {
    //constant factor adjusts symbol sizes evenly
    // if attValue exists and is greater than 0 return calculated radius, else return 1
    if (attValue && attValue > 0){
        var minRadius = 5;
        //Flannery Apperance Compensation formula *can change coefficient
        var radius = .5 * Math.pow(attValue/dataStats.min,0.5715) * minRadius

        return radius;
    } else {
        return 1
    };

};

/*
// consolidated popup content creation
function createPopupContent(properties,attribute){
    var popupContent = "<p><b>State:</b> " + properties.State + "</p>";

    var year = attribute.split("_")[1];
    popupContent += "<p><b>Rate of Femicide in " + year + ":</b> " + properties[attribute] + " per 100,000 women.";
};
*/

// popup content constructor
function PopupContent(properties, attribute){
    this.properties = properties;
    this.attribute = attribute;
    this.year = attribute.split("_")[1];
    this.rate = this.properties[attribute];
    this.formatted = "<p><b>State:</b> " + this.properties.State + "</p><p><b>Rate of Femicide in " + this.year + ":</b> " + this.rate + " per 100,000 women.</p>";

};


// function to convert each feature to a marker with a popup 
function pointToLayer(feature, latlng, attributes){
    //set var attribute as value of attribute at index 0
    var attribute = attributes[0];

    var options = {
        fillColor: "#AAAA00",
        color: "#666633",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };

    // determine the feature's numeric value of the selected attribute
    var attValue = Number(feature.properties[attribute]);

    // set the circle's radius based on the calcPropRadius output 
    //(the radius of each proportional symbol)
    options.radius = calcPropRadius(attValue);

    // instantiate a circle marker at latlng and refer to options above to format
    var layer = L.circleMarker(latlng,options);

    //var popupContent = createPopupContent(feature.properties,attribute);
    var popupContent = new PopupContent(feature.properties, attribute)

    // bind the pop up to the circle marker
    // popupContent.formatted is the popup content and offset is option that sets popup position
    layer.bindPopup(popupContent.formatted, {
        // tktk don't understand offset
        offset: new L.Point(0,-options.radius)
    });

    // tktk return the circle marker to the L.geoJson pointToLayer option
    return layer;
};

//  create proportional symbol geojson layer made of outputs from pointToLayer
function createPropSymbols(data, attributes){
    //create a Leaflet GeoJSON layer
    L.geoJson(data, {
        // tktk don't understand this
        pointToLayer: function(feature, latlng){
            return pointToLayer(feature, latlng, attributes);
        }
    }).addTo(map);
};

// Resize proportional symbols according to new attribute value
function updatePropSymbols(attribute){
    var year = attribute.split("_")[1];
    
    //update temporal legend
    // tktktk
    document.querySelector("span.year").innerHTML = year;
    
    // iterate over each map layer 
    map.eachLayer(function(layer){
        // check if there is a feature and the feature has an attribute
        if (layer.feature && layer.feature.properties[attribute]){
            // access feature properties and set as props
            var props = layer.feature.properties;

            // update feature radius by calling calcPropRadius on the current attribute value
            var radius = calcPropRadius(props[attribute]);
            layer.setRadius(radius);

            // set new instance of Popupcontent of the current feature/attribute as variable
            //var popupContent = createPopupContent(props,attribute);
            var popupContent = new PopupContent(props, attribute);
            
            // update popup content
            /// tktk 
            popup = layer.getPopup();
            popup.setContent(popupContent.formatted).update();
        };
    });

    //updateLegend(attribute);
};

// Build attribute array from data
function processData(data){
    
    // empty array to hold attributes
    var attributes = []

    // properties of the first feature in the dataset
    var properties = data.features[0].properties;

    // push each attribute name into attribute array
    // for each attribute the properties of the first feature th
    for (var attribute in properties){
        // if "pop" is in the key, push the attribute into the array attributes
        if (attribute.indexOf("Pop") > -1){
            attributes.push(attribute);
        };
    };

    return attributes;
};

//Create new sequence controls
function createSequenceControls(attributes){   
    
    //extend the base class L.Control to control positioning of sequence
    var SequenceControl = L.Control.extend({
        options: {
            position: 'bottomleft'
        },

        // onAdd should contain code that creates DOM elements for the layer, adds them to map, and creates listeners        
        onAdd: function(){
            // create the control container div name sequence-control-container
            var container = L.DomUtil.create('div', 'sequence-control-container');

            //create step buttons and add them to container (which holds div named sequence-control-container) 
            container.insertAdjacentHTML('beforeend', '<button class="step" id="reverse" title="Reverse"><img src="img/reverse.png"></button>');
            container.insertAdjacentHTML('beforeend', '<button class="step" id="forward" title="Forward"><img src="img/forward.png"></button>');

            //create range input element with class name range-slider and add them to container (which holds div named sequence-control-container)
            container.insertAdjacentHTML('beforeend', '<input class="range-slider" type="range">') 

            // disable any mouse event listeners for the container
            // tktktk why?
            L.DomEvent.disableClickPropagation(container);


            return container;

        }
    });

    map.addControl(new SequenceControl());

    //set slider attributes
    document.querySelector(".range-slider").max = 32;
    document.querySelector(".range-slider").min = 0;
    document.querySelector(".range-slider").value = 0;
    document.querySelector(".range-slider").step = 1;

    // select each step and save as a variable
    var steps = document.querySelectorAll('.step');

    // loop with each individual step as the parameter
    steps.forEach(function(step){
        // add a click event listener to each step
        step.addEventListener("click", function(){
            // obtain current index 
            var index = document.querySelector('.range-slider').value;
            // increment or decrement index depending on button clicked
            // if the step's id is forward, increment index 
            if (step.id == 'forward'){
                index++;
                // if past the last attribute, wrap around to first attribute
                index = index > 32 ? 0 : index;
            // if the step's id is reverse, decrement index 
            } else if (step.id == 'reverse'){
                index--;
                // if past the first attribute, wrap around to last attribute
                index = index < 0 ? 32 : index;
            };

            // update the current value of the range-slider to the index
            document.querySelector('.range-slider').value = index;

            // reassign the current attribute based on the new index
            updatePropSymbols(attributes[index]);
        })
    })

    // add input event listener to .range-slider that fires when slider thumb moved or clicks
    document.querySelector('.range-slider').addEventListener('input', function(){
        // get the new index value
        // this references the element that fired the event and value retrieves the slider's current value
        var index = this.value;

        // reassigns the current attribute based on the new index (passes new attribute to update symbols)
        // tktk why are we calling it twice?
        updatePropSymbols(attributes[index]);
    });

};

// create legend
function createLegend(attributes){
    // extend the control for the legend
    var LegendControl = L.Control.extend({
        options:{
            position: 'bottomright'
        },

        // onAdd contains code that creates DOM elements, adds them to map, and puts listeners on relevant map events
        onAdd: function(){
            // create control container div named legend-control-container
            var container = L.DomUtil.create('div','legend-control-container');

            // set the html content of the container 
            container.innerHTML = '<div class="temporalLegend">Rate of Femicide per 100,000 Female<br>Deaths in <b><span class="year">1985</b></span></div>';

            // start attribute legend svg string
            var svg = '<svg id="attribute-legend" width="160px" height="100px">';

            // create array of circle names on which to base loop
            var circles = ["max", "mid", "mean", "min"];
            
            // loop to add each circle and text to svg string
            for (var i=0; i<circles.length; i++){

                // assign r and cy attributes
                var radius = calcPropRadius(dataStats[circles[i]]);
                var cy = 99 - radius
                var cx = 30

                //circle string
                svg += 
                    '<circle class="legend-circle" id="' + circles[i] +
                    '" r="' + radius +
                    '"cy="' + cy +
                    '" fill="#AAAA00" fill-opacity="0.8" stroke="#666633" cx="50"/>'; 
            
                //evenly space out labels            
                var textY = i * 23 + 27

                //text string
                svg +=
                    '<text id="' +circles[i] +
                    '-text" x="110" y="' +textY +
                    '">' +
                    Math.round(dataStats[circles[i]] * 100) / 100 +
                    "</text>";
            
            };

            //close svg string
            svg += "</svg>";
        
            //add svg to legend-control-container
            container.insertAdjacentHTML('beforeend',svg);

            return container
        }
    
    });

    map.addControl(new LegendControl());
};

//Step 2: Import GeoJSON data
function getData(map){
    //load the data
    fetch("data/Femicides.geojson")
        .then(function(response){
            return response.json();
        })
        .then(function(json){
            var attributes = processData(json);
            calcStats(json);
            createPropSymbols(json, attributes);
            createSequenceControls(attributes);
            createLegend(attributes);
        })
};

document.addEventListener('DOMContentLoaded',createMap)