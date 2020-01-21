// Main config
var vh = window.innerHeight;
var vw = window.innerWidth;

var width = 1800,
  height = 1800,
  radius = Math.min(width, height);

var arcStartAngle = 0,
  arcInnerRadius = width / 2 - 20,
  arcOuterRadius = width / 2 - 10,
  circleRadius = 10,
  anglePoint = 0;

var originX = width / 2,
  originY = height / 2;

var canvas = d3
  .select("#centralCanvas")
  .attr("width", "100%")
  .attr("viewBox", "0 0 " + width + " " + height)
  .append("g")
  .attr("id", "solarSystem")
  .attr("width", width)
  .attr("height", height)
  .style("display", "none")
  .style("opacity", 0);

var div = d3
  .select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

// Circle section
var sections = {
  section1: [337, 22],
  section2: [22, 67],
  section3: [67, 112],
  section4: [112, 157],
  section5: [157, 202],
  section6: [202, 247],
  section7: [247, 292],
  section8: [292, 337]
};

// Fetch data from Google Firebase
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBX60bjMYjIHe3iBxgRAhUrnx0AVg883aw",
  authDomain: "interactive-essay.firebaseapp.com",
  databaseURL: "https://interactive-essay.firebaseio.com",
  projectId: "interactive-essay",
  storageBucket: "interactive-essay.appspot.com",
  messagingSenderId: "822835061",
  appId: "1:822835061:web:ba90bb3adf6bea2cd2453c"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var countries = firebase.database().ref("countries");

var countriesArray = [];

var countriesOnRings = {
  1: 0,
  2: 0,
  3: 0,
  4: 0,
  5: 0,
  6: 0
};

function getPositionX(item, ringNumber) {
  var currentPosition = item.position;
  var totalNumber = countriesOnRings[ringNumber];
  var ringAngleStep = 360 / totalNumber;
  var currentAngle = ringAngleStep * currentPosition - startAngle;

  return originX + 150 * item.ring * Math.sin((currentAngle * Math.PI) / 180);
}
function getPositionY(item, ringNumber) {
  var currentPosition = item.position;
  var totalNumber = countriesOnRings[ringNumber];
  var ringAngleStep = 360 / totalNumber;
  var currentAngle = ringAngleStep * currentPosition - startAngle;

  return originY + 150 * item.ring * Math.cos((currentAngle * Math.PI) / 180);
}

function getAngle(item, ringNumber) {
  var currentPosition = item.position;
  var totalNumber = countriesOnRings[ringNumber];
  var ringAngleStep = 360 / totalNumber;
  var currentAngle = ringAngleStep * currentPosition - startAngle;

  return currentAngle;
}

var startAngle = 360 / 10 / 2;

var countriesBuildArray = [],
  countriesGrowArray = [],
  countriesShiftArray = [];

var dotGroupAll;

