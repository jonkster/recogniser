# Recogniser

An experimental handwriting recogniser using neural net.

This is very rudimentary and not for anything other than experimentation/reference.

Code is totally throw away.


It consists of 2 parts:

1. a web service that is passed an image (of a handwritten number) and returns a guess at the number.

2. A web interface that allows a user to draw a number on screen and passes it to the web service.

To use:

1. clone repository

2. run npm install in the root directory (sets up web service)

3. cd interface

4. run npm install (sets up interface)

5. npm start (should start both the web service and the web interface

Connect to the web interface using http://host:3000


