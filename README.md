# Quindici

Essentially this will be a video-fied version of the classic Game of 15 puzzle game. Rather than being numbered, each tile of the 15 will be a fragment of the original video. The player will move the tiles until they are all in their ordained position.

What needs to be figured out:

1. How to play videos in HTML.
2. How to click videos on/off.
3. How to show only a swatch of a video in an HTML element.
4. How to get multiple elements playing fragments of the same video without reloading the same video

If the whole video aspect is too cumbersome or difficult, I could settle for just a still image. But it would look a lot less cool for sure.

Main division of the project:

* Create tile class
  * tile responds to click on/off
  * tile can be moved – a given tile can only move to one spot or not at all, i.e. moves should be validated.

* Create board class
  * board is initialized with the image/video shuffled
  * size of board on screen should be proportional to original. Otherwise some sort of cropping needs to be done.

* Create game class
  * is the game over? Make something happen when it is.
