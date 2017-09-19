In order, I guess: (the biggest tasks will be highlighted)

* **Running the game in "steps" w/ Timer class**

  * With every step, the game screen updates to show new position of Pacman / ghosts
  * No need to update the stage itself every step,
    just the pellets, Pacman, and ghosts

* Pacman keyboard controls
* **Collision detection**
  (Pacman / ghosts aren't allowed to break through the stage walls)
* Graphics - placeholder

  * Simple as possible - black squares and circles

* **"Random" stage set-up w/ pellets, power pellets, Pacman / ghost spawning**

  * Drawing the walls of the stage first
  * Drawing pellets / Pacman / Ghosts

* **Ghost AI**

  * AI is different if Pacman eats a power pellet

* Power pellet functionality - changes ghost AI and graphics,
  allows Pacman to eat ghosts and send them back to their spawn area
* Creating a score system (every pellet eaten gives X points)
* UI with score
* Graphics - final

  * Three frame Pacman eating animation that loops whenever Pacman moves,
    freezes on one frame whenever he stops moving
  * Four recolored sprites for the ghosts
  * Simple looping animation for the ghosts
  * Power pellets blink
  * Regular pellets have one constant graphic
  * Stage graphics

* Putting the stage and UI together in one JFrame

What are some things we can do concurrently?
--------------------------------------------

Graphics, GUI, and stage development can be done independently
as soon as the step system is in place

Keyboard controls should be done before collision detection

AI needs to be started as soon as collision detection is implemented,
must be done before starting power pellet implementation

So basically we have two main categories of tasks here --
those involving the graphical look and those involving the logic.
The logic will be more difficult and more important than the graphics,
but the logic will also rely on the graphics sometimes
(for example, the program will have to know where walls are to perform
collision detection).
