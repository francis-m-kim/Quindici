var $ = require('jquery')
var DIMENSION = 4;
var DIRECTION_MAP = {
  "left": -1,
  "up": -DIMENSION,
  "right": 1,
  "down": DIMENSION
}

$(function() {
  setBoardWidth();
  addTiles(boardWidth);
  addClickHandlers();
  addDoubleClickHandlers();
  addKeyListeners();
});

$(window).resize(function() {
  setBoardWidth();
  tileWidth = boardWidth / DIMENSION;
  $(".tile").each(function(_, tile) {
    var pos = $(tile).attr("pos")
    var row = Math.floor(pos / DIMENSION);
    var col = pos % DIMENSION;
    $(tile).css("top", row * tileWidth + "px")
    .css("left", col * tileWidth + "px");
  })
});

var setBoardWidth = function() {
  var windowWidth = $(window).width();
  var windowHeight = $(window).height();
  boardWidth = .75 * (
    (windowWidth > windowHeight) ? windowHeight: windowWidth
  )
  $("#board").width(boardWidth).height(boardWidth).show()
}

var addTiles = function(boardWidth) {
  var num_tiles = DIMENSION * DIMENSION - 1
  var tileIds = [];
  for(var i = 0; i < (num_tiles); i++) {
    tileIds.push(i);
  }

  for (var i = 0; i < num_tiles; i++) {
    var id = tileIds[Math.floor(Math.random() * tileIds.length)];
    tileIds.splice(tileIds.indexOf(id), 1);

    var row = Math.floor(i / DIMENSION);
    var col = i % DIMENSION;
    tileWidth = boardWidth / DIMENSION;

    var newTile = $("<div>")
      .addClass("tile")
      .attr({"id": id, "pos": i})
      .html(id + 1) // will not need this later
      .css("top", row * tileWidth + "px")
      .css("left", col * tileWidth + "px");

    $("#board").append(newTile);
  }
}

var addClickHandlers = function() {
  var startPos;
  var endPos;

  $("#board").on("mousedown", ".tile", function(event) {
    event.preventDefault();
    var clickedId = $(this).attr("id")
    $(".tile").each(function(tile) {
      $("#" + tile).removeClass("selected")
    });
    $(this).addClass("selected")

    startPos = {x: event.pageX, y: event.pageY}
  })

  $("#board").on("mousemove", ".selected", function(event) {
    event.preventDefault();
  })

  $(window).on("mouseup", function(event) {
    endPos = {x: event.pageX, y: event.pageY}

    var direction;
    if (startPos) { direction = getDirection(startPos, endPos) }

    if (direction) { moveTile(direction) }


  })
}

var getDirection = function(startPos, endPos) {
  var xChange = endPos.x - startPos.x;
  var yChange = endPos.y - startPos.y;

  if (xChange == 0 && yChange == 0) { return }

  if (Math.abs(xChange) > Math.abs(yChange)) {
    if(xChange > 0) {
      return "right"
    } else {
      return "left"
    }
  } else {
    if (yChange > 0) {
      return "down"
    } else {
      return "up"
    }
  }
}

var addDoubleClickHandlers = function() {
  $("#board").on("dblclick", ".tile", function() {
    if ($(this).hasClass("on")) {
      $(this).removeClass("on")
    } else {
      $(this).addClass("on")
    }
  })
}


var addKeyListeners = function() {
  $(window).keydown(function() {
    if ($(".selected").length > 0) {
      var code = event.keyCode
      switch (code) {
        case 37:
          event.preventDefault();
          moveTile("left");
          break;
        case 38:
          event.preventDefault();
          moveTile("up");
          break;
        case 39:
          event.preventDefault();
          moveTile("right");
          break;
        case 40:
          event.preventDefault();
          moveTile("down");
          break;
      }
    }
  });
}

var moveTile = function(direction) {
  var currentPos = parseInt( $(".selected").attr("pos") );
  var movPos = currentPos + DIRECTION_MAP[direction]
  var distances = calculateDistances(direction)

  if (spaceIsOpen(movPos) && notFallingOverEdge(currentPos, direction)) {
    $(".selected").attr("pos", movPos);
    $(".selected").animate(distances, "slow" );
    checkGameOver();
  } else {
    $(".selected").addClass("wiggle")
    setTimeout(function() {
      $(".selected").removeClass("wiggle")
    }, 300)
  }
}

var notFallingOverEdge = function(currentPos, direction) {
  if ((currentPos % DIMENSION === 0 && direction === "left") ||
     (currentPos % DIMENSION === (DIMENSION - 1) && direction === "right")) {
     return false;
  } else {
     return true;
  }
}

var spaceIsOpen = function(posToTest) {
  var validity;
  if (posToTest >= 0 && posToTest < DIMENSION * DIMENSION) {
    validity = true;
    $(".tile").each(function(_, tile) {
      if ($(tile).attr("pos") == posToTest) {
        validity = false;
      }
    });
  }
  return validity;
}

var calculateDistances = function(direction) {
  var distances;
  var width = tileWidth + "px"
  switch (direction) {
    case "left":
      distances = {"left": "-=" + width}
      break;
    case "up":
      distances = {"top": "-=" + width}
      break;
      break;
    case "right":
      distances = {"left": "+=" + width}
      break;
      break;
    case "down":
      distances = {"top": "+=" + width}
      break;
      break;
  }
  return distances
}



var checkGameOver = function() {
  var gameOver = true;
  $(".tile").each(function(_, tile) {
    var id = $(tile).attr("id")
    var pos = $(tile).attr("pos")
    if (id !== pos) {
      gameOver = false;
    }

  });

  if (gameOver) {
    $(window).unbind('keydown');
    doSomethingFancy();
  }
}

var doSomethingFancy = function() {
  console.log("Game over, son.");
}
