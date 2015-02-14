var SPEC = {
  width: 700,
  height: 450,
  nBlobs: 31,
  data: [],
  svg: null,
  background: null,
  currentScore: 0,
  highScore: 0,
  collisions: 0,
  recentCollision: false,
  playerRadius: 10,
  enemyRadius: 7
};

//create svg
SPEC.svg = d3.select("body").append("svg")
            .attr("width", SPEC.width)
            .attr("height", SPEC.height);

SPEC.background = SPEC.svg.append("rect")
            .attr("width", SPEC.width)
            .attr("height", SPEC.height)
            .attr("fill", "white");


// initialize data
SPEC.data= _.map(_.range(SPEC.nBlobs), function(b){
  return {
    id: b,
    x: (b === 0) ? 0.5 * SPEC.width : Math.random() * SPEC.width,
    y: (b === 0) ? 0.5 * SPEC.height : Math.random() * SPEC.height,
    r: (b === 0) ? SPEC.playerRadius : SPEC.enemyRadius
  };
});

//populate game
SPEC.svg.selectAll("circle")
  .data(SPEC.data)
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

//make player dragable
SPEC.svg.selectAll(".player")
  .call(d3.behavior.drag().on("drag", function (d) {
      d.x = Math.min(Math.max(d3.event.x,0+d.r),SPEC.width-d.r);
      d.y = Math.min(Math.max(d3.event.y,0+d.r),SPEC.height-d.r);
      d3.select(this).attr("cx", d.x);
      d3.select(this).attr("cy", d.y);
    }));

//begin game
setInterval(moveEnemies,1500);
setInterval(checkCollisions.bind(null,SPEC.svg.selectAll(".enemy")),10);

function moveEnemies() {
  //update enemy data
  SPEC.data = _.map(SPEC.data, function(d, index){
    if (index === 0){
      return d;
    } else {
      return {
          x: Math.random() * SPEC.width,
          y: Math.random() * SPEC.height
        };
    }
  });

    SPEC.svg.selectAll(".enemy")
    .data(SPEC.data.slice(1))
    .transition().duration(1250)
    .attr("cx", function(d){
      return d.x;
    })
    .attr("cy", function(d){
      return d.y;
    });
}

function checkCollisions(enemies) {
  var player = SPEC.data[0];
  if (!SPEC.recentCollision){
    SPEC.currentScore++;
  }
  d3.select(".current > span").text(SPEC.currentScore);

  enemies.each(function()
  {
    var enemy = d3.select(this);
    var dx = player.x - enemy.attr("cx");
    var dy = player.y - enemy.attr("cy");
    var minDist =  player.r + Number(enemy.attr("r"));
    var hasCollision =  Math.sqrt(dx * dx + dy * dy) < minDist;

    if (hasCollision && !SPEC.recentCollision){

      SPEC.recentCollision = true;
      setTimeout(function(){
        SPEC.recentCollision =  false;
      }, 1000);

      SPEC.highScore =  (SPEC.currentScore > SPEC.highScore) ?
                        SPEC.currentScore : SPEC.highScore;
      SPEC.currentScore = 0;
      SPEC.collisions++;
      d3.select(".high > span").text(SPEC.highScore);
      d3.select(".collisions > span").text(SPEC.collisions);

      //flash background
      SPEC.background.transition().duration(50)
        .attr("fill","red")
        .transition().duration(950)
        .attr("fill","white");
    }
  });
}


