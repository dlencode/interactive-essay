// Main config
var width = 1800,
    height = 1800,
    radius = Math.min(width, height);

var arcStartAngle = 0,
    arcInnerRadius = width / 2 - 20,
    arcOuterRadius = width / 2 - 10,
    
    circleRadius = 10,
    anglePoint = 0;

var originX = width/2,  
    originY = height/2;

var canvas = d3.select("body").append("svg").attr("width", width).attr("height", height);

var div = d3.select('body').append("div").attr('class', 'tooltip').style('opacity', 0);


// Circle section
var sections = {
    section1: [337, 21],
    section2: [22, 66],
    section3: [67, 111],
    section4: [112, 156],
    section5: [157, 201],
    section6: [202, 246],
    section7: [247, 291],
    section8: [292, 336]
};



// Fetch data from Google Firebase
// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyCPify25a05i8K9Pq6vAKyVxdZBFMPB2jA",
    authDomain: "d3js-playground.firebaseapp.com",
    databaseURL: "https://d3js-playground.firebaseio.com",
    projectId: "d3js-playground",
    storageBucket: "d3js-playground.appspot.com",
    messagingSenderId: "363627602743",
    appId: "1:363627602743:web:d190a429d30abd0c4430b2"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var countries = firebase.database().ref('countries');

var countriesArray = [];

countries.once('value', function(snap){
    var promises = [];
    
    snap.forEach(function(country) {
        var countryName = country.key;
        var countryAngle = country.val().angle;
        var countryColor = country.val().color;
        var countryRadius = country.val().radius;
        var countryRing = country.val().ring;

        countriesArray.push({ "name": countryName, "angle": countryAngle, "color": countryColor, "radius": countryRadius, "ring": countryRing });
        promises.push(country.key);
    });

    Promise.all(promises).then(function(snapshots) {
        var group = canvas.selectAll("dot").data(countriesArray).enter().append('g');
        var dots = group.append("circle").attr('class', 'dot')
                        .on("mouseover", function(d){                               
                            div.transition()
                                .duration(300)
                                .style('opacity', 1);
                            div.html('<span class=tooltip-name>' + d.name + '</span><span class=tooltip-content>' + 'Radius: ' + d.radius + '</br>' + 'Ratings is: ' + '(' + d.radius / d.ring + ')</span>')
                                .style('left', (d3.event.pageX + "px"))
                                .style('top', (d3.event.pageY + "px"));                
                            
                        })
                        .on("mouseout", function(d){
                            div.transition()
                                .duration(300)
                                .style('opacity', 0);
                        });

        // var dotsWidth = dots.attr('data-width', function(d) {
        //     var textLabel = this.parentNode.getElementsByTagName('text');
        //     console.log(textLabel[textLabel.length]);
            

        //     // var textLenght = textLabel[0].getBBox().width;

        //     return 0;
        // })

        var dotsAttrs = dots.attr("cx", function(d) { return originX + ((150 * d.ring) * Math.sin(d.angle * Math.PI / 180)); })
                            .attr("cy", function(d) { return originY + ((150 * d.ring) * Math.cos(d.angle * Math.PI / 180)); })
                            .attr("r", function(d) { return d.radius * 10; })
                            .style("fill", function(d) { return d.color });
        
        var dotsNames = group.append('text')
                            .text( function (d) { return d.name; })
                            .attr("font-family", "Montserrat")
                            .attr("font-size", "9px")
                            .attr("font-weight", "500")
                            .attr('fill', '#808487')
                            .attr("x", function(d) {
                                var textLabel = this.parentNode.getElementsByTagName('text');
                                var textLenght = textLabel[0].getBBox().width;
                                var floored = Math.floor(textLenght)
                                
                                // X axis
                                var posX = (originX + ((150 * d.ring) * Math.sin(d.angle * Math.PI / 180)));
                                if (d.angle >= sections.section1[0] || d.angle < 360 && d.angle <= 0 || d.angle < sections.section1[1]) {
                                    return posX - floored/2;
                                } else if (d.angle >= sections.section2[0] && d.angle <= sections.section2[1]) {
                                    return posX + (d.radius * 10) + 3;
                                } else if (d.angle >= sections.section3[0] && d.angle <= sections.section3[1]) {
                                    return posX + (d.radius * 10) + 3;
                                } else if (d.angle >= sections.section4[0] && d.angle <= sections.section4[1]) {
                                    return posX + (d.radius * 10) + 3;
                                } else if (d.angle >= sections.section5[0] && d.angle <= sections.section5[1]) {
                                    return posX - (d.radius * 10) - floored/2;
                                } else if (d.angle >= sections.section6[0] && d.angle <= sections.section6[1]) {
                                    return posX - (d.radius * 10) - floored - 3;
                                } else if (d.angle >= sections.section7[0] && d.angle <= sections.section7[1]) {
                                    return posX - (d.radius * 10) - floored - 3;
                                } else if (d.angle >= sections.section8[0] && d.angle <= sections.section8[1]) {
                                    return posX - (d.radius * 10) - floored - 3;
                                }
                            })
                            .attr("y", function(d) {
                                var textLabel = this.parentNode.getElementsByTagName('text');
                                var textHeight = textLabel[0].getBBox().height;
                                var floored = Math.floor(textHeight)

                                // Y axis
                                var posY = (originY + ((150 * d.ring) * Math.cos(d.angle * Math.PI / 180)));
                                if (d.angle >= sections.section1[0] || d.angle < 360 && d.angle <= 0 || d.angle < sections.section1[1]) {
                                    return posY + (d.radius * 10) + floored + 3;
                                } else if (d.angle >= sections.section2[0] && d.angle < sections.section2[1]) {
                                    return posY - (d.radius * 10) + floored + 3;
                                } else if (d.angle >= sections.section3[0] && d.angle < sections.section3[1]) {
                                    return posY + (d.radius * 10) - floored/2 - 2;
                                } else if (d.angle >= sections.section4[0] && d.angle < sections.section4[1]) {
                                    return posY + (d.radius * 10) - floored - 3;
                                } else if (d.angle >= sections.section5[0] && d.angle < sections.section5[1]) {
                                    return posY + (d.radius * 10) - floored - 3;
                                } else if (d.angle >= sections.section6[0] && d.angle < sections.section6[1]) {
                                    return posY + (d.radius * 10) - floored + 2;
                                } else if (d.angle >= sections.section7[0] && d.angle < sections.section7[1]) {
                                    return posY + (d.radius * 10) - floored/2 - 2;
                                } else if (d.angle >= sections.section8[0] && d.angle < sections.section8[1]) {
                                    return posY + floored/2;
                                }
                            });
    })
})

// ––––––––––––––––––––––––––––––––––––––––––––––––

var rings = [1, 2, 3, 4, 5, 6]

var drawRings = canvas.selectAll('ring').data(rings).enter().append('circle')
                                    .attr('cy', originX)
                                    .attr('cx', originY)
                                    .attr('r', function(d) { return d * 150 })
                                    .style('stroke', '#6F787F')
                                    .style('stroke-width', 1)
                                    .style('fill', 'none');