countries.once("value", function(snap) {
  var promises = [];

  snap.forEach(function(country) {
    var countryName = country.key;
    var countryPosition = country.val().position;
    var countryColor = country.val().color;
    var countryRadius = country.val().radius;
    if (country.val().radius == "L") {
      countryRadius = 18;
    } else if (country.val().radius == "M") {
      countryRadius = 10;
    } else if (country.val().radius == "S") {
      countryRadius = 6;
    }
    var countryRing = country.val().ring;
    var countryType = country.val().type;
    var countryHdi = country.val().hdi;
    var countryEf = country.val().ef;

    function arrayPush(array) {
      array.push({
        name: countryName,
        position: countryPosition,
        color: countryColor,
        radius: countryRadius,
        ring: countryRing,
        type: countryType,
        hdi: countryHdi,
        ef: countryEf
      });
    }

    arrayPush(countriesArray);

    // if (country.val().type == 'Build') {
    //   arrayPush(countriesBuildArray);
    // } else if (country.val().type == 'Grow') {
    //   arrayPush(countriesGrowArray);
    // } else if (country.val().type == 'Shift') {
    //   arrayPush(countriesShiftArray);
    // }

    promises.push(country.key);
  });

  countriesArray.forEach(function(country) {
    if (country.ring == 1) {
      ++countriesOnRings[1];
    } else if (country.ring == 2) {
      ++countriesOnRings[2];
    } else if (country.ring == 3) {
      ++countriesOnRings[3];
    } else if (country.ring == 4) {
      ++countriesOnRings[4];
    } else if (country.ring == 5) {
      ++countriesOnRings[5];
    } else if (country.ring == 6) {
      ++countriesOnRings[6];
    }
  });

  Promise.all(promises).then(function(snapshots) {
    var group = canvas
      .selectAll("dot")
      .data(countriesArray)
      .enter()
      .append("g")
      .attr("class", "dot-group")
      .attr("data-type", function(d) {
        return d.type;
      });

    dotGroupAll = document.querySelectorAll(".dot-group");
    dotGroupAll.forEach(function(element) {
      if (element.getAttribute("data-type") == "Build") {
        countriesBuildArray.push(element);
      } else if (element.getAttribute("data-type") == "Grow") {
        countriesGrowArray.push(element);
      } else if (element.getAttribute("data-type") == "Shift") {
        countriesShiftArray.push(element);
      }
    });

    var dots = group
      .append("circle")
      .attr("class", "dot")
      .on("mouseover", function(d) {
        var currentPosition = d.position;
        var totalNumber = countriesOnRings[d.ring];
        var ringAngleStep = 360 / totalNumber;
        var currentAngle = ringAngleStep * currentPosition - startAngle;

        div
          .transition()
          .duration(300)
          .style("opacity", 1);
        div
          .html(
            "<span class=tooltip-name>" +
              d.name +
              "</span><span class=tooltip-content>" +
              "<p class=tooltip-country-type>" +
              d.type +
              "</p><p>HDI Score: " +
              d.hdi +
              "</p><p>EF Score: " +
              d.ef +
              " GHa</p></span>"
          )
          .style("left", d3.event.pageX + "px")
          .style("top", d3.event.pageY + "px");
      })
      .on("mouseout", function(d) {
        div
          .transition()
          .duration(300)
          .style("opacity", 0);
      });

    var dotsAttrs = dots
      .attr("cx", function(d) {
        if (d.ring == 1) {
          return getPositionX(d, 1);
        } else if (d.ring == 2) {
          return getPositionX(d, 2);
        } else if (d.ring == 3) {
          return getPositionX(d, 3);
        } else if (d.ring == 4) {
          return getPositionX(d, 4);
        } else if (d.ring == 5) {
          return getPositionX(d, 5);
        } else if (d.ring == 6) {
          return getPositionX(d, 6);
        }
      })
      .attr("cy", function(d) {
        if (d.ring == 1) {
          return getPositionY(d, 1);
        } else if (d.ring == 2) {
          return getPositionY(d, 2);
        } else if (d.ring == 3) {
          return getPositionY(d, 3);
        } else if (d.ring == 4) {
          return getPositionY(d, 4);
        } else if (d.ring == 5) {
          return getPositionY(d, 5);
        } else if (d.ring == 6) {
          return getPositionY(d, 6);
        }
      })
      .attr("r", function(d) {
        return d.radius;
      })
      .style("fill", function(d) {
        return d.color;
      });

    var dotsNames = group
      .append("text")
      .text(function(d) {
        return d.name;
      })
      .attr("font-family", "Montserrat")
      .attr("font-size", "9px")
      .attr("font-weight", "500")
      .attr("fill", "#808487")
      .attr("x", function(d) {
        var textLabel = this.parentNode.getElementsByTagName("text");
        var textWidth = textLabel[0].getBBox().width;
        var floored = Math.floor(textWidth);
        var countryRadius = d.radius;

        // X axis
        if (
          getAngle(d, d.ring) >= sections.section1[0] ||
          (getAngle(d, d.ring) < 360 && getAngle(d, d.ring) <= 0) ||
          getAngle(d, d.ring) < sections.section1[1]
        ) {
          return getPositionX(d, d.ring) - floored / 2;
        } else if (
          getAngle(d, d.ring) >= sections.section2[0] &&
          getAngle(d, d.ring) < sections.section2[1]
        ) {
          return getPositionX(d, d.ring) + countryRadius / 5;
        } else if (
          getAngle(d, d.ring) >= sections.section3[0] &&
          getAngle(d, d.ring) < sections.section3[1]
        ) {
          return getPositionX(d, d.ring) + countryRadius + 4;
        } else if (
          getAngle(d, d.ring) >= sections.section4[0] &&
          getAngle(d, d.ring) < sections.section4[1]
        ) {
          return getPositionX(d, d.ring) + countryRadius - 4;
        } else if (
          getAngle(d, d.ring) >= sections.section5[0] &&
          getAngle(d, d.ring) < sections.section5[1]
        ) {
          return getPositionX(d, d.ring) - floored / 2;
        } else if (
          getAngle(d, d.ring) >= sections.section6[0] &&
          getAngle(d, d.ring) < sections.section6[1]
        ) {
          return getPositionX(d, d.ring) - countryRadius - floored;
        } else if (
          getAngle(d, d.ring) >= sections.section7[0] &&
          getAngle(d, d.ring) < sections.section7[1]
        ) {
          return getPositionX(d, d.ring) - countryRadius - floored - 4;
        } else if (
          getAngle(d, d.ring) >= sections.section8[0] &&
          getAngle(d, d.ring) < sections.section8[1]
        ) {
          return getPositionX(d, d.ring) - countryRadius - floored - 4;
        }
      })
      .attr("y", function(d) {
        var textLabel = this.parentNode.getElementsByTagName("text");
        var textHeight = textLabel[0].getBBox().height;
        var floored = Math.floor(textHeight);
        var countryRadius = d.radius;

        // Y axis
        if (
          getAngle(d, d.ring) >= sections.section1[0] ||
          (getAngle(d, d.ring) < 360 && getAngle(d, d.ring) <= 0) ||
          getAngle(d, d.ring) < sections.section1[1]
        ) {
          return getPositionY(d, d.ring) + countryRadius + floored + 2;
        } else if (
          getAngle(d, d.ring) >= sections.section2[0] &&
          getAngle(d, d.ring) < sections.section2[1]
        ) {
          return getPositionY(d, d.ring) + countryRadius + floored;
        } else if (
          getAngle(d, d.ring) >= sections.section3[0] &&
          getAngle(d, d.ring) < sections.section3[1]
        ) {
          return getPositionY(d, d.ring) + countryRadius / 5;
        } else if (
          getAngle(d, d.ring) >= sections.section4[0] &&
          getAngle(d, d.ring) < sections.section4[1]
        ) {
          return getPositionY(d, d.ring) - countryRadius / 5 - floored;
        } else if (
          getAngle(d, d.ring) >= sections.section5[0] &&
          getAngle(d, d.ring) < sections.section5[1]
        ) {
          return getPositionY(d, d.ring) - countryRadius - floored / 2;
        } else if (
          getAngle(d, d.ring) >= sections.section6[0] &&
          getAngle(d, d.ring) < sections.section6[1]
        ) {
          return getPositionY(d, d.ring) - countryRadius / 5 - floored;
        } else if (
          getAngle(d, d.ring) >= sections.section7[0] &&
          getAngle(d, d.ring) < sections.section7[1]
        ) {
          return getPositionY(d, d.ring) + countryRadius / 5;
        } else if (
          getAngle(d, d.ring) >= sections.section8[0] &&
          getAngle(d, d.ring) < sections.section8[1]
        ) {
          return getPositionY(d, d.ring) + countryRadius / 5 + floored + 2;
        }
      });
  });
});

// ANCHOR Animation for Countries types
function hideCoutriesType(countriesTypeArray, duration, delay) {
  countriesTypeArray.forEach(function(element) {
    d3.select(element)
      .transition()
      .duration(duration)
      .delay(delay)
      .style("opacity", 0)
      .transition()
      .duration(duration)
      .delay(delay + delay)
      .style("display", "none");
  });
}
function showCoutriesType(countriesTypeArray, duration, delay) {
  countriesTypeArray.forEach(function(element) {
    d3.select(element)
      .transition()
      .duration(duration)
      .delay(delay)
      .style("opacity", 1)
      .style("display", "block");
  });
}

var legendEl = document.querySelector(".legend");

function legendModal() {
  var legendStatus = 0;
  legendEl.addEventListener("click", function() {
    if (legendStatus == 0) {
      legendStatus++;
      legendEl.classList.add("legend-active");
    } else {
      legendStatus--;
      legendEl.classList.remove("legend-active");
    }
  });
}

// ––––––––––––––––––––––––––––––––––––––––––––––––

var rings = [1, 2, 3, 4, 5, 6];

var drawRings = canvas
  .selectAll("ring")
  .data(rings)
  .enter()
  .append("circle")
  .attr("cy", originX)
  .attr("cx", originY)
  .attr("r", function(d) {
    return d * 150;
  })
  .style("stroke", "#6F787F")
  .style("stroke-width", 1)
  .style("fill", "none");

// Draw the center elements
// var defs = canvas.append("defs");

// var filter = defs
//   .append("filter")
//   .attr("id", "planetBackgroundShadow")
//   .attr("height", "130%");

// filter
//   .append("feGaussianBlur")
//   .attr("in", "SourceAlpha")
//   .attr("stdDeviation", 50)
//   .attr("result", "blur");

// var feMegre = filter.append("feMerge");

// feMegre.append("feMergeNode").append("in", "offsetBlur");
// feMegre.append("feMergeNode").append("in", "SourceGraphic");

canvas
  .append("circle")
  .attr("class", "planetBackground")
  .attr("cy", originY)
  .attr("cx", originX)
  .attr("r", 46)
  .style("fill", "#283338")
  .style("filter", "url(#drop-shadow)");

// ANCHOR Filters

var filterBuild = document.querySelector("#showBuild");
var filterGrow = document.querySelector("#showGrow");
var filterShift = document.querySelector("#showShift");
function filterType(togglerName, array, duration, delay) {
  var status = 1;
  togglerName.addEventListener("click", function() {
    if (status == 1) {
      status--;
      hideCoutriesType(array, duration, delay);
    } else {
      showCoutriesType(array, duration, delay);
      status++;
    }
  });
}

filterType(filterBuild, countriesBuildArray, 1000, 500);
filterType(filterGrow, countriesGrowArray, 1000, 500);
filterType(filterShift, countriesShiftArray, 1000, 500);

var filter = d3.select(".filter").style("opacity", 0);
var legend = d3.select(".legend").style("opacity", 0);

function playFilterAnimation(duration, delay) {
  filter
    .transition()
    .duration(duration)
    .delay(delay)
    .style("opacity", 1);
}
function playFilterAnimationReverse(duration, delay) {
  filter
    .transition()
    .duration(duration)
    .delay(delay)
    .style("opacity", 0);
}

function playLegendAnimation(duration, delay) {
  legend
    .transition()
    .duration(duration)
    .delay(delay)
    .style("opacity", 1);
  legendModal();
}
function playLegendAnimationReverse(duration, delay) {
  legend
    .transition()
    .duration(duration)
    .delay(delay)
    .style("opacity", 0);
}

// ANIMATIONS PART START
var stepsWidth = 350;

var centralCanvas = d3
  .select("#centralCanvas")
  // .attr("width", width)
  .attr("height", height)
  .attr("width", "100%")
  .attr("viewBox", "0 0 " + width + " " + height);

var numberOfInnerRingCircles = 36;
var arrayOfInnerRingCircles = [];

for (var i = -1; i < numberOfInnerRingCircles + 1; i++) {
  arrayOfInnerRingCircles.push(i);
}

var centralCanvasInnerWidth = d3.select("#centralCanvasInner").attr("width");
var centralCanvasInnerHeight = d3.select("#centralCanvasInner").attr("height");

var centralCanvasInner = d3
  .select("#centralCanvasInner")
  .style("opacity", "0")
  .attr(
    "transform",
    "translate(" +
      (width / 2 - centralCanvasInnerWidth / 2) +
      ", " +
      (height / 2 - centralCanvasInnerHeight / 2) +
      ")"
  );

function playCentralCanvasInnerAnimation(duration, delay) {
  centralCanvasInner
    .transition()
    .duration(duration)
    .delay(delay)
    .style("opacity", "1");
}

var rings = [1];

var drawRings = centralCanvas
  .selectAll("ring")
  .data(rings)
  .enter()
  .append("circle")
  .attr("cy", originX)
  .attr("cx", originY)
  .attr("r", function(d) {
    return d * 150;
  })
  .style("stroke", "#6F787F")
  .style("stroke-width", 1)
  .style("fill", "none");

var totalLength = drawRings.node().getTotalLength();

drawRings
  .attr("stroke-dasharray", totalLength + " " + totalLength)
  .attr("stroke-dashoffset", totalLength)
  .transition()
  .duration(2000)
  .attr("stroke-dashoffset", totalLength);

function getPositionXInner(item) {
  var currentPosition = item;
  var ringAngleStep = 360 / numberOfInnerRingCircles;
  var currentAngle = ringAngleStep * currentPosition;

  return 150 / 2 + (150 / 2 - 20) * Math.cos((currentAngle * Math.PI) / 180);
}
function getPositionYInner(item) {
  var currentPosition = item;
  var ringAngleStep = 360 / numberOfInnerRingCircles;
  var currentAngle = ringAngleStep * currentPosition;

  return 150 / 2 + (150 / 2 - 20) * Math.sin((currentAngle * Math.PI) / 180);
}

// ANIMATIONS – The last animations
var innerGroup = centralCanvasInner.append("g").attr("id", "innerContent");
var innerRing = innerGroup
  .append("circle")
  .attr("cy", 150 / 2)
  .attr("cx", 150 / 2)
  .attr("r", 150 / 2 - 20)
  .style("stroke", "#6F787F")
  .style("stroke-width", 1)
  .style("fill", "none")
  .style("opacity", 0);
var innerRingCircles = innerGroup
  .selectAll("circle")
  .data(arrayOfInnerRingCircles)
  .enter()
  .append("circle")
  .attr("cx", function(d) {
    return getPositionXInner(d);
  })
  .attr("cy", function(d) {
    return getPositionYInner(d);
  })
  .attr("r", 2)
  .attr("fill", "#00C1F2")
  .style("opacity", "0");
function playInnerRingAnimation(
  innerRingDelay,
  innerRingDuration,
  innerRingCirclesDuration,
  circleDelay,
  circleDuration
) {
  var totalLengthInnerRing = innerRing.node().getTotalLength();
  innerRing
    .style("opacity", 1)
    .attr("stroke-dasharray", totalLengthInnerRing + " " + totalLengthInnerRing)
    .attr("stroke-dashoffset", totalLengthInnerRing)
    .transition()
    .duration(innerRingDuration)
    .delay(innerRingDelay)
    .attr("stroke-dashoffset", 0);

  innerRingCircles
    .transition()
    .style("opacity", "0")
    .transition()
    .duration(innerRingCirclesDuration)
    .delay(function(d) {
      return circleDelay + d * circleDuration;
    })
    .style("opacity", "1");
}

// ANIMATIONS – The last animations (Reverse)
function playInnerRingAnimationReverse(
  innerRingDelay,
  innerRingDuration,
  innerRingCirclesDuration,
  circleDelay,
  circleDuration
) {
  var totalLengthInnerRing = innerRing.node().getTotalLength();
  innerRing
    .attr("stroke-dasharray", totalLengthInnerRing + " " + totalLengthInnerRing)
    .attr("stroke-dashoffset", 0)
    .transition()
    .duration(innerRingDuration)
    .delay(innerRingDelay)
    .attr("stroke-dashoffset", -totalLengthInnerRing);

  innerRingCircles
    .transition()
    .style("opacity", "1")
    .transition()
    .duration(innerRingCirclesDuration)
    .delay(function(d) {
      return circleDelay + d * circleDuration;
    })
    .style("opacity", "0");
}

function playInnerText(circleDuration, circleDelay) {
  var fadeText = innerGroup
    .append("circle")
    .attr("cy", 150 / 2)
    .attr("cx", 150 / 2)
    .attr("r", 150 / 2 - 10)
    .style("stroke", "#263238")
    .style("stroke-width", 14)
    .style("fill", "none");

  var totalLengthFadeText = fadeText.node().getTotalLength();

  fadeText
    .attr("stroke-dasharray", totalLengthFadeText + " " + totalLengthFadeText)
    .attr("stroke-dashoffset", 0)
    .transition()
    .duration(circleDuration)
    .delay(circleDelay)
    .attr("stroke-dashoffset", -totalLengthFadeText);
}

// Play animations

playCentralCanvasInnerAnimation(2000, 500);

playInnerText(2000, 500);


// ANCHOR demo rings

var demo = centralCanvasInner.append("g").attr("id", "demo");
var demoRings = demo.append("g").attr("id", "demoRings");

var drawDemoRing1 = demoRings
  .append("circle")
  .attr("cy", 150 / 2)
  .attr("cx", 150 / 2)
  .attr("r", function(d) {
    return 150 * 1;
  })
  .style("stroke", "#6F787F")
  .style("stroke-width", 1)
  .style("fill", "none");
var totalLengthRing1 = drawDemoRing1.node().getTotalLength();
console.log(totalLengthRing1);

drawDemoRing1
  .attr("stroke-dasharray", totalLengthRing1 + " " + totalLengthRing1)
  .attr("stroke-dashoffset", totalLengthRing1);

