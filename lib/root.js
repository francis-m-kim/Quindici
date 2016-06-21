var $ = require('jquery')

var DIMENSION = 4;
var DIRECTION_MAP = {
  "left": -1,
  "up": -DIMENSION,
  "right": 1,
  "down": DIMENSION
};
var DIFFICULTY = 100;

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
    $(tile).css("width", tileWidth)
    .css("height", tileWidth)
    .css("top", row * tileWidth + "px")
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

var createWinnableGame = function(movesFromWinning) {
  var num_tiles = (DIMENSION * DIMENSION) - 1;
  var boardState = []
  for (var i = 0; i < num_tiles; i++) {
    boardState.push(i)
  }
  boardState.push("empty")
  var lastMoved;

  var makeOneMove = function() {
    var emptyIdx = boardState.indexOf("empty");
    var whoCanMove = findAvailableMovers(emptyIdx);
    var chosenMover = chooseMover(whoCanMove);
    swapAndHoldLast(chosenMover, emptyIdx);
  }

  var swapAndHoldLast = function(moverIdx, emptyIdx) {
    lastMoved = boardState[moverIdx];
    boardState[emptyIdx] = boardState[moverIdx];
    boardState[moverIdx] = "empty";
  }

  var findAvailableMovers = function(emptyIdx) {
    var corner = isCornered(emptyIdx);
    if (corner) { return getIndexOfMovers(emptyIdx, corner) }
    var side = isOnSide(emptyIdx);
    if (side) { return getIndexOfMovers(emptyIdx, side) }
    return getIndexOfMovers(emptyIdx, ["left", "up", "down", "right"]);
  }

  var chooseMover = function(whoCanMove) {
    if (lastMoved !== undefined) {
      var lastMovedIdx = boardState.indexOf(lastMoved);
      var i = whoCanMove.indexOf(lastMovedIdx);
      whoCanMove.splice(i, 1);
    }
    var j = Math.floor(Math.random() * whoCanMove.length);
    var chosenMover = whoCanMove[j];
    return chosenMover;
  }

  var getIndexOfMovers = function(emptyIdx, directionArray) {
    return directionArray.map(function(direction) {
      return emptyIdx + DIRECTION_MAP[direction]
    })
  }

  var isCornered = function(emptyIdx) {
    if (emptyIdx === 0) {
      return ["right", "down"]
    } else if (emptyIdx === DIMENSION - 1) {
      return ["left", "down"]
    } else if (emptyIdx === DIMENSION * (DIMENSION - 1)) {
      return ["up", "right"]
    } else if (emptyIdx === (DIMENSION * DIMENSION) - 1){
      return ["left", "up"]
    }
  }

  var isOnSide = function(emptyIdx) {
    if (emptyIdx % DIMENSION === 0) {
      return ["up", "right", "down"]
    } else if (emptyIdx % DIMENSION  === DIMENSION - 1) {
      return ["up", "left", "down"]
    } else if (emptyIdx >= 0 && emptyIdx < DIMENSION) {
      return ["left", "down", "right"]
    } else if (emptyIdx >= (DIMENSION * (DIMENSION - 1)) && emptyIdx < (DIMENSION * DIMENSION)){
      return ["left", "up", "right"]
    }
  }

  while (movesFromWinning > 0) {
    makeOneMove();
    movesFromWinning--;
  }
  return boardState;
}

var addTiles = function(boardWidth) {
  var num_tiles = DIMENSION * DIMENSION - 1
  var tileIds = [];
  for(var i = 0; i < (num_tiles); i++) {
    tileIds.push(i);
  }

  var boardState = createWinnableGame(DIFFICULTY);

  for (var i = 0; i < boardState.length; i++) {
    var tileInfo = boardState[i]
    if (tileInfo === "empty") { continue; }

    var row = Math.floor(i / DIMENSION);
    var col = i % DIMENSION;
    tileWidth = boardWidth / DIMENSION;

    var newTile = $("<div>")
      .addClass("tile")
      .attr({"id": tileInfo, "pos": i})
      .html(tileInfo + 1) // will not need this later
      .css("width", tileWidth)
      .css("height", tileWidth)
      .css("top", row * tileWidth + "px")
      .css("left", col * tileWidth + "px")
      // .css("background-position", tileInfo + "px " + row * tileWidth + "px")

    positionImage(newTile, tileInfo, tileWidth);

    $("#board").append(newTile);

  }
}

var positionImage = function($tile, tileNum, tileWidth) {
  var row = Math.floor(tileNum / DIMENSION);
  var col = tileNum % DIMENSION;
  leftOffset = (-col * tileWidth) + "px"
  topOffset = (-row * tileWidth) + "px"
  $tile.css("background-position", leftOffset + " " + topOffset )
}



var addClickHandlers = function() {
  var startPos, endPos;

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
    if (startPos) {
      direction = getDirection(startPos, endPos);
      startPos = undefined;
    }
    if (direction) { moveTile(direction); }
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
    $(".selected").animate(distances, 250 );
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
    $("#board").unbind();
    $(".selected").removeClass("selected")
    doSomethingFancy(0);
  }
}

var doSomethingFancy = function(i) {
  var tiles = $(".tile")
  setTimeout(function() {
    $(tiles[i]).addClass("over");
    i++;
    if (i < tiles.length) {
      doSomethingFancy(i);
    }
  }, 25)
}
