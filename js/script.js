document.querySelector("button").addEventListener("click", getEarthQuakes);
document.querySelector("#latitude").addEventListener("change", warningInput);
document.querySelector("#longitude").addEventListener("change", warningInput);
document.querySelector("#radius").addEventListener("change", warningInput);


async function getEarthQuakes(){
    console.log("Starting.....");
    let latitude = document.querySelector("#latitude").value;
    let longitude = document.querySelector("#longitude").value;
    let maxRadius = document.querySelector("#radius").value;
    let minMagnitude = document.querySelector("#magnitude").value;
    let maxMagnitude = document.querySelector("#max-magnitude").value;
    let limits = document.querySelector("#limits").value;

    try{
        if(isNaN(latitude) || isNaN(longitude) || isNaN(maxRadius) || isNaN(minMagnitude) || isNaN(limits) || isNaN(maxMagnitude)){
            throw new TypeError("Only numbers allowed for Latitude, Longitude, Radius, and Magnitude!");
        }
    } catch (error){
        errorMsg(error);
        return;
    }

    let starttime = document.querySelector("#startDate").value;
    let endtime = document.querySelector("#endDate").value;

    if(limits < 1){
        limits = 1;
    } 
    
    if( limits > 100){
        limits = 100;
    }

    let url = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&limit=${limits}&starttime=${starttime}&endtime=${endtime}&maxmagnitude=${maxMagnitude}&minmagnitude=${minMagnitude}&maxradius=${maxRadius}&latitude=${latitude}&longitude=${longitude}`;
    console.log(url);
    
    let response;
    let data;

    try{
        response = await fetch(url);
        data = await response.json();
    }catch(error){
        errorMsg(error);
    }
    // let response = await fetch(url);
    // let data = await response.json();

    let dataTable = document.querySelector("#data-table");
    dataTable.innerHTML = "<tr><th>Alert</th><th>Magnitude</th><th>Magnitude Type</th><th>Location</th><th>Type</th><th>Time</th></tr>";

    let MAX = data.features.length;

    //make sure doesn't go out of bounds
    // if(data.features.length < 10){
    //     MAX = data.features.length;
    // }

    if(data.features.length > 0){
        for(let i = 0; i < MAX; i++){
            let alertColor = data.features[i].properties.alert;
            //console.log(alertColor);
            //console.log(typeof(alertColor));

            if(data.features[i].properties.alert == null){
                alertColor = "grey";
            } else {
                alertColor = data.features[i].properties.alert;
            }

            dataTable.innerHTML += `<tr>
            <th style="color: ${alertColor};">⚠ ${data.features[i].properties.alert}</th> 
            <th>${data.features[i].properties.mag}</th>
            <th>${data.features[i].properties.magType}</th> 
            <th>${data.features[i].properties.place}</th>
            <th>${data.features[i].properties.type}</th>
            <th>${new Date(data.features[i].properties.time).toString()}</th></tr>`;

            // dataTable.innerHTML += `<tr>
            // <th style="color: ${alertColor};">⚠</th> 
            // <th>${data.features[i].properties.mag}</th>
            // <th>${data.features[i].properties.magType}</th> 
            // <th>${data.features[i].properties.place}</th>
            // <th>${data.features[i].properties.type}</th>
            // <th>${new Date(data.features[i].properties.time).toString()}</th></tr>`;
        }
    }


    console.log("++++++++++++++++++++++++");
    console.log(data);
    console.log("++++++++++++++++++++++++");

}

function warningInput(){
    let warning = document.querySelector("#ErrorMsg");

    warning.innerHTML = "Warning: Must input data into Latitude, Longitude, Radius, or leave all three blank for defualt.";
    warning.className = "bg-warning text-dark p-2 border border-dark";
}

function errorMsg(msg){
    let err = document.querySelector("#ErrorMsg");

    err.innerHTML = `Error: ${msg}`;
    err.className = "bg-danger text-white p-2 border border-dark";

}

//-white p-2 borde