var drawDemoRing2 = demoRings
  .append("circle")
  .attr("cy", 150 / 2)
  .attr("cx", 150 / 2)
  .attr("r", function(d) {
    return 150 * 2;
  })
  .style("stroke", "#6F787F")
  .style("stroke-width", 1)
  .style("fill", "none");
var totalLengthRing2 = drawDemoRing2.node().getTotalLength();
drawDemoRing2
  .attr("stroke-dasharray", totalLengthRing2 + " " + totalLengthRing2)
  .attr("stroke-dashoffset", totalLengthRing2);

function playDemoRing1Animation(duration, delay) {
  console.log('Drawed 1 ring');
  
  drawDemoRing1
    .transition()
    .duration(duration)
    .delay(delay)
    .attr("stroke-dashoffset", 0);
}
function playDemoRing1AnimationReverse(duration, delay) {
  drawDemoRing1
    .transition()
    .duration(duration)
    .delay(delay)
    .attr("stroke-dashoffset", -totalLengthRing1);
}

function playDemoRing2Animation(duration, delay) {
  console.log('Drawed 2 ring');
  drawDemoRing2
    .transition()
    .duration(duration)
    .delay(delay)
    .attr("stroke-dashoffset", 0);
}
function playDemoRing2AnimationReverse(duration, delay) {
  drawDemoRing2
    .transition()
    .duration(duration)
    .delay(delay)
    .attr("stroke-dashoffset", -totalLengthRing2);
}

var demoCircles = [
  {
    id: 1,
    angle: 180 + 45,
    ring: 1,
    size: 10,
    color: "white"
  },
  {
    id: 2,
    angle: 180 + 135,
    ring: 1,
    size: 18,
    color: "white"
  },
  {
    id: 3,
    angle: 180 + 45,
    ring: 1,
    size: 10,
    color: "#1EBEBE"
  },
  {
    id: 4,
    angle: 180 + 135,
    ring: 1,
    size: 18,
    color: "#E34A1F"
  },
  {
    id: 5,
    angle: 0,
    ring: 1,
    size: 6,
    color: "#665A51"
  },
  {
    id: 6,
    angle: -90,
    ring: 2,
    size: 10,
    color: "#665A51"
  }
];

// ANCHOR demo circles
var drawDemoCircles = demo
  .append("g")
  .attr("id", "demoCircles")
  .selectAll("circles")
  .data(demoCircles)
  .enter()
  .append("circle")
  .attr("id", function(d) {
    return "demoCircle" + d.id;
  })
  .style("opacity", 0)
  .attr("cx", function(d) {
    return 150 / 2 + 150 * d.ring * Math.cos((d.angle * Math.PI) / 180);
  })
  .attr("cy", function(d) {
    return 150 / 2 + 150 * d.ring * Math.sin((d.angle * Math.PI) / 180);
  })
  .attr("r", function(d) {
    return d.size;
  })
  .attr("fill", function(d) {
    return d.color;
  });

function playCircleAnimation(item, circleDuration, circleDelay) {
  console.log('Drawed ' + item + ' circle');
  var element = d3.select("#demoCircle" + item);
  element
    .transition()
    .duration(circleDuration)
    .delay(circleDelay)
    .style("opacity", 1);
}

function playCircleAnimationReverse(item, circleDuration, circleDelay) {
  var element = d3.select("#demoCircle" + item);
  element
    .transition()
    .duration(circleDuration)
    .delay(circleDelay)
    .style("opacity", 0);
}

function playCanvasAnimation(duration, delay) {
  canvas
    .transition()
    .duration(duration)
    .delay(delay)
    .style("display", "block")
    .style("opacity", 1);
}
function playCanvasAnimationReverse(duration, delay) {
  canvas
    .transition()
    .duration(duration)
    .delay(delay)
    .style("opacity", 0)
    .transition()
    .duration(duration)
    .delay(delay + duration)
    .style("display", "none");
}


// ANCHOR Steps
function getSVGElementPositionX(element) {
  var x = d3.select(element).node().getBoundingClientRect().x;

  return x;
}
function getSVGElementPositionY(element) {
  var y = d3.select(element).node().getBoundingClientRect().y;

  return y;
}

