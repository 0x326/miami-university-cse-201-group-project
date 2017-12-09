.. _Create React App: https://github.com/facebookincubator/create-react-app
.. _Yarn: https://yarnpkg.com/lang/en/docs/install/
.. _React: https://reactjs.org/
.. _TypeScript: https://www.typescriptlang.org/
.. _Immutable: https://facebook.github.io/immutable-js/
.. _Request: https://github.com/request/request
.. _Serve: https://www.npmjs.com/package/serve

Pac-Man™ for the Web
====================

This project was bootstrapped with `Create React App`_,
a commandline utility for creating webapps with React_ (a JS library).
The code is written in TypeScript_, a typed superset of JS.
It uses Immutable_ data structures as well as Request_ for HTTP requests.

Team Members
------------

* John Meyer
* Noah Dirig
* Laurel Sexton
* Goat Knox Kelly

Features
--------

* Supports HiDPI displays
* Looks like an authentic game of Pac-Man
* Simple controls(using ASDW keys)
* Displays running score 
* Displays a list of all your scores
* Ghosts have logic to do their desiged tasks
* Pac_man's mouth open and closes as it moves eating pellets
* Ghosts are smart enough to move away when Pac-Man eats a power pellet 
  and turns blue for a decreasing amount of time as levels progress
* When Pac-Man dies you have the option to play another game or quit

Scripts
-------

To compile this project yourself, it's preferred to have Yarn_ installed.

First, install dependencies::

   yarn

Then, build the project::

   yarn build

Finally, upload to a web server or start your own with Serve_::

   serve build/

Contributing
------------

For `Create React App`_ related items,
see `this guide <https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md>`_.

Make to have the correct Global ``.gitignore`` file for your IDE or text editor.
See `here <https://github.com/github/gitignore/tree/master/Global>`_ for details.

Development Scripts
^^^^^^^^^^^^^^^^^^^

#. ``yarn``: Installs dependencies
#. ``yarn start``: Starts a live development server, reloads automatically
#. ``yarn test``: Runs test cases (files with ``.test.ts`` or ``.test.tsx`` extension)
#. ``yarn lint``: Makes sure code is formatted correctly
#. ``yarn build``: Builds a production version of the code
