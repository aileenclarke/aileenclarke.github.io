

// locator map
var locationMap;

// leaflet side-by-side
var sliderMap;

// explorable final map
var finalMap;

// IDA points layer
var IDApoints;

// location data for locator map
var locations;

//LOCATION MAP

// create location map
function createLocationMap(){
    locationMap = L.map('locationMap',{
        center: [39,-96],
        zoom: 5,
        maxZoom: 12,
        minZoom: 5,
        scrollWheelZoom: false,
        zoomControl: false});

    //add the basemap.
    L.tileLayer('https://api.mapbox.com/styles/v1/ajnovak/cl2grbrgj003o14mot9tnmwh1/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYWpub3ZhayIsImEiOiJja2dnMWJoYXkwd3hlMnlsN241MHU3aTdyIn0.YlwTqHjnT8sUrhr8vtkWjg', {
	    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	    subdomains: 'abcd',
    }).addTo(locationMap);   

    // add zoom and home buttons
    var zoomHome = L.Control.zoomHome({position:'bottomright'});
    zoomHome.addTo(locationMap);

    // create legend control holding svg legend and add to map
    var locLegend = L.Control.extend({
        options: {
            position: "bottomleft"
        },
        onAdd:function(){
            var locContainer = L.DomUtil.create('div','legend-control-container1');
            var svg = '<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 260 55"><defs><style>.d{letter-spacing:-.015em;}.e{font-size:9px;}.e,.f{fill:#0f1031;font-family:AstoriaSans-Roman, Astoria Sans;}.g{fill:url(#c);}.h{letter-spacing:-.01004em;}.i{letter-spacing:.02002em;}.j{letter-spacing:-.01998em;}.f{font-size:11px;}.k{letter-spacing:-.01997em;}</style><linearGradient id="c" x1="13.02934" y1="27.5" x2="246.97012" y2="27.5" gradientTransform="matrix(1, 0, 0, 1, 0, 0)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#0c1c2c"/><stop offset="1" stop-color="#f7f8e8"/></linearGradient></defs><g id="a"/><g id="b"><g><rect class="g" x="13.02934" y="18.11785" width="233.94077" height="18.7643"/><text class="f" transform="translate(99.91502 14.51568)"><tspan x="0" y="0">Visible S</tspan><tspan class="i" x="41.46924" y="0">t</tspan><tspan x="45.83643" y="0">a</tspan><tspan class="d" x="51.21533" y="0">r</tspan><tspan x="55.65918" y="0">s</tspan></text><text class="f" transform="translate(48.00135 48.13983)"><tspan x="0" y="0">Magnitude per Squa</tspan><tspan class="j" x="98.88916" y="0">r</tspan><tspan x="103.27832" y="0">e A</tspan><tspan class="j" x="119.96484" y="0">r</tspan><tspan x="124.354" y="0">csecond</tspan></text><text class="e" transform="translate(230.29321 15.03096)"><tspan class="h" x="0" y="0">L</tspan><tspan x="4.57178" y="0">ess</tspan></text><text class="e" transform="translate(13.02946 15.03084)"><tspan x="0" y="0">Mo</tspan><tspan class="k" x="12.93262" y="0">r</tspan><tspan x="16.52393" y="0">e</tspan></text><text class="e" transform="translate(225.65903 48.65596)"><tspan x="0" y="0">17.80</tspan></text><text class="e" transform="translate(13.02921 48.65584)"><tspan x="0" y="0">22.00</tspan></text></g></g></svg>'
            locContainer.insertAdjacentHTML('beforeend',svg)
            return locContainer;
        }
    });
    locationMap.addControl(new locLegend());
};


// get user location if user selects yes button
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(saveLocation);
    };
};

// set lat long if user denies location access or does not click either button
function noLocation() { 
    var lat = 39.71;
    var long = -105.06;
    locations = createArray(lat, long);
    scrollLocation(null, locations);
};

// set lat long if user allows location access
function saveLocation(position) {
    var lat = position.coords.latitude;
    var long = position.coords.longitude;
    locations = createArray(lat, long);
    scrollLocation(null, locations);
};

// array containing locations
function createArray(lat,long){
    var temp = [
        {
            id: "userLoc",
            location:[lat, long],
            zoom: 13
        },
        {
            id: "userCity",
            location:[lat, long],
            zoom: 9
        },
        {
            id: "US",
            location:[39,-96],
            zoom: 5,
        }
    ];
    return temp;
};

