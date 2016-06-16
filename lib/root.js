var $ = require('jquery')
var DIMENSION = 2;
var DIRECTION_MAP = {
  "left": -1,
  "up": -DIMENSION,
  "right": 1,
  "down": DIMENSION
}

$(function() {



  // var tileBorderWidth = parseInt($(".tile").css("border-left-width"))
  // var tileWidth = (boardWidth/4) - (2 * tileBorderWidth);
  // $(".tile").width(tileWidth).height(tileWidth).show()
  setBoardWidth();
  addTiles(boardWidth);
  addClickHandlers();
  addKeyListeners();

});

$(window).resize(function() {
  setBoardWidth();
  tileWidth = boardWidth / DIMENSION;
  console.log(tileWidth);
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
      .html(id) // will not need this later
      .css("top", row * tileWidth + "px")
      .css("left", col * tileWidth + "px");

    $("#board").append(newTile);

  }
}


var addClickHandlers = function() {
  $("#board").on("click", ".tile", function() {
    var clickedId = $(this).attr("id")
    $(".tile").each(function(tile) {
      $("#" + tile).removeClass("selected")
    });
    $(this).addClass("selected")
  })
}

var addKeyListeners = function() {
  window.addEventListener("keydown", function(event) {
    if($(".selected").length > 0) {
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


  if(spaceIsOpen(movPos)) {
    $(".selected").attr("pos", movPos);
    $(".selected").animate({ "left": "+=50px" }, "slow" );
    console.log(tileWidth);
  } else {
    console.log("Doing nothing");
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


// $(".tile").each(function(tile) {
//
//   console.log($(this));
// })
// });
//
// if ($(this).hasClass("selected")) {
// $(this).removeClass("selected")
// } else {
// $(this).addClass("selected"
//use document change
