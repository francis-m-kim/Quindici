/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	var DIMENSION = 4;
	var DIRECTION_MAP = {
	  "left": -1,
	  "up": -DIMENSION,
	  "right": 1,
	  "down": DIMENSION
	};
	var DIFFICULTY = 24;
	var REVEAL_ALL = false;
	var SHOW_NUMBERS = true;
	
	var IMAGES = [
	  "cutpiece.jpg", "flag.jpg", "tv.gif", "city.gif",
	  "horse.gif", "turning.gif", "ruins.gif", "squarecircle.gif",
	  "darwin.gif", "polygons.gif"
	]; // would be nice to have a function to access assets/images folder here
	var ALREADY_SEEN = [];
	var IMAGE_PATH;
	
	
	
	var chooseImage = function() {
	  var availableImages = [];
	  if (ALREADY_SEEN.length === 0) {
	    availableImages = IMAGES;
	  } else if (ALREADY_SEEN.length === IMAGES.length) {
	    ALREADY_SEEN = [];
	    availableImages = IMAGES;
	  } else {
	    IMAGES.forEach(function(image) {
	      // debugger;
	      if (ALREADY_SEEN.indexOf(image) === -1) {
	        availableImages.push(image);
	      }
	    })
	  }
	
	
	  var chosenIdx = Math.floor(Math.random() * availableImages.length);
	  var imageToUse = availableImages[chosenIdx];
	  ALREADY_SEEN.push(imageToUse);
	  IMAGE_PATH = "assets/images/" + imageToUse;
	
	}
	
	chooseImage();
	
	$(function() {
	  setBoardWidth();
	  addTiles(boardWidth);
	  checkTiles();
	  showButtons();
	  addButtonHandlers();
	  addClickHandlers();
	  addKeyListeners();
	  addReplayHandler();
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
	    .css("left", col * tileWidth + "px")
	    .css("line-height", tileWidth + "px");
	
	    attachImage($(tile), $(tile).attr("id"), tileWidth);
	  })
	});
	
	var setBoardWidth = function() {
	  var windowWidth = $(window).width();
	  var windowHeight = $(window).height();
	  boardWidth = .70 * (
	    (windowWidth > windowHeight) ? windowHeight: windowWidth
	  )
	  if (boardWidth < 300) { boardWidth = 300; }
	
	
	  $("#board").width(boardWidth).height(boardWidth).show();
	  $("#board").css("font-size", boardWidth / (DIMENSION * 2.5));
	
	  var boardOffset = $("#board").offset().left;
	
	  $("#instruction-modal")
	    .width(boardWidth)
	    .height(boardWidth)
	    .offset({left: boardOffset})
	    .show();
	
	  // IN CASE WE WANTED TO SHOW THE INSTRUCTIONS ONLY ONCE:
	  // if (! localStorage.quindici) {
	    // $("#instruction-modal").show();
	    // localStorage.quindici = "1";
	  // }
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
	
	    var newTile = $("<div class='tile'>")
	      .attr({"id": tileInfo, "pos": i})
	      .css("width", tileWidth)
	      .css("height", tileWidth)
	      .css("top", row * tileWidth + "px")
	      .css("left", col * tileWidth + "px")
	      .css("line-height", tileWidth + "px");
	
	    if (SHOW_NUMBERS) { newTile.html(tileInfo + 1); }
	    attachImage(newTile, tileInfo, tileWidth);
	
	    $("#board").append(newTile);
	
	  }
	}
	
	var attachImage = function($tile, tileNum, tileWidth) {
	  var row = Math.floor(tileNum / DIMENSION);
	  var col = tileNum % DIMENSION;
	  leftOffset = -(col * tileWidth) + "px"
	  topOffset = -(row * tileWidth) + "px"
	  $tile.css("background-size", tileWidth * DIMENSION + "px " + tileWidth * DIMENSION + "px")
	    .css("background-position", leftOffset + " " + topOffset )
	
	  if (REVEAL_ALL) { turnOn($tile, IMAGE_PATH)}
	}
	
	var showButtons = function() {
	  setTimeout(function() {
	    $("#settings").show();
	  }, 50);
	}
	
	var addButtonHandlers = function() {
	  $("#reveal-all").click(function() {
	    if(REVEAL_ALL) {
	      $(".tile").each(function(_, tile) {
	        var id = $(tile).attr("id")
	        var pos = $(tile).attr("pos")
	        if (id !== pos) { turnOff($(tile)); }
	      });
	      REVEAL_ALL = false;
	    } else {
	      $(".tile").each(function(_, tile) {
	        turnOn($(tile), IMAGE_PATH);
	      })
	      REVEAL_ALL = true;
	    }
	  });
	
	  $("#show-numbers-toggle").click(function() {
	    SHOW_NUMBERS ? hideNumbers() : showNumbers();
	  });
	
	  $("#dimension").change(function() {
	
	    DIMENSION = parseInt($("#dimension").val());
	    DIRECTION_MAP = {
	      "left": -1,
	      "up": -DIMENSION,
	      "right": 1,
	      "down": DIMENSION
	    };
	
	    $("#difficulty").attr("max", Math.pow(DIMENSION, 2.5));
	  })
	
	  $("#difficulty").change(function() {
	    DIFFICULTY = parseInt($("#difficulty").val());
	
	  })
	
	  $("#image-path").change(function() {
	    IMAGE_PATH = $("#image-path").val();
	  })
	
	  function shuffleLetters() {
	    function shuffle(array) {
	      var rand, index = -1,
	        length = array.length,
	        result = Array(length);
	      while (++index < length) {
	        rand = Math.floor(Math.random() * (index + 1));
	        result[index] = result[rand];
	        result[rand] = array[index];
	      }
	      return result;
	    }
	    var letters = $("#reshuffle").html();
	    $("#reshuffle").html(shuffle(letters));
	  }
	
	  $("#reshuffle").hover(shuffleLetters, function() {$("#reshuffle").html("RESHUFFLE")})
	
	  $("#reshuffle").mousedown(function() {return false})
	
	  $("#reshuffle").click(function() {
	    $(".tile").remove();
	    setBoardWidth();
	    addTiles(boardWidth);
	    checkTiles();
	  })
	}
	
	var hideNumbers = function() {
	  $(".tile").empty();
	  SHOW_NUMBERS = false;
	}
	
	var showNumbers = function() {
	  $(".tile").each(function(_, tile) {
	    var id = parseInt($(tile).attr("id")) + 1
	    $(tile).html(id)
	  })
	  SHOW_NUMBERS = true;
	}
	
	var addClickHandlers = function() {
	  var startPos, endPos;
	
	  $("#instruction-close").click(function() {
	    $( "#instruction-modal" ).fadeOut( "slow", function() {
	      $("#instruction-modal").remove();
	
	    });
	  })
	
	  $("#board").on("mousedown", ".tile", function(event) {
	    event.preventDefault();
	    var clickedId = $(this).attr("id")
	    $(".tile").each(function(tile) {
	      $("#" + tile).removeClass("selected")
	    });
	    $(this).addClass("selected")
	    startPos = {x: event.pageX, y: event.pageY}
	  })
	
	  $(window).mousedown(function(event) {
	    if ($(event.target).attr("id") == undefined) {
	      $(".tile").removeClass("selected");
	    }
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
	    checkTiles();
	
	  } else {
	    $(".selected").addClass("wiggle")
	    setTimeout(function() {
	      $(".tile").removeClass("wiggle")
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
	
	
	var turnOn = function($tile, imagePath) {
	  $tile
	    .css("background-image", "url(" + imagePath + ")")
	    .addClass("on");
	}
	
	var turnOff = function($tile) {
	  $tile
	    .removeClass("on")
	    .css("background-image", "none");
	}
	
	var checkTiles = function() {
	  var gameOver = true;
	  $(".tile").each(function(_, tile) {
	    var id = $(tile).attr("id")
	    var pos = $(tile).attr("pos")
	    if (id !== pos) {
	      if (! REVEAL_ALL) { turnOff($(tile)); }
	      gameOver = false;
	    } else {
	      turnOn($(tile), IMAGE_PATH);
	    }
	  });
	
	  if (gameOver) {
	    $("#board").unbind();
	    $("#board").mousedown(function(event){
	      event.preventDefault();
	    });
	    $(".selected").removeClass("selected")
	    $("#show-numbers-toggle, #reshuffle, #reveal-all").off("click");
	    showNumbers();
	    doSomethingFancy(0);
	
	    toggleSettings();
	  }
	}
	
	var addReplayHandler = function() {
	  $("#play-again").click(function(event) {
	    event.preventDefault();
	    chooseImage();
	
	    toggleSettings();
	    $(".tile").remove();
	    setBoardWidth();
	    addTiles(boardWidth);
	    checkTiles();
	    addButtonHandlers();
	    addClickHandlers();
	
	  })
	}
	
	var toggleSettings = function() {
	  $( "#settings" ).toggle();
	  $( "#win-settings" ).toggle();
	}
	
	var doSomethingFancy = function(i) {
	  var tiles = $(".tile")
	  setTimeout(function() {
	    $(tiles[i]).addClass("over");
	    i++;
	    if (i < tiles.length) {
	      doSomethingFancy(i);
	    }
	  }, 50)
	}
	
	// COMPUTER PLAYS BACKWARDS FROM SOLVED STATE
	
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


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map