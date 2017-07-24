var link = "http://158.108.165.223/data/fukseed/";
var object = ["air", "smoke", "temperature", "waterflow", "soilmosture"];

$(document).ready(function() {
  changeTotalBar(3);
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
        100.0;

      $("#" + item + "-progress").removeClass("progress-bar-success");
      $("#" + item + "-progress").removeClass("progress-bar-warning");
      $("#" + item + "-progress").removeClass("progress-bar-danger");
      if(parseFloat(width) >= 90){
          warning(item);
      }
      else if (parseFloat(width) >= 66) {
        $("#" + item + "-progress").addClass("progress-bar-danger");
      } else if (parseFloat(width) >= 33) {
        $("#" + item + "-progress").addClass("progress-bar-warning");
      } else {
        $("#" + item + "-progress").addClass("progress-bar-success");
      }
    });
  });
}

var progressbar = [
  "#bar-1",
  "#bar-2",
  "#bar-3",
  "#bar-4",
  "#bar-5",
  "#bar-6",
  "#bar-7",
  "#bar-8",
  "#bar-9",
  "#bar-10"
];
var oldLevel;

function changeTotalBar(level) {
  if (level != oldLevel) {
    for (var i = 0; i < level; i++) {
      if (level > 7) {
        $(progressbar[i]).attr("style", "background-color:red;");
      } else if (level > 4) {
        $(progressbar[i]).attr("style", "background-color:orange;");
      } else {
        $(progressbar[i]).attr("style", "background-color:green;");
      }
    }
  }
  oldLevel = level;
}

var app;
function warning(item){
    app = $('#app').html();
    $('#app').html('<div class="warningMSG">Something wrong on : ' + item + '</div>');
    $('#app').append('<button type="button" class="btn btn-danger" onclick=dismiss()>Dismiss</button>');
}

function dismiss(){
    $('#app').html(app);
}