var steps = {
  1: {
    type: "tooltip",
    text:
      "This is the <b>safe and just space</b> for humanity, where both people and the earth can thrive.",
    position: "left",
    width: "350px",
    x: vw / 2 + 150,
    y: vh / 2 - 150 / 2
  },
  2: {
    type: "tooltip",
    text: "This dot represents a <b>country</b>.",
    position: "right",
    width: "350px",
    x: getSVGElementPositionX('#demoCircle1') - stepsWidth - 50,
    y: getSVGElementPositionY('#demoCircle1') - 102/2 + 10
  },
  3: {
    type: "tooltip",
    text:
      "The bigger its size, the higher the ecological footprint for the average citizen, or how much of Earth's resources it takes to support their lifestyle.",
    position: "bottom",
    width: "350px",
    x: getSVGElementPositionX('#demoCircle2') - stepsWidth/10 - 20,
    y: getSVGElementPositionY('#demoCircle2') - 195 - 30
  },
  4: {
    type: "tooltip",
    text:
      "Blue dots score very high on the <b>Human Development Index</b>. People in these countries have stable governments, widespread education and healthcare, high life expectancies, and growing, powerful economies.",
    position: "bottom",
    width: "350px",
    x: getSVGElementPositionX('#demoCircle3') - stepsWidth/10 - 28,
    y: getSVGElementPositionY('#demoCircle3') - 241 - 70
  },
  5: {
    type: "tooltip",
    text:
      "Orange dots score on the lower end of the Human Development Index. People in these countries often face unstable governments, widespread poverty, lack of access to healthcare, and poor education. They often also have low incomes and low life expectancies, coupled with high birth rates.",
    position: "left-top",
    width: "350px",
    x: getSVGElementPositionX('#demoCircle4') + 90,
    y: getSVGElementPositionY('#demoCircle4') - 40
  },
  6: {
    type: "tooltip",
    text: "Brine dots are somewhere in between.",
    position: "left",
    width: "350px",
    x: getSVGElementPositionX('#demoCircle5') + 50,
    y: getSVGElementPositionY('#demoCircle5') - 126/2 + 6
  },
  7: {
    type: "tooltip",
    text:
      "<b>How far</b> a dot is from the safe and just space is a combination of both: the closer the dot, the less its consumption patterns deplete of Earth’s resources, or the better it meets human development needs, or both.",
    position: "left-top",
    width: "350px",
    x: getSVGElementPositionX('#demoCircle6') + stepsWidth/10 + 20,
    y: getSVGElementPositionY('#demoCircle6') - 40
  },
  8: {
    type: "tooltip",
    text:
      "An ideal world would look something like this: countries that provide for their citizens, within the means of the planet.",
    position: "bottom",
    width: "350px",
    x: vw/2 - stepsWidth/2 + 100,
    y: vh/2 - 150 - 150
  },
  9: {
    type: "tooltip",
    text:
      "Instead, this is how we currently fare. No country has yet to make it to the safe and just space for humanity. Some countries are close, others are far away; each starts from a different point on the map, but all have a distance to go.",
    position: "",
    width: "500px",
    x: vw/2 - 500/2,
    y: vh - 300
  },
  10: {
    type: "modal",
    title: "The circular economy can help close this distance.",
    text: "The circular economy provides a systematic approach to reach a safe and just space. By designing out waste and pollution, keeping products and materials in use for as long as possible, and regenerating natural systems, it promises to provide for people’s needs, without transgressing the boundaries of the planet. ",
    position: "",
    width: "50vw",
    x: 0,
    y: 0
  },
  11: {
    type: "modal",
    title: "Countries are especially well positioned to accelerate the transition.",
    text: "They have the mandate to create the right environment for the transition – through national legislation, for exampel. As lead investors in infrastructure and government buildings and assets, their procurement strategies can help scale circularity. They are also the leading actors in supranational and multilateral coordination – think of alliances like the United Nations, the African Union, and the European Union.</br></br>What the transition to a circular economy for your country looks like depends on where you lie on the map/galaxy (whatever we call it).",
    position: "",
    width: "50vw",
    x: 0,
    y: 0
  },
  12: {
    type: "tooltip",
    text:
      "<b>‘Build’</b> countries live within planetary boundaries but still need to build an economic system that satisfies their society’s basic needs. Examples include India, Nigeria and the Philippines.",
    position: "",
    width: "500px",
    x: vw/2 - 500/2,
    y: vh - 300
  },
  13: {
    type: "tooltip",
    text:
      "<b>‘Grow’</b> countries need to continue growing in a way that satisfies their societal needs, but need to do so within planetary boundaries. Examples include China, Indonesia and Brazil.",
    position: "",
    width: "500px",
    x: vw/2 - 500/2,
    y: vh - 300
  },
  14: {
    type: "tooltip",
    text:
      "<b>‘Shift’</b> countries need to shift away from over-consuming the planet’s resources in servicing their relatively affluent and comfortable lifestyles. Examples include the United States, Japan, and countries in the EU.",
    position: "",
    width: "500px",
    x: vw/2 - 500/2,
    y: vh - 300
  },
  15: {
    type: "modal",
    title: "It’s not a</br>one-size-fits-all.",
    text: "Different transition pathways exist for different country profiles. Find out where your country lies on the map, and learn more about what it can do to close the circularity gap for its profile below.",
    position: "",
    width: "50vw",
    x: 50,
    y: 50
  },
  16: {
    type: "end",
    text: "Placeholder for the latest screen",
    position: "",
    x: 50,
    y: vh - vh / 5
  }
};

// Steps
var currentStep = 1;

// ANCHOR Draw step
var stepsControl = d3
  .select("#steps")
  .append("div")
  .attr("class", "stepsControl");
var back = d3
  .select(".stepsControl")
  .append("button")
  .attr("class", "stepsControlBack")
  .text("Back");
var next = d3
  .select(".stepsControl")
  .append("button")
  .attr("class", "stepsControlNext")
  .text("Next");

function showModalWrapper() {
  var modalsWrapper = d3
      .select(".modalsWrapper")
      .style("display", "block")
      .transition()
      .duration(1000)
      .delay(1)
      .style("opacity", 1);
  
  return modalsWrapper;
}
function hideModalWrapper() {
  var modalsWrapper = d3
      .select(".modalsWrapper")
      .transition()
      .duration(1000)
      .delay(1)
      .style("opacity", 0)
      .transition()
      .duration(1000)
      .delay(1000)
      .style("display", "none");
  
  return modalsWrapper;
}

