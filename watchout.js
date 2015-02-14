// start slingin' some d3 here.
var width = 700,
height = 450,
nBlobs = 31;

var svg = d3.select("body").append("svg")
.attr("width", width)
.attr("height", height);

// initialize  data
var data = _.map(_.range(nBlobs), function(b){
  return {
    id: b,
    x: (b === 0) ? 0.5 * width : Math.random() * width,
    y: (b === 0) ? 0.5 * height : Math.random() * height,
  };
});

var enemies = data.slice(1);

var drag = d3.behavior.drag().on("drag", dragmove);

function dragmove(d) {
  d.x = d3.event.x;
  d.y = d3.event.y;
  d3.select(this).attr("cx", d.x);
  d3.select(this).attr("cy", d.y);
};

svg.selectAll("circle")
.data(data)
.enter()
.append("circle")
.attr("class", function(d){
  return (d.id === 0) ? "player" : "enemy";
})
.attr("cx", function(d){
  return d.x;
})
.attr("cy", function(d){
  return d.y;
})
.attr("r", 10);

svg.selectAll(".player")
.call(drag);


var moveEnemies = function() {
  console.log(data);
  data = _.map(data, function(d, index){
    if (index === 0){
      return d;
    } else{
    return {
      x: Math.random() * width,
      y: Math.random() * height
    };
  }
    });


    svg.selectAll(".enemy")
    .data(data.slice(1))
    .transition().duration(1250)
    .attr("cx", function(d){
      return d.x;
    })
    .attr("cy", function(d){
      return d.y;
    });

};
setInterval(moveEnemies,1500);


var checkCollisions = function(data) {
  var player = data[0];
  var enemies = data.slice(1);

  _.filter(enemies, function(enemy){

  });
};
setInterval(checkCollisions,10);

