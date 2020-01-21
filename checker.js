// Main config
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
  .select("svg")
  .append("g")
  .attr('id', 'solarSystem')
  .attr("width", width)
  .attr("height", height)
  .style('opacity', 1);

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

    countriesArray.push({
      name: countryName,
      position: countryPosition,
      color: countryColor,
      radius: countryRadius,
      ring: countryRing,
      type: countryType,
      hdi: countryHdi,
      ef: countryEf
    });
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
      .append("g");
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

console.log(countriesArray);


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
var defs = canvas.append("defs");

var filter = defs
  .append("filter")
  .attr("id", "planetBackgroundShadow")
  .attr("height", "130%");

filter
  .append("feGaussianBlur")
  .attr("in", "SourceAlpha")
  .attr("stdDeviation", 50)
  .attr("result", "blur");

var feMegre = filter.append("feMerge");

feMegre.append("feMergeNode").append("in", "offsetBlur");
feMegre.append("feMergeNode").append("in", "SourceGraphic");

canvas
  .append("circle")
  .attr("class", "planetBackground")
  .attr("cy", originY)
  .attr("cx", originX)
  .attr("r", 46)
  .style("fill", "#283338")
  .style("filter", "url(#drop-shadow)");


































































  // ANIMATIONS PART START
  var stepsWidth = 350;

var centralCanvas = d3
  .select("#centralCanvas")
  .attr("width", width)
  .attr("height", height);

var numberOfInnerRingCircles = 36;
var arrayOfInnerRingCircles = [];

for (var i = -1; i < numberOfInnerRingCircles+1; i++) { 
    arrayOfInnerRingCircles.push(i);
}



var centralCanvasInnerWidth = d3.select("#centralCanvasInner").attr("width");
var centralCanvasInnerHeight = d3.select("#centralCanvasInner").attr("height");

var centralCanvasInner = d3
  .select("#centralCanvasInner")
  .style('opacity', '0')
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
      .style('opacity', '1')
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

// var demoDots = {

// };



// Tooltips
var steps = {
    1: {
        text: "This is the <b>safe and just space</b> for humanity, where both people and the earth can thrive.",
        position: "left",
        x: width / 2 - centralCanvasInnerWidth / 2 - stepsWidth/2 + 100,
        y: height / 2 - centralCanvasInnerHeight / 2
    }, 
    2: {
        text: "This dot represents a <b>country</b>.",
        position: "right",
        x: width / 2 - centralCanvasInnerWidth / 2 - stepsWidth - 400,
        y: height / 2 - centralCanvasInnerHeight / 2 - 80
    },
    3: {
        text: "The bigger its size, the higher the ecological footprint for the average citizen, or how much of Earth's resources it takes to support their lifestyle.",
        position: "bottom",
        x: width / 2 - centralCanvasInnerWidth / 2 - 150/2 - 90,
        y: height / 2 - centralCanvasInnerHeight / 2 - 300
    },
    4: {
        text: "Blue dots score very high on the <b>Human Development Index</b>. People in these countries have stable governments, widespread education and healthcare, high life expectancies, and growing, powerful economies.",
        position: "bottom",
        x: width / 2 - centralCanvasInnerWidth / 2 - stepsWidth - 30,
        y: height / 2 - centralCanvasInnerHeight / 2 - 400
    },
    5: {
        text: "Orange dots score on the lower end of the Human Development Index. People in these countries often face unstable governments, widespread poverty, lack of access to healthcare, and poor education. They often also have low incomes and low life expectancies, coupled with high birth rates.",
        position: "left-top",
        x: width / 2 - centralCanvasInnerWidth / 2,
        y: height / 2 - centralCanvasInnerHeight / 2 - 85
    },
    6: {
        text: "Brine dots are somewhere in between.",
        position: "left",
        x: width / 2 - centralCanvasInnerWidth / 2,
        y: height / 2 - centralCanvasInnerHeight / 2 + 12
    },
    7: {
        text: "<b>How far</b> a dot is from the safe and just space is a combination of both: the closer the dot, the less its consumption patterns deplete of Earth’s resources, or the better it meets human development needs, or both.",
        position: "left-top",
        x: width / 2 - centralCanvasInnerWidth / 2 - 160,
        y: height / 2 - centralCanvasInnerHeight / 2 - 273
    },
    8: {
        text: "An ideal world would look something like this: countries that provide for their citizens, within the means of the planet.",
        position: "bottom",
        x: width / 2 - centralCanvasInnerWidth / 2 - 275,
        y: height / 2 - centralCanvasInnerHeight / 2 - 220
    },
    9: {
        text: "Instead, this is how we currently fare. No country has yet to make it to the safe and just space for humanity. Some countries are close, others are far away; each starts from a different point on the map, but all have a gap to bridge/distance to go.",
        position: "",
        x: width / 2 - centralCanvasInnerWidth / 2,
        y: height / 2 - centralCanvasInnerHeight / 2 - 100
    },
    10: {
        text: "<b>‘Build’</b> countries live within planetary boundaries but still need to build an economic system that satisfies their society’s basic needs. Examples include India, Nigeria and the Philippines.",
        position: "",
        x: width / 2 - centralCanvasInnerWidth / 2,
        y: height / 2 - centralCanvasInnerHeight / 2 - 100
    },
    11: {
        text: "<b>‘Grow’</b> countries need to continue growing in a way that satisfies their societal needs, but need to do so within planetary boundaries. Examples include China, Indonesia and Brazil.",
        position: "",
        x: width / 2 - centralCanvasInnerWidth / 2,
        y: height / 2 - centralCanvasInnerHeight / 2 - 100
    },
    12: {
        text: "<b>‘Shift’</b> countries need to shift away from over-consuming the planet’s resources in servicing their relatively affluent and comfortable lifestyles. Examples include the United States, Japan, and countries in the EU.",
        position: "",
        x: width / 2 - centralCanvasInnerWidth / 2,
        y: height / 2 - centralCanvasInnerHeight / 2 - 100
    }
};



