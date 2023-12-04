//assigning the map container.
const map = L.map("map"); 

//Open Street tileLayer.
const tileLayerOSM =  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

//Google Street tileLayer.
const tileLayerGoogleStreet = L.tileLayer('http://{s}.google.com/vt?lyrs=m&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
});

//OSM tileLayer added to map.
tileLayerOSM.addTo(map);

//map view set to India Coordinates
map.setView([24.192873190869964, 77.89405869985677],6);





//To get availabe or unavailable for classname in outletTile
function availableOrUnavailable(key)
{
    if(key==="yes")
    {
        return "available"
    }
    return "unavailable";
}

//To get check or X for info in outletTile
function checkOrCross(key)
{
    if(key==="yes")
    {
        return "&check;";
    }
    return "&cross;";
}

//cafe and restraunt arrays created.
const cafeMarkers = [];
const restrauntMarkers = [];

//Creating outlet tiles.
function onEachFeature(outlet)
{           
    //container holding all the outletTiles   
    const tilesContainer = document.querySelector(".tiles-container");
    
    //tile created with each iteration. 
    const outletTile = document.createElement("div");
    
    //class provided to the tile.
    outletTile.classList.add("outlet-tile");

    //inner HTML inserted dynamically
    outletTile.innerHTML = `<div class="line"></div>

    <h4 class="outlet-name">${outlet.properties.name}</h4>

    <div class="outlet-info">
        <h6 class=${availableOrUnavailable(outlet.properties.dine)}>Dine ${checkOrCross(outlet.properties.dine)}</h6>

        <h6 class=${availableOrUnavailable(outlet.properties.parking)}>Parking ${checkOrCross(outlet.properties.parking)}</h6>

        <h6 class=${availableOrUnavailable(outlet.properties.twentyFourHours)}>24X7 ${checkOrCross(outlet.properties.twentyFourHours)}</h6>
    </div>`;
    
    //outletTile pushed inside tilesContainer
    tilesContainer.insertAdjacentElement("beforeend",outletTile);

    //click event provided to outletTiles
    outletTile.addEventListener("click",function()
    {
        map.flyTo(outlet.geometry.coordinates,15,{"duration":4});

        //close all popups of restraunts and cafes
        restrauntMarkers.forEach(marker=>marker.closePopup());
        cafeMarkers.forEach(marker=>marker.closePopup());

        
        setTimeout(function()
        {
            outlet.properties.marker.openPopup();
        },4000);


    });   



}

function pointToLayer(feature)
{
    const marker = L.marker(feature.geometry.coordinates).bindPopup(`<div class="address">${feature.properties.address}</div>

    <div class="mobile-number"><a href="tel:${"+91"+ feature.properties.mobileNumber}">${feature.properties.mobileNumber}</a></div>
    `);
    
    //marker added to the feature
    feature.properties.marker = marker;

    //cafes and restrauts arrays filled respectively. 
    if(feature.properties.type===outletTypes.restraunt)
    {
         restrauntMarkers.push(marker);
    }
    else if(feature.properties.type===outletTypes.cafe)
    {
        cafeMarkers.push(marker);
    }

    return marker;
}

//geoJSON layer created
const outletsLayer = L.geoJSON(outlets,{
    onEachFeature,
    pointToLayer,
});

//geoJSON layer added to map
outletsLayer.addTo(map);

//restraunt marker group
const restrauntMarkerGroup = L.layerGroup(restrauntMarkers);

//cafe marker group
const cafeMarkersGroup = L.layerGroup(cafeMarkers);

//layer control created
const layerControl = L.control.layers({"OSM":tileLayerOSM,"Google Street":tileLayerGoogleStreet},{"Restrants":restrauntMarkerGroup,"Cafes":cafeMarkersGroup});

//restraunt and cafe marker groups added to map
restrauntMarkerGroup.addTo(map);
cafeMarkersGroup.addTo(map);

//control layer added to map
layerControl.addTo(map);