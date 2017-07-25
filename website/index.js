var link = "http://158.108.165.223/data/fukseed/";
var object = ["air", "smoke", "temperature", "waterflow", "soilmosture"];
var info = [
  (airGraph = []),
  (smokeGraph = []),
  (tempGraph = []),
  (waterGraph = []),
  (soilGraph = []),
  (totalGraph = [])
];
var xVal = [0,0,0,0,0,0];
var dismissTime = 0;

$(document).ready(function() {
  $("#page2").hide();
  $("#page3").hide();

  $("#index").click(() => {
    $("#page2").hide(300);
    $("#page1").show(300);
    $("#2").removeClass("active");
    $("#1").addClass("active");
  });

  $("#history").click(() => {
    $("#page1").hide(300);
    $("#page2").show(300);
    $("#1").removeClass("active");
    $("#2").addClass("active");
  });

  setInterval(() => update(), 1100);

  setInterval(() => updateChart(), 1100);

  function read(url, work) {
    $.ajax({
      url: link + url
    })
      .done(function(data) {
        work(data);
      })
      .fail();
  }

  var total = 0;
  function update() {
    object.forEach(function(item, index) {
      read(item, function(data) {
        if (item == "air") {
          data = Math.round(data / 1000);
        }
        $("#" + item).html(data);
        $("#" + item + "-progress").css(
          "width",
          parseFloat(data) /
            parseFloat($("#" + item + "-progress").attr("aria-valuemax")) *
            100 +
            "%"
        );

        var width =
          parseFloat(data) /
          parseFloat($("#" + item + "-progress").attr("aria-valuemax")) *
          100;

        $("#" + item + "-progress").removeClass("progress-bar-success");
        $("#" + item + "-progress").removeClass("progress-bar-warning");
        $("#" + item + "-progress").removeClass("progress-bar-danger");
        if (parseFloat(width) >= 66) {
          $("#" + item + "-progress").addClass("progress-bar-danger");
        } else if (parseFloat(width) >= 33) {
          $("#" + item + "-progress").addClass("progress-bar-warning");
        } else {
          $("#" + item + "-progress").addClass("progress-bar-success");
        }
        if (width > 90) {
          //300,000
          if (new Date().getTime() >= dismissTime + 180000) {
            function editWarning(text) {
              $("#warning").html(text);
            }
            switch (item) {
              case "air":
                editWarning("Air Pressure too high !!");
                break;
              case "smoke":
                editWarning("Smoke is on danger level !!");
                break;
              case "temperature":
                editWarning("Temperature Overheat !!");
                break;
              case "waterflow":
                editWarning("Too fast water flow !!");
                break;
              case "soilmosture":
                editWarning("Land slide !!");
                break;
            }
              
            $('#page1').hide();
            $('#page2').hide();
            $('#page3').show();
            $('#app').hide();
            read("light/set/on",()=>console.log("light on"));
            $("#dismiss").click(function() {
              dismissTime = new Date().getTime();
              $("#page2").hide(300);
              $("#page1").show(300);
              $("#page3").hide();
              $("#app").show();
              $("#2").removeClass("active");
              $("#1").addClass("active");
            read("light/set/off",()=>console.log("light off"));
            });
          }
        } else {
        }

        total += width;
        info[index].push({
          x: xVal[index],
          y: parseInt(data)
        });
        xVal[index]++;
      });
    });
    info[5].push({
      x: xVal[5],
      y: parseInt(total / 5 / 10)
    });
    xVal[5]++;
    changeTotalBar(Math.round(total / 5.0 / 10.0));
    total = 0;
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
      for (var i = 0; i < 10; i++) {
        $(progressbar[i]).attr("style", "background-color:wheat;");
      }
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

  function dismiss() {
    $("#app").html(app);
    $("body").attr(
      "style",
      "background: url(7536921_orig.png);background-size: cover;background-repeat: no-repeat;"
    );
  }

  // var airGraph,
  //     smokeGraph,
  //     tempGraph,
  //     waterGraph,
  //     soilGraph,
  //     totalGraph = [];

  // GRAPH PART
  var airChart = new CanvasJS.Chart("airGraph", {
    title: {
      text: "Live Air Pressure Data"
    },
    data: [
      {
        type: "line",
        dataPoints: airGraph
      }
    ]
  });

  var smokeChart = new CanvasJS.Chart("smokeGraph", {
    title: {
      text: "Live Smoke Data"
    },
    data: [
      {
        type: "line",
        dataPoints: smokeGraph
      }
    ]
  });

  var tempChart = new CanvasJS.Chart("tempGraph", {
    title: {
      text: "Live Temperature Data"
    },
    data: [
      {
        type: "line",
        dataPoints: tempGraph
      }
    ]
  });

  var waterChart = new CanvasJS.Chart("waterGraph", {
    title: {
      text: "Live WaterFlow Data"
    },
    data: [
      {
        type: "line",
        dataPoints: waterGraph
      }
    ]
  });

  var soilChart = new CanvasJS.Chart("soilGraph", {
    title: {
      text: "Live Soil Moisture Data"
    },
    data: [
      {
        type: "line",
        dataPoints: soilGraph
      }
    ]
  });

  var totalChart = new CanvasJS.Chart("totalGraph", {
    title: {
      text: "Live Warning Level Data"
    },
    data: [
      {
        type: "line",
        dataPoints: totalGraph
      }
    ]
  });
  var dataLength = 60;
  var updateChart = function() {
    for (var i = 0; i < info.length; i++) {
      if (info[i].length > dataLength) {
        info[i].shift();
      }
    }

    airChart.render();
    smokeChart.render();
    tempChart.render();
    waterChart.render();
    soilChart.render();
    totalChart.render();
  };
});