function getPositionXInner(item) {
  var currentPosition = item;
  var ringAngleStep = 360 / numberOfInnerRingCircles;
  var currentAngle = ringAngleStep * currentPosition;    

  return (150/2) + (150/2 - 20) * Math.cos((currentAngle * Math.PI) / 180);
}
function getPositionYInner(item) {
  var currentPosition = item;
  var ringAngleStep = 360 / numberOfInnerRingCircles;
  var currentAngle = ringAngleStep * currentPosition;   

  return (150/2) + (150/2 - 20) * Math.sin((currentAngle * Math.PI) / 180);
}


// ANIMATIONS – The last animations
var innerGroup = centralCanvasInner.append('g').attr('id', 'innerContent');
var innerRing = innerGroup
                .append("circle")
                .attr("cy", 150/2)
                .attr("cx", 150/2)
                .attr('r', 150/2 - 20)
                .style("stroke", "#6F787F")
                .style("stroke-width", 1)
                .style("fill", "none")
                .style("opacity", 0);
var innerRingCircles = innerGroup.selectAll('circle').data(arrayOfInnerRingCircles).enter()
                .append('circle')
                .attr('cx', function(d) {                                
                    return getPositionXInner(d);
                })
                .attr('cy', function(d) {
                    return getPositionYInner(d);
                })
                .attr('r', 2)
                .attr('fill', '#00C1F2')
                .style('opacity', '0')
function playInnerRingAnimation(innerRingDelay, innerRingDuration, innerRingCirclesDuration, circleDelay, circleDuration) {
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
        .style('opacity', '0')
    .transition()
        .duration(innerRingCirclesDuration)
        .delay(function(d) {
            return circleDelay + (d * circleDuration);
        })
        .style('opacity', '1');
}

// ANIMATIONS – The last animations (Reverse)
function playInnerRingAnimationReverse(innerRingDelay, innerRingDuration, innerRingCirclesDuration, circleDelay, circleDuration) {
  var totalLengthInnerRing = innerRing.node().getTotalLength();
  innerRing
    .attr("stroke-dasharray", totalLengthInnerRing + " " + totalLengthInnerRing)
    .attr("stroke-dashoffset", 0)
    .transition()
    .duration(innerRingDuration)
    .delay(innerRingDelay)
    .attr("stroke-dashoffset", -totalLengthInnerRing)
    // .style("opacity", 0);

  innerRingCircles
    .transition()
        .style('opacity', '1')
    .transition()
        .duration(innerRingCirclesDuration)
        .delay(function(d) {
            return circleDelay + (d * circleDuration);
        })
        .style('opacity', '0');
}








