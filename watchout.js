// start slingin' some d3 here.
var width = 700,
height = 450,
nBlobs = 31;

var svg = d3.select("body").append("svg")
.attr("width", width)
.attr("height", height);

// initialize data
var data = _.map(_.range(nBlobs), function(b){
  return {
    id: b,
    x: (b === 0) ? 0.5 * width : Math.random() * width,
    y: (b === 0) ? 0.5 * height : Math.random() * height,
    r: (b === 0) ? 10 : 7
  };
});

var scoreData = [0,0,0];

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
.attr("r", function(d){
  return d.r;
});

svg.selectAll(".player")
.call(drag);


var moveEnemies = function() {

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


// /**** increment current score ****/
// var currentScoreData = [0];
// var currentScore = d3.select(".current > span")
//                   .data(currentScoreData)
//                   .text(function(d){return d;});
// console.log(currentScore);
// var incrementScore = function(currentScoreData, currentScore){
//   currentScoreData[0]++;
//   console.log(currentScoreData[0]);
//   console.log(currentScore);
//   currentScore.text(function(d){return d;});

// };

// setInterval(incrementScore.bind(null, currentScoreData, currentScore),1000);
// /******/

var currentScore = 0;
var highScore = 0;
var collisions = 0;
var checkCollisions = function(player,enemies,scoreboard) {
  currentScore++;
  d3.select(".current > span").text(currentScore);

  enemies.each(function(d, i)
  {
    var enemy = d3.select(this);
    var dx = player.x - enemy.attr("cx");
    var dy = player.y - enemy.attr("cy");
    var minDist =  player.r + +(enemy.attr("r"));
    var hasCollision =  Math.sqrt(dx * dx + dy * dy) < minDist;

    if (hasCollision){

      highScore =  (currentScore > highScore) ? currentScore : highScore;
      currentScore = 0;
      collisions++;
      d3.select(".high > span").text(highScore);
      d3.select(".collisions > span").text(collisions);
    }

  });
};

var enemies = svg.selectAll(".enemy");

var scoreboard = d3.selectAll(".scoreboard > div > span")
                .data(scoreData);


setInterval(checkCollisions.bind(null,data[0],enemies,scoreboard),10);

