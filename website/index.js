var link = "http://158.108.165.223/data/fukseed/";
var object = ["air", "smoke", "temperature", "waterflow", "soilmosture"];

$(document).ready(function() {
  $("#app").html();
  setInterval(function() {
    update();
  }, 1000);
});

function read(url, work) {
  $.ajax({
    url: link + url
  })
    .done(function(data) {
      work(data);
    })
    .fail();
}

function update() {
  object.forEach(function(item, index) {
    read(item, function(data) {
      $("#" + item).html(data);
      $("#" + item + "-progress").attr(
        "style",
        "width: " + parseInt(data) + "%;"
      );
      var width =
        parseFloat($("#" + item + "-progress").css("width")) /
        parseFloat($("#progress").css("width")) *
        100;
      
      $("#" + item + "-progress").removeClass("progress-bar-success");
      $("#" + item + "-progress").removeClass("progress-bar-warning");
      $("#" + item + "-progress").removeClass("progress-bar-danger");

      if (width >= 66) {
        $("#" + item + "-progress").addClass("progress-bar-danger");
      } else if (width >= 33) {
        $("#" + item + "-progress").addClass("progress-bar-warning");
      } else {
        $("#" + item + "-progress").addClass("progress-bar-success");
      }
    });
  });
}