function playInnerText(circleDuration, circleDelay) {
  var fadeText = innerGroup.append('circle')
      .attr("cy", 150/2)
      .attr("cx", 150/2)
      .attr('r', 150/2 - 10)
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

// playCentralCanvasInnerAnimation(2000, 500)

// playInnerText(2000, 500);












// Steps
var currentStep = 0;

var drawSteps = d3.select('#steps')
  .style('left', steps[currentStep].x + 350/2+100 + 'px')
  .style('top', steps[currentStep].y + 'px')
  .style('opacity', '0')
  .style('transform', 'translate(0px, 20px)')
  .transition()
  .duration(1200)
  .delay(1500)
  .style('opacity', '1')
  .style('transform', 'translate(0px, 0px)');

var drawStepTip = d3.select('#steps').append('div')
  .attr('class', 'step step-' + steps[currentStep].position)
  .html(steps[currentStep].text);


var back = d3.select('.stepsControl').append('button')
    .attr('class', 'stepsControlBack')
    .text('Back');
var next = d3.select('.stepsControl').append('button')
    .attr('class', 'stepsControlNext')
    .text('Next');

// Check first and the lest steps for show or hide controls
function setSteps(delay) {
  var drawSteps = d3.select('#steps')
    .style('left', steps[currentStep].x + 350/2+100 + 'px')
    .style('top', steps[currentStep].y + 'px')
    .style('opacity', '0')
    .style('transform', 'translate(0px, 20px)')
    .transition()
    .duration(1200)
    .delay(delay)
    .style('opacity', '1')
    .style('transform', 'translate(0px, 0px)');
  if (currentStep == 1) {
    back.style('display', 'none');
  } else if (currentStep == 12) {
    next.style('display', 'none');
  } else {
    back.style('display', 'flex');
    next.style('display', 'flex');
  }
}

// setSteps(1000);



var demo = centralCanvasInner.append('g').attr('id', 'demo');
var demoRings = demo.append('g').attr('id', 'demoRings');

var drawDemoRing1 = demoRings
  .append("circle")
  .attr("cy", 150/2)
  .attr("cx", 150/2)
  .attr('r', function(d) {
    return 150 * 1;
  })
  .style("stroke", "#6F787F")
  .style("stroke-width", 1)
  .style("fill", "none");
var totalLengthRing1 = drawDemoRing1.node().getTotalLength();
drawDemoRing1
  .attr("stroke-dasharray", totalLengthRing1 + " " + totalLengthRing1)
  .attr("stroke-dashoffset", totalLengthRing1)


var drawDemoRing2 = demoRings
  .append("circle")
  .attr("cy", 150/2)
  .attr("cx", 150/2)
  .attr('r', function(d) {
    return 150 * 2;
  })
  .style("stroke", "#6F787F")
  .style("stroke-width", 1)
  .style("fill", "none");
var totalLengthRing2 = drawDemoRing2.node().getTotalLength();
drawDemoRing2
  .attr("stroke-dasharray", totalLengthRing2 + " " + totalLengthRing2)
  .attr("stroke-dashoffset", totalLengthRing2)


function playDemoRing1Animation(duration, delay) {
  drawDemoRing1
    .transition()
    .duration(duration)
    .delay(delay)
    .attr("stroke-dashoffset", 0)
}
function playDemoRing1AnimationReverse(duration, delay) {
  drawDemoRing1
    .transition()
    .duration(duration)
    .delay(delay)
    .attr("stroke-dashoffset", -totalLengthRing1)
}


function playDemoRing2Animation(duration, delay) {
  drawDemoRing2
    .transition()
    .duration(duration)
    .delay(delay)
    .attr("stroke-dashoffset", 0)
}
function playDemoRing2AnimationReverse(duration, delay) {
  drawDemoRing2
    .transition()
    .duration(duration)
    .delay(delay)
    .attr("stroke-dashoffset", -totalLengthRing2)
}


var demoCircles = [
  {
    id: 1,
    angle: 180+45,
    ring: 1,
    size: 10,
    color: "white"
  },
  {
    id: 2,
    angle: 180+135,
    ring: 1,
    size: 18,
    color: "white"
  },
  {
    id: 3,
    angle: 180+45,
    ring: 1,
    size: 10,
    color: "#3FA9F5"
  },
  {
    id: 4,
    angle: 180+135,
    ring: 1,
    size: 18,
    color: "#FF8532"
  },
  {
    id: 5,
    angle: 0,
    ring: 1,
    size: 6,
    color: "#9A845D"
  },
  {
    id: 6,
    angle: -90,
    ring: 2,
    size: 10,
    color: "#9A845D"
  }
];

var drawDemoCircles = demo.append('g').attr('id', 'demoCircles').selectAll('circles').data(demoCircles).enter()
  .append('circle')
  .attr('id', function(d) {
    return 'demoCircle' + d.id;
  })
  .style('opacity', 0)
  .attr('cx', function(d) {                                  
    return 150/2 + 150 * d.ring * Math.cos((d.angle * Math.PI) / 180);
  })
  .attr('cy', function(d) {
    return 150/2 + 150 * d.ring * Math.sin((d.angle * Math.PI) / 180);
  })
  .attr('r', function(d) {
    return d.size;
  })
  .attr('fill', function(d) {
    return d.color;
  });

function playCircleAnimation(item, circleDuration, circleDelay) {
  var element = d3.select('#demoCircle' + item);
  element
    .transition()
    .duration(circleDuration)
    .delay(circleDelay)
      .style('opacity', 1);
}

function playCircleAnimationReverse(item, circleDuration, circleDelay) {
  var element = d3.select('#demoCircle' + item);
  element
    .transition()
    .duration(circleDuration)
    .delay(circleDelay)
      .style('opacity', 0);
}

function playCanvasAnimation(duration, delay) {
  canvas
    .transition()
    .duration(duration)
    .delay(delay)
      .style('display', 'block')
      .style('opacity', 1)
}
function playCanvasAnimationReverse(duration, delay) {
  canvas
    .transition()
    .duration(duration)
    .delay(delay)
      .style('opacity', 1)
      .style('display', 'none')
}







next.node().addEventListener('click', function() {
  drawStepTip.node().remove();
  drawStepTip = d3.select('#steps').append('div')
    .attr('class', 'step step-' + steps[++currentStep].position)
    .html(steps[currentStep].text);  
  
  if(currentStep == 2) {
    playDemoRing1Animation(1000, 500);
    playCircleAnimation(1, 1000, 1500);
  } else if(currentStep == 3) {
    playCircleAnimation(2, 1000, 1000);
  } else if(currentStep == 4) {
    playCircleAnimationReverse(1, 1000, 1000);
    playCircleAnimation(3, 1000, 1000);
  } else if(currentStep == 5) {
    playCircleAnimationReverse(2, 1000, 1000);
    playCircleAnimation(4, 1000, 1000);
  } else if(currentStep == 6) {
    playCircleAnimation(5, 1000, 1000);
  } else if(currentStep == 7) {
    playCircleAnimation(6, 1000, 1000);
    playDemoRing2Animation(1000, 500);
  } else if(currentStep == 8) {
    playCircleAnimationReverse(3, 1000, 100);
    playCircleAnimationReverse(4, 1000, 200);
    playCircleAnimationReverse(5, 1000, 300);
    playCircleAnimationReverse(6, 1000, 400);

    playDemoRing2AnimationReverse(1000, 800);
    playDemoRing1AnimationReverse(1000, 1200);

    playInnerRingAnimation(1000, 1500, 500, 1000, 30);
  } else if(currentStep == 9) {
    playInnerRingAnimationReverse(1000, 0, 500, 0, 30);
    playCanvasAnimation(1000, 2000);
  } else if(currentStep == 10) {
    
  } else if(currentStep == 11) {
    
  } else if(currentStep == 12) {
    
  }

  setSteps(1000);
});

back.node().addEventListener('click', function() {
  drawStepTip.node().remove();
  drawStepTip = d3.select('#steps').append('div')
    .attr('class', 'step step-' + steps[--currentStep].position)
    .html(steps[currentStep].text);  
  
  if (currentStep == 1) {
    playCircleAnimationReverse(1, 1000, 0);
    playDemoRing1AnimationReverse(1000, 1000)
  } else if(currentStep == 2) {
    playCircleAnimationReverse(2, 1000, 0);
  } else if(currentStep == 3) {
    playCircleAnimation(1, 1000, 0);
    playCircleAnimationReverse(3, 1000, 0);
  } else if(currentStep == 4) {
    playCircleAnimation(2, 1000, 0);
    playCircleAnimationReverse(4, 1000, 0);
  } else if(currentStep == 5) {
    playCircleAnimationReverse(5, 1000, 0);
  } else if(currentStep == 6) {
    playCircleAnimationReverse(6, 1000, 0);
    playDemoRing2AnimationReverse(1000, 1000);
  } else if(currentStep == 7) {
    playCircleAnimation(3, 1000, 1200);
    playCircleAnimation(4, 1000, 1100);
    playCircleAnimation(5, 1000, 1000);
    playCircleAnimation(6, 1000, 900);

    playDemoRing2Animation(1000, 400);
    playDemoRing1Animation(1000, 800);

    playInnerRingAnimationReverse(1000, 0, 500, 0, 30);
  } else if(currentStep == 8) {
    
  } else if(currentStep == 9) {

  } else if(currentStep == 10) {
    
  } else if(currentStep == 11) {
    
  }

  setSteps(1000);
});