function drawStep(stepId, stepIdOld, duration, delay) {
  // Removing the step
  var oldStep = d3.selectAll(".step").filter(function() {
    return "[stepidold=" + stepIdOld + "]";
  });
  var oldModal = d3.selectAll(".modal").filter(function() {
    return "[stepidold=" + stepIdOld + "]";
  });

  if (oldStep.node() != null) {
    oldStep.node().remove();
  }

  if (oldModal.node() != null) {
    oldModal.node().remove();
  }

  if (steps[currentStep].type == "tooltip") {
    var drawSteps = d3
      .select("#steps")
      .style("display", "flex")
      .style("left", steps[currentStep].x + "px")
      .style("right", "")
      .style("top", steps[currentStep].y + "px")
      .style("opacity", "0")
      .style("width", steps[currentStep].width)
      .style("height", "")
      .style("transform", "translate(0px, 20px)")
      .transition()
      .duration(duration)
      .delay(delay)
      .style("opacity", "1")
      .style("transform", "translate(0px, 0px)");

    var drawStepItem = d3
      .select("#steps")
      .append("div")
      .attr("data-stepid", stepId)
      .attr("data-stepidold", stepIdOld)
      .attr(
        "class",
        "step step-" + stepId + " step-position-" + steps[currentStep].position
      )
      .html(steps[currentStep].text);

      stepsControl.attr("class", "stepsControl");
      back.attr("class", "stepsControlBack");
      next.attr("class", "stepsControlNext");
  } else if (steps[currentStep].type == "modal") {
    // stepsControl.node().classList.add('stepsControlModal');

    var drawSteps = d3
      .select("#steps")
      .style("display", "flex")
      .style("right", "0")
      .style("left", "")
      .style("top", "0")
      .style("opacity", "0")
      .style("width", steps[currentStep].width)
      .style("height", "100vh")
      .style("transform", "translate(" + steps[currentStep].width + ", 0vh)")
      .transition()
      .duration(duration)
      .delay(delay)
      .style("opacity", "1")
      .style("transform", "translate(0vw, 0vh)");

    var drawStepItem = d3
      .select("#steps")
      .append("div")
      .attr("data-stepid", stepId)
      .attr("data-stepidold", stepIdOld)
      .attr("class", "modal modal-" + stepId)
      .html(
        '<span class="modal-title">' +
          steps[currentStep].title +
          "</span>" +
          '<span class="modal-text">' +
          steps[currentStep].text +
          "</span>"
      );
    stepsControl.attr("class", "stepsControlModal");
    back.attr("class", "stepsControlBackModal");
    next.attr("class", "stepsControlNextModal");
    // drawStepControls('.modal-' + stepId, 'stepsControlModal');
  }
}

function hideAllSteps() {
  var drawSteps = d3
      .select("#steps")
      .style("display", 'none')
}

drawStep(1, 1, 1000, 600);


// SECTION Next button
next.node().addEventListener("click", function() {
  ++currentStep;
  if (currentStep == 2) {
    // ANCHOR Animation 2
    drawStep(3, 2, 1000, 600);

    playDemoRing1Animation(1000, 500);
    playCircleAnimation(1, 1000, 1500);
  } else if (currentStep == 3) {
    // ANCHOR Animation 3
    drawStep(4, 3, 1000, 600);
    playCircleAnimation(2, 1000, 1000);
  } else if (currentStep == 4) {
    // ANCHOR Animation 4
    drawStep(5, 4, 1000, 600);
    playCircleAnimationReverse(1, 1000, 1000);
    playCircleAnimation(3, 1000, 1000);
  } else if (currentStep == 5) {
    // ANCHOR Animation 5
    drawStep(6, 5, 1000, 600);
    playCircleAnimationReverse(2, 1000, 1000);
    playCircleAnimation(4, 1000, 1000);
  } else if (currentStep == 6) {
    // ANCHOR Animation 6
    drawStep(7, 6, 1000, 600);
    playCircleAnimation(5, 1000, 1000);
  } else if (currentStep == 7) {
    // ANCHOR Animation 7
    drawStep(8, 7, 1000, 600);
    playCircleAnimation(6, 1000, 1000);
    playDemoRing2Animation(1000, 500);
  } else if (currentStep == 8) {
    // ANCHOR Animate Show countries
    drawStep(9, 8, 1000, 600);
    playCircleAnimationReverse(3, 1000, 100);
    playCircleAnimationReverse(4, 1000, 200);
    playCircleAnimationReverse(5, 1000, 300);
    playCircleAnimationReverse(6, 1000, 400);

    playDemoRing2AnimationReverse(1000, 800);
    playDemoRing1AnimationReverse(1000, 1200);

    playInnerRingAnimation(1000, 1500, 500, 1000, 30);
  } else if (currentStep == 9) {
    drawStep(10, 9, 1000, 600);
    // ANCHOR Animation 9
    playInnerRingAnimationReverse(500, 1500, 500, 0, 30);
    playCanvasAnimation(1000, 2000);
  } else if (currentStep == 10) {
    // ANCHOR Animate – First white modal
    showModalWrapper();
    drawStep(11, 10, 1000, 600);
  } else if (currentStep == 11) {
    drawStep(12, 11, 1000, 600);
  } else if (currentStep == 12) {
    drawStep(13, 12, 1000, 600);
    hideModalWrapper();

    showCoutriesType(countriesBuildArray, 1000, 500);
    hideCoutriesType(countriesGrowArray, 1000, 500);
    hideCoutriesType(countriesShiftArray, 1000, 500);
  } else if (currentStep == 13) {
    drawStep(14, 13, 1000, 600);

    hideCoutriesType(countriesBuildArray, 1000, 500);
    showCoutriesType(countriesGrowArray, 1000, 500);
    hideCoutriesType(countriesShiftArray, 1000, 500);
  } else if (currentStep == 14) {
    drawStep(15, 14, 1000, 600);

    hideCoutriesType(countriesBuildArray, 1000, 500);
    hideCoutriesType(countriesGrowArray, 1000, 500);
    showCoutriesType(countriesShiftArray, 1000, 500);
  } else if (currentStep == 15) {
    // ANCHOR Animation 16
    drawStep(16, 15, 1000, 600);
    showModalWrapper();

    hideCoutriesType(countriesBuildArray, 1000, 500);
    hideCoutriesType(countriesGrowArray, 1000, 500);
    showCoutriesType(countriesShiftArray, 1000, 500);
  } else if (currentStep == 16) {
    drawStep(17, 16, 1000, 600);
    hideModalWrapper();
    hideAllSteps();

    playFilterAnimation(1000, 500);
    playLegendAnimation(1000, 500);

    showCoutriesType(countriesBuildArray, 1000, 500);
    showCoutriesType(countriesGrowArray, 1000, 500);
    showCoutriesType(countriesShiftArray, 1000, 500);

    d3.select('.canvasWrapper').style('overflow', '');
  }

  // console.log('Pressed on the next button. The current step is: ' + currentStep);
  
});
// !SECTION
// console.log('The initial step: ' + currentStep);

