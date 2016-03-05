/*
 * biojs-vis-target-disease
 * https://github.com/ozcanesen/biojs-vis-target-disease
 *
 * Copyright (c) 2016 Ozcan Esen
 * Licensed under the MIT license.
 */

/**
@class targetDisease
 */

var d3 = require("d3");

var  targetDisease;
module.exports = targetDisease = function(opts){
    var options = {'margin': 50};
    this.el = opts.el;
    var svg = d3.select(this.el).append("svg")
        .style("background-color", opts.bgcolor)
        .attr("height", opts.height)
        .attr("width", opts.width);

    this.svg = svg;

    var force = d3.layout.force()
        .linkDistance(2)
        .charge(-50)
        .linkStrength(function(d) { return  (d.color == 'red' || d.color == 'white') ? 0.01 : 1; })
        .on("tick", tick.bind(this))
        .size([opts.width, opts.height]);

    var link = svg.selectAll(".link"),
        node = svg.selectAll(".node");

          var nodes = [];
          var links = [];

    var targetCount = 50;
    var diseaseCount = 60;
    var hypotheseCount = 200;

    for (var i = 0; i < targetCount; i++) 
    {
      nodes.push({
          'key': 'target' + i,
          'x': opts.gap,
          'y': opts.gap + (opts.height - opts.gap * 2) / targetCount * i,
          'size': 4,
          'fixed': true,
      });
    }

    for (var i = 0; i < diseaseCount; i++) 
    {
          nodes.push({
              'key': 'disease' + i,
              'x': opts.width - opts.gap,
              'y': opts.gap + (opts.height - opts.gap * 2) / diseaseCount * i,
              'size': 4,
              'fixed': true,
          });
    }

    var linkid = 0;
    var min=0;
    for (var i = 0; i < hypotheseCount; i++) 
    {
        nodes.push({
          'key': 'hyp' + i,
          'size': 3 + Math.random() * 2,
        });

        links.push({
            'id': linkid++,
            'source': nodes[parseInt(Math.random() * targetCount)],
            'target': nodes[nodes.length-1],
            'color': 'red',
        });

        links.push({
            'id': linkid++,
            'source': nodes[nodes.length-1],
            'target': nodes[targetCount + parseInt(Math.random() * diseaseCount)],
            'color': 'white',
        });

        if (i == 0) continue;
        if (Math.random() < 0.05) {min=i;}
        links.push({
            'id': linkid++,
            'source': nodes[targetCount + diseaseCount + min + parseInt(Math.random() * ((i-1)-min))],
            'target': nodes[targetCount + diseaseCount + i],
            'color': '#F9CC48',
        });

        if (Math.random() < 0.03) {
            links.push({
                'id': linkid++,
                'source': nodes[targetCount + diseaseCount + min + parseInt(Math.random() * ((i-1)-min))],
                'target': nodes[targetCount + diseaseCount + i],
                'color': '#F9CC48',
            }); 
        }
    }

    // Restart the force layout.
    force
        .nodes(nodes)
        .links(links)
        .start();

    // Update links.
    //link = link.data(links, function(d, i) { return d.id; });

    link.data(links).enter().append("line", ".node")
      .attr("class", "link")
      .style("stroke", function(d) { return d.color || 'white'})
      .style("stroke-width", function(d) { return (d.color == '#F9CC48') ? '1px': '0.2px'; });

    node = node.data(nodes, function(d) { return d.key; });
    node.exit().remove();

    var nodeEnter = node.enter().append("g")
        .attr("class", "node")
        .call(force.drag);

    nodeEnter.append("circle")
        .attr("r", function(d) { return d.size || 1; });

    node.select("circle")
        .style("fill", function(d) { 
              if (d.key.startsWith('target'))
                  return 'red';
              else if (d.key.startsWith('disease'))
                  return 'white';
              else
                  return '#F9CC48';
          });
};

function tick() {
 var link = this.svg.selectAll(".link"),
     node = this.svg.selectAll(".node");

  link.attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

  node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
}

