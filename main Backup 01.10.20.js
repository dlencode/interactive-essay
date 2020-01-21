var width = 1800,
    height = 1800,
    radius = Math.min(width, height);

var originX = width/2,  
    originY = height/2;

var canvas = d3.select("body").append("svg").attr("width", width).attr("height", height);

var div = d3.select('body').append("div").attr('class', 'tooltip').style('opacity', 0);

var data = d3.json('./data.json', function(err, data) {

    var group = canvas.selectAll("dot").data(data).enter().append('g')
    var dots = group.append("circle")
            .on("mouseover", function(d){
                div.transition()
                    .duration(300)
                    .style('opacity', 1);
                div.html('<span class=tooltip-name>' + d.name + '</span>' + 'Radius: ' + d.radius + '</br>' + 'Position: ' + '(' + d.x + ',' + d.y + ')')
                    .style('left', (d3.event.pageX + "px"))
                    .style('top', (d3.event.pageY + "px"));                
                
            })
            .on("mouseout", function(d){
                div.transition()
                    .duration(300)
                    .style('opacity', 0);
                group.attr('fill', '#808487');
            })
            ;

    var groupName = group.append('text')
                        .attr("x", function(d) { return d.x * d.ring + (10 * d.radius + 5); })
                        .attr("y", function(d) { return d.x * d.ring + 3; })
                        .text( function (d) { return d.name; })
                        .attr("font-family", "Montserrat")
                        .attr("font-size", "9px")
                        .attr("font-weight", "500")
                        .attr('fill', '#808487');

    var dotsAttrs = dots.attr("cx", function(d) { return d.x * d.ring; })
                    .attr("cy", function(d) { return d.x * d.ring; })
                    .attr("r", function(d) { return d.radius * 10; })
                    .style("fill", function(d) { return d.color });

    // dots.style("pointer-events", "none")
    //     .attr('transform', 'scale(0)')
    //     .transition()
    //         .duration(3000)
    //         .delay(100)
    //         .attr('transform', 'scale(1)')
});

var rings = [1, 2, 3, 4, 5, 6]
    

var drawRings = canvas.selectAll('ring').data(rings).enter().append('circle')
                                    .attr('cy', originX)
                                    .attr('cx', originY)
                                    .attr('r', function(d) { return d * 150 })
                                    .style('stroke', '#6F787F')
                                    .style('stroke-width', 1)
                                    .style('fill', 'none');
