Meeting Notes
=============

9/8/17
------

* Went over pdf requirements
* Make a bulleted list of requirements
* We all got GitHub accounts
* John explained branches and how to use GitHub
* We all got GitHub Desktop for ease of use
* John did something with gitignore
* Created a GroupMe for easy communication

9/15/17
-------

* Talked about project design

  #. ``JFrame`` subclass

    * ``BorderLayout``
    * Displays score

  #. ``Board`` class extends ``JPanel``

    * Keeps track of where entities are
    * Computes whether items are consumed
    * Alerts entities when power pellet is consumed
    * Board sends out game 'ticks' and asks entities where they are

  #. ``PacMan`` class

    * Decision logic is in class

  #. ``Ghost`` abstract class

    * Inky and other ghosts are subclasses
    * Decision logic is in class
    * Changes internal behavior when alerted a power pellet
      is consumed

  #. ``Drawable`` interface

    * ``MakeDecision``: Returns movement direction

* Noah suggested making a UML diagram
* Started drafting project plan
* We plan to work on project plan over the weekend

9/29/17
-------

* Reviewed progress on SRS deliverable
* TODO: Ask what the requirements are for the prototype demonstration
* We plan to meet after class on October 4th for an hour
* Noah will work on prototype
* Laurel will work on the game display
* Gauthier will work on the keyboard interface
* John will work on incorporating the ``Timer`` class

10/3/17
-------

Tried to meet with professor: office hours not filled.
We did walk past the department chair and he said not to
worry about the requirements since we'll have to revisit them anyway.
