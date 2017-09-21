Requirements
============

General Requirements
--------------------

* Java implementation with Swing library
* Put deliverables in Google Drive folder

  * Code deliverables must be buildable by Eclipse

* "All team members must be able to talk intelligently
  about the project goals, development approach, and architecture"

  * Such knowledge must be demonstrated during status reports
    and project presentations

Gameplay Requirements
---------------------

* PacMan must have one life
* Game generates maze for each level

  * Must create a psuedo-random maze of Pac-Dots

    * The starting location of the ghosts and PacMan are fixed

  * Must generate another maze upon the completion of the previous level
    (when all Pac-Dots are eaten)

* Game must keep a running score

  * Score accurately reflects the number of Pac-Dots eaten

    * 10 points per dot
    * 50 points per power pellet
    * 250 points per consumed ghost

  * Player's score must be displayed in the center of the maze
    upon death
  * Player must be given choice to play another game

    * If player plays again, the entire history of game scores
      should be displayed after the user states his intention of
      playing no more.

* Four ghosts try to catch PacMan

  * Ghosts are mutli-colored
  * Ghosts chase PacMan with specific algorithms

    * Red ghost (Blinky) actively chases PacMan.
    * Orange ghost (Clyde) alternates between moving towards the
      lower-left corner of the screen and the behavior of the
      red ghost (Blinky)
    * Pink ghost (Pinky) aims for a position in front of PacMan
    * Blue ghost (Inky) randomly switches between chasing PacMan
      and running away from him

  * If ghost touches PacMan, PacMan dies

* Power pellets

  * Provides PacMan with the temporary ability to consume ghosts.
  * Ghosts:

    * Change color
    * Reverse direction
    * Usually move more slowly
    * Flash before reverting to normal state
    * Remain in this state for a variable amount of time

      * Depends on level
      * Becomes shorter we level increases
      * At some point, ghosts immediately start flashing.
      * The duration of the vunerable state must be greater than
        or equal to the length of the flashing time.

  * When ghost is eaten, it is returned to the center box
    where it is regenerated with normal properties

Game Presenation Requirements
-----------------------------

* During power pellets

  * Ghosts turn deep blue
  * Flash white before reverting to normal state
Interface Requirements
----------------------

* Intuitive UI

  * Arrow keys (keyboard) control movement

    * PacMan's mouth is oriented towards the direction of movement

  * Displays score for current game
  * Early quit option
  * Color must be consistent with the original PacMan game

    * Black background
    * Blue walls
    * Yellow PacMan
    * Colored ghosts
    * etc.

  * Design must be easily navigable and self-explanatory

    * Button names must be intuitive

.. For more info on UI, see https://medium.com/@erikdkennedy/7-rules-for-creating-gorgeous-ui-part-1-559d4e805cda

Notes
-----

* Game does not implement the following features

  * Fruits
  * Multiple lives
  * etc.
