var link = "http://158.108.165.223/data/fukseed/";

$(document).ready(function() {
  $("#app").html();
});

function recieveAirPressure() {
  var air = read("air");
  // update
}

function recieveSmoke() {
    var smoke = read("smoke");
    //update
}

function recieveTemperature() {
    var temperature = read("temperature");
    //update
}

function recieveWaterFlow() {
    var waterFlow = read("waterflow");
    //update
}

function recieveSoilMosture() {
    var soilMosture = read("soilmosture");
    //update
}

function read(url) {
  $.ajex({
    url: link + url
  })
    .done(function(data) {
      return data;
    })
    .fail();
}