// SECTION Back button
back.node().addEventListener("click", function() {
  --currentStep;
  if (currentStep == 1) {
    // ANCHOR Animation 1
    drawStep(1, 2, 1000, 600);
    playCircleAnimationReverse(1, 1000, 0);
    playDemoRing1AnimationReverse(1000, 1000);
  } else if (currentStep == 2) {
    // ANCHOR Animation 2
    drawStep(2, 3, 1000, 600);
    playCircleAnimationReverse(2, 1000, 0);
  } else if (currentStep == 3) {
    // ANCHOR Animation 3
    drawStep(3, 4, 1000, 600);
    playCircleAnimation(1, 1000, 0);
    playCircleAnimationReverse(3, 1000, 0);
  } else if (currentStep == 4) {
    // ANCHOR Animation 4
    drawStep(4, 5, 1000, 600);
    playCircleAnimation(2, 1000, 0);
    playCircleAnimationReverse(4, 1000, 0);
  } else if (currentStep == 5) {
    // ANCHOR Animation 5
    drawStep(5, 6, 1000, 600);
    playCircleAnimationReverse(5, 1000, 0);
  } else if (currentStep == 6) {
    // ANCHOR Animation 6
    drawStep(6, 7, 1000, 600);
    playCircleAnimationReverse(6, 1000, 0);
    playDemoRing2AnimationReverse(1000, 1000);
    // ANCHOR Animation 7
  } else if (currentStep == 7) {
    drawStep(7, 8, 1000, 600);
    playCircleAnimation(3, 1000, 1200);
    playCircleAnimation(4, 1000, 1100);
    playCircleAnimation(5, 1000, 1000);
    playCircleAnimation(6, 1000, 900);

    playDemoRing2Animation(1000, 400);
    playDemoRing1Animation(1000, 800);

    playInnerRingAnimationReverse(500, 1500, 500, 0, 30);
  } else if (currentStep == 8) {
    // ANCHOR Animation 8
    drawStep(8, 9, 1000, 600);
    playInnerRingAnimation(1000, 1500, 500, 1000, 30);
    playCanvasAnimationReverse(1000, 0);
  } else if (currentStep == 9) {
    drawStep(9, 10, 1000, 600);
    hideModalWrapper();
  } else if (currentStep == 10) {
    drawStep(10, 11, 1000, 600);
  } else if (currentStep == 11) {
    console.log('NOW');
    drawStep(11, 12, 1000, 600);
    showModalWrapper();

    showCoutriesType(countriesBuildArray, 1000, 500);
    showCoutriesType(countriesGrowArray, 1000, 500);
    showCoutriesType(countriesShiftArray, 1000, 500);
  } else if (currentStep == 12) {
    drawStep(12, 13, 1000, 600);

    showCoutriesType(countriesBuildArray, 1000, 500);
    hideCoutriesType(countriesGrowArray, 1000, 500);
    hideCoutriesType(countriesShiftArray, 1000, 500);
  } else if (currentStep == 13) {
    // ANCHOR Animation 13
    drawStep(13, 14, 1000, 600);
    hideCoutriesType(countriesBuildArray, 1000, 500);
    showCoutriesType(countriesGrowArray, 1000, 500);
    hideCoutriesType(countriesShiftArray, 1000, 500);
  } else if (currentStep == 14) {
    // ANCHOR Animation 14
    drawStep(14, 15, 1000, 600);
    hideModalWrapper();

    hideCoutriesType(countriesBuildArray, 1000, 500);
    hideCoutriesType(countriesGrowArray, 1000, 500);
    showCoutriesType(countriesShiftArray, 1000, 500);
  } else if (currentStep == 15) {
    // ANCHOR Animation 15
    drawStep(15, 16, 1000, 600);

    hideCoutriesType(countriesBuildArray, 1000, 500);
    showCoutriesType(countriesGrowArray, 1000, 500);
    hideCoutriesType(countriesShiftArray, 1000, 500);
    playFilterAnimationReverse(1000, 500);
    playLegendAnimationReverse(1000, 500);
  }

  // console.log('Pressed on the back button. The current step is: ' + currentStep);
});
// !SECTION