// function to trigger location prompt
function scrollLocation(){
    locations.forEach(function(item){
        locatorIsInPosition(item.id, item.location, item.zoom)
    });
};

function locatorIsInPosition(id, location, zoom){
    
    // get element and element's property 'top'
    var locText = document.getElementById(id);
    var rect = locText.getBoundingClientRect();
    y = rect.top;

    // set the top margin as a ratio of innerHeight
    var topMargin = window.innerHeight / 2;

    // call flyTo when top of element is halfway up innerHeight
    if ((y-topMargin) < 0 && y > 0){
        locationMap.flyTo(location, zoom, {
            animate: true,
            duration: 2 // in seconds
        });
    };
};

// SLIDER MAP

// function to create Slider map
function createSliderMap(){

    sliderMap = L.map('sliderMap',{
        center: [39,-96],
        zoom: 5,
        maxZoom: 12,
        minZoom: 5,
        scrollWheelZoom: false,
        zoomControl: false});

    // mapbox layer 1
    var layer1 = L.tileLayer('https://api.mapbox.com/styles/v1/ajnovak/cl2mu2v9u004615mz0p7u40yu/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYWpub3ZhayIsImEiOiJja2dnMWJoYXkwd3hlMnlsN241MHU3aTdyIn0.YlwTqHjnT8sUrhr8vtkWjg', { 
        attribution: '&copy <a href="https://www.mapbox.com/map-feedback/">Mapbox</a> &copy <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(sliderMap);

    // mapbox layer 2
    var layer2 = L.tileLayer('https://api.mapbox.com/styles/v1/ajnovak/cl2grbrgj003o14mot9tnmwh1/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYWpub3ZhayIsImEiOiJja2dnMWJoYXkwd3hlMnlsN241MHU3aTdyIn0.YlwTqHjnT8sUrhr8vtkWjg', { 
        attribution: '&copy <a href="https://www.mapbox.com/map-feedback/">Mapbox</a> &copy <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(sliderMap);

    // compare two layers on map
    L.control.sideBySide(layer1, layer2).addTo(sliderMap);
    
    // add zoom and home buttons
    var sliderZoomHome = L.Control.zoomHome({position:'bottomright'});
    sliderZoomHome.addTo(sliderMap);

    // create legend control holding svg legend and add to map
    var sliderLegend = L.Control.extend({
        options: {
            position: "bottomleft"
        },
        onAdd:function(){
            var sliderContainer = L.DomUtil.create('div','legend-control-container1');
            var svg = '<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 260 55"><defs><style>.d{letter-spacing:-.015em;}.e{font-size:9px;}.e,.f{fill:#0f1031;font-family:AstoriaSans-Roman, Astoria Sans;}.g{fill:url(#c);}.h{letter-spacing:-.01004em;}.i{letter-spacing:.02002em;}.j{letter-spacing:-.01998em;}.f{font-size:11px;}.k{letter-spacing:-.01997em;}</style><linearGradient id="c" x1="13.02934" y1="27.5" x2="246.97012" y2="27.5" gradientTransform="matrix(1, 0, 0, 1, 0, 0)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#0c1c2c"/><stop offset="1" stop-color="#f7f8e8"/></linearGradient></defs><g id="a"/><g id="b"><g><rect class="g" x="13.02934" y="18.11785" width="233.94077" height="18.7643"/><text class="f" transform="translate(99.91502 14.51568)"><tspan x="0" y="0">Visible S</tspan><tspan class="i" x="41.46924" y="0">t</tspan><tspan x="45.83643" y="0">a</tspan><tspan class="d" x="51.21533" y="0">r</tspan><tspan x="55.65918" y="0">s</tspan></text><text class="f" transform="translate(48.00135 48.13983)"><tspan x="0" y="0">Magnitude per Squa</tspan><tspan class="j" x="98.88916" y="0">r</tspan><tspan x="103.27832" y="0">e A</tspan><tspan class="j" x="119.96484" y="0">r</tspan><tspan x="124.354" y="0">csecond</tspan></text><text class="e" transform="translate(230.29321 15.03096)"><tspan class="h" x="0" y="0">L</tspan><tspan x="4.57178" y="0">ess</tspan></text><text class="e" transform="translate(13.02946 15.03084)"><tspan x="0" y="0">Mo</tspan><tspan class="k" x="12.93262" y="0">r</tspan><tspan x="16.52393" y="0">e</tspan></text><text class="e" transform="translate(225.65903 48.65596)"><tspan x="0" y="0">17.80</tspan></text><text class="e" transform="translate(13.02921 48.65584)"><tspan x="0" y="0">22.00</tspan></text></g></g></svg>'
            sliderContainer.insertAdjacentHTML('beforeend',svg)
            return sliderContainer;
        }
    });
    sliderMap.addControl(new sliderLegend()); 

    // create legend control to display data year on layer1
    var year1Legend = L.Control.extend({
        options: {
            position: "topleft"
        },
        onAdd:function(){
            var sliderContainer = L.DomUtil.create('div','legend-control-container');
            sliderContainer.innerHTML = '<p class="year1Legend">2006</p>';
            return sliderContainer;
        }
    });
    sliderMap.addControl(new year1Legend());

    // create legend control to display data year on layer2
    var year2Legend = L.Control.extend({
        options: {
            position: "topright"
        },
        onAdd:function(){
            var sliderContainer = L.DomUtil.create('div','legend-control-container');
            sliderContainer.innerHTML = '<p class="year2Legend">2020</p>';
            return sliderContainer;
        }
    });
    sliderMap.addControl(new year2Legend());
};

// create array containing flyTo locations
var fly= [
    {
        id:"start",
        location:[39,-96],
        zoom: 5
    },
    {
        id:"block1",
        location:[48.00, -103.42],
        zoom: 8
    },
    {
        id:"block2",
        location:[29.78, -95.36],
        zoom: 9
    }
];

// function to trigger flyTo on scroll
function scroll(){
    fly.forEach(function(item){
        isInPosition(item.id, item.location, item.zoom)
    });
};

function isInPosition(id, location, zoom){
    
    // get element and element's property 'top'
    var block1 = document.getElementById(id);
    var rect = block1.getBoundingClientRect();
    y = rect.top;

    // set the top margin as a ratio of innerHeight
    var topMargin = window.innerHeight / 2;

    // call flyTo when top of element is halfway up innerHeight
    if ((y-topMargin) < 0 && y > 0){
        sliderMap.flyTo(location, zoom, {
            animate: true,
            duration: 2 // in seconds
        });
    };
};

// CONSTELLATION FADE
// create array containing images
var constellation= [
    {
        id:"fade0",
        src: "img/constbase.png"
    },
    {
        id:"fade1",
        src: "img/constsleep.png"
    },
    {
        id:"fade2",
        src: "img/constturt.png"
    },
    {
        id:"fade3",
        src: "img/constbase.png"
    }
];

// function to trigger image switch on scroll
function constScroll(){
    constellation.forEach(function(item){
        constIsInPosition(item.id, item.src)
    });
};

function constIsInPosition(id, src){
    
    // get element and element's property 'top'
    var constText = document.getElementById(id);
    var rect = constText.getBoundingClientRect();
    y = rect.top;

    // set the top margin as a ratio of innerHeight
    var topMargin = window.innerHeight / 2;

    // change image when top of element is halfway up innerHeight
    if ((y-topMargin) < 0 && y > 0){
        document.querySelector("#constAustin").src=src
    };
};


//DARK SKY PLACES

//function to make things react to scrolling
function IDAscroll(){
    //code for IDA points
    document.querySelectorAll('.IDA-points, .IDA-text').forEach(function(div){
        // get element and element's property 'top'
        var rect = div.getBoundingClientRect();
        y = rect.top;
        var id;
        var legend;
    
        // set the top margin as a ratio of innerHeight
        var topMargin = window.innerHeight;
        // call setStyle when top of element is halfway up innerHeight
        if ((y-topMargin) < 0 && y > 0){
            IDApoints.setStyle(function(feature){
                return style(feature, parseFloat(div.id))
            });

            //conditional to change year legend
            if (div.id === "start" || div.id === "parks" || div.id === "communities" || div.id === "unsps" || div.id === "end"){
                id = ''
            } else {
                id = div.id
            };
            document.querySelector('.yearLegend').innerHTML = id;
           
            //conditional to change interactivity of IDA points
            if (div.id === "end"){
            document.querySelectorAll(".leaflet-interactive").forEach(function(point){
                    point.style.pointerEvents = "auto"
            })
            }
            else {
                document.querySelectorAll(".leaflet-interactive").forEach(function(point){
                    point.style.pointerEvents = "none"
            })  
            };
            
            //conditional to create IDA point legends
            if (div.id === "end"){
                legend = '<?xml version="1.0" encoding="UTF-8"?><svg id="a1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256.50608 94.39501"><defs><style>.b1{fill:#fff;}.c1{fill:#13203e;}.d1{font-family:AstoriaSans-Roman, Astoria Sans;font-size:12px;}.e1{fill:#f94144;stroke:#8b0407;}.e1,.f1,.g1{stroke-miterlimit:10;stroke-width:.5px;}.h1{letter-spacing:-.05001em;}.f1{fill:#f8961e;stroke:#8b4e04;}.g1{fill:#fae450;stroke:#776704;}</style></defs><rect class="b1" width="256.50608" height="94.39501"/><rect class="c1" x="15.73989" y="55.86713" width="18.64631" height="18.64631"/><circle class="e1" cx="25.06304" cy="65.19029" r="3.73414"/><text class="d1" transform="translate(42.82782 69.36725)"><tspan x="0" y="0">Urban Night Sky Place</tspan></text><rect class="c1" x="15.73989" y="37.22082" width="18.64631" height="18.64631"/><circle class="f1" cx="25.06304" cy="46.54398" r="3.73414"/><text class="d1" transform="translate(42.82782 50.72094)"><tspan x="0" y="0">Dark Sky Community</tspan></text><rect class="c1" x="15.73989" y="18.57451" width="18.64631" height="18.64631"/><circle class="g1" cx="25.06304" cy="27.89766" r="3.73414"/><text class="d1" transform="translate(42.82782 32.07463)"><tspan x="0" y="0">Dark Sky </tspan><tspan class="h1" x="51.14355" y="0">P</tspan><tspan x="57.56348" y="0">ark, Sanctuary or Reserve</tspan></text></svg>'
                updatePointLegend(legend)
            } else {
                legend = ''
                updatePointLegend(legend)
            };
        };
    });

    //code for IDA text
    document.querySelectorAll('.IDA-text').forEach(function(div){
        // get element and element's property 'top'
        var rect = div.getBoundingClientRect();
        y = rect.top;
    
        // set the top margin as a ratio of innerHeight
        var topMargin = window.innerHeight / 2;
        // call setStyle when top of element is halfway up innerHeight
        if ((y-topMargin) < 0 && y > 0){
            IDApoints.setStyle(function(feature){
                return style(feature, div.id)
            });
        };
    });
};

//generate the final map
function createFinalMap(){
    //create the map
    finalMap = L.map('finalMap', {
        //map parameters
        center: [39,-96],
        zoom: 5,
        maxZoom: 12,
        minZoom: 5,
        scrollWheelZoom: false,
        //needed to get rid zoom in order to move it 
        zoomControl:false,
        //constrain pan to data
        maxBounds: [
            [60, -155],
            [15, -45]
            ],
    });

    // add zoom with home button
    var zoomHome = L.Control.zoomHome({position:'bottomright'});
    zoomHome.addTo(finalMap);

    //add the basemap.
    L.tileLayer('https://api.mapbox.com/styles/v1/ajnovak/cl2grbrgj003o14mot9tnmwh1/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYWpub3ZhayIsImEiOiJja2dnMWJoYXkwd3hlMnlsN241MHU3aTdyIn0.YlwTqHjnT8sUrhr8vtkWjg', {
	    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	    subdomains: 'abcd',
    }).addTo(finalMap);

    //call getData function
    getData();
};

//function to retrieve the data
function getData(){
    //adds the IDA points layer
    fetch("data/IDApointsNA.geojson")
        .then(function(response){
            return response.json();
        })        
        .then(function(json){
            //create a Leaflet GeoJSON layer and add it to the map
            IDApoints = L.geoJson(json,{
                //creates IDA pop ups
                onEachFeature:function(feature, layer){
                    var popupContent = createPopupContent(feature);
                    layer.bindPopup(popupContent)
                },
                //convert the IDA data from points to layers to give us more symbology control
                pointToLayer: pointToLayer
            }).addTo(finalMap);
            //call the style function within the Leaflet setStyle funciton, dynamically changing the IDA point style based on where the user is in the page
            IDApoints.setStyle(style);
            //create a year legend
            createYearLegend();
            //create an empty legend to load at the "end" html div
            createPointLegend();
        });
};

//create IDApoint pop up
function createPopupContent(feature){
    var popupContent = "<p><b>Name:</b> " + feature.properties.Name + 
        "</p><p><b>Year designated:</b> " + feature.properties.Year + 
        "</p><p><b>Type:</b> " + feature.properties.Type;
    return popupContent
};

//create final map legend
function createYearLegend(){
    var LegendControl = L.Control.extend({
        options: {
            position: 'topleft'
        },
        onAdd: function () {
            // create the control container with a particular class name
            var container = L.DomUtil.create('div', 'legend-year');
            
            //legend title
            container.innerHTML = '<p class="yearLegend"></span></p>';

            return container;
        }
    });
    
    finalMap.addControl(new LegendControl());
};

//create blank legend for IDA points
function createPointLegend(){
    var pointLegend = L.Control.extend({
        options: {
            position: "bottomleft"
        },
        onAdd:function(){
            var pointContainer = L.DomUtil.create('div','legend-control-container2');
            return pointContainer;
        }
    });
    finalMap.addControl(new pointLegend());
}

//updates IDA point legend to what the conditional passes through as legend
function updatePointLegend(legend){
    document.querySelector('.legend-control-container2').innerHTML = legend
}

//dynamically change IDA point style
function style(feature, divID){
    return {
        fillOpacity: opacityFilter(feature.properties, divID),
        fillColor: colorFilter(feature.properties, divID),
        weight: weightFilter(feature.properties, divID),
        color: strokeFilter(feature.properties, divID)
    };
};

//change IDA point opacity based on year
function opacityFilter(props, divID){
    if (parseFloat(props.Year) <= divID || divID === "end"){
        return 1
    } else if (divID === "parks" && (props.Type === "Park" || props.Type === "Sanctuary" || props.Type === "Reserve")) {
        return 1
    } else if (divID === "communities" && props.Type === "Community"){
        return 1
    } else if (divID === "unsps" && props.Type === "Urban Night Sky Place"){
        return 1
    } else {
        return 0
    };
};

//change IDApoint color based on type of IDA place
function colorFilter(props, divID){
    if((divID === "parks" || divID === "end") && (props.Type === "Park" || props.Type === "Sanctuary" || props.Type === "Reserve")){
        return "#FAE450"
    } else if ((divID === "communities" || divID === "end") && props.Type === "Community"){
        return "#f8961e"
    } else if ((divID === "unsps" || divID === "end") && props.Type === "Urban Night Sky Place"){
        return "#f94144"
    } else {
        return "#141414"
    };
};

//change IDApoint stroke weight based on type of IDA place
function weightFilter(props, divID){
    if (parseFloat(props.Year) <= divID || divID === "end"){
        return 1
    } else if (divID === "parks" && (props.Type === "Park" || props.Type === "Sanctuary" || props.Type === "Reserve")) {
        return 1
    } else if (divID === "communities" && props.Type === "Community"){
        return 1
    } else if (divID === "unsps" && props.Type === "Urban Night Sky Place"){
        return 1
    } else {
        return 0
    };
};

//change IDApoint stroke color based on type of IDA place
function strokeFilter(props, divID){
    if((divID === "parks" || divID === "end") && (props.Type === "Park" || props.Type === "Sanctuary" || props.Type === "Reserve")){
        return "#776704"
    } else if ((divID === "communities" || divID === "end") && props.Type === "Community"){
        return "#8B4E04"
    } else if ((divID === "unsps" || divID === "end") && props.Type === "Urban Night Sky Place"){
        return "#8B0407"
    } else {
        return "#F5F5F5"
    };
};


//function to convert markers to circle markers
function pointToLayer(feature, latlng){
   //create marker options
    var options = {
        color: "#000",
        weight: 0,
        opacity: 1,
        fillOpacity: 0.7,
        radius: 5,
        className:'point'
    };

    //create circle marker layer   
    var layer = L.circleMarker(latlng, options);

    //return the circle marker to the L.geoJson pointToLayer option
    return layer;
};


document.addEventListener('DOMContentLoaded', createLocationMap)
document.addEventListener('DOMContentLoaded', createSliderMap)
document.addEventListener('DOMContentLoaded', createFinalMap)
document.addEventListener('DOMContentLoaded', noLocation)
document.addEventListener('scroll', scroll)
document.addEventListener('scroll', IDAscroll)
document.addEventListener('scroll', scrollLocation)
document.addEventListener('scroll', constScroll)
