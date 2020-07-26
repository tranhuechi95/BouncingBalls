# Catch the lottery balls!

Simulate the process of picking numbers in lottery show with HTML canvas.

## How to play

1. Download this repository to your computer

2. Double-click on `BouncingBalls.html` to open the game GUI in your web browser.

3. Click and drag 6 bouncing balls to the black rectangle on the top left corner of the canvas to discover your lottery number!

## Learning points

### Javascript fundamentals

In web browsers, messages are added to Javascript's message queue any time

- An event occurs, AND,

- There is an event listener attached to it.

If there is no listener, the event is lost. So a click on an element with a click event handler will add a message - likewise with any other event. In this project, I use event listeners on mouse-related events `mouseup`, `mousemove`, `mousedown` to update Javascript global variables that track mouse coordinates. These variables are used to produce animations.

### Performing animations on the browser

When a script runs in the browser, `this` refers to the browser window, or similarly, the `window` global object. The `window.requestAnimationFrame()` method tells the browser that you wish to perform animations and requests that the browser calls a specified function to update an animation before the next repaint. The method takes a callback as an argument to be invoked before the repaint. In other words, the nature of animation on web browser is a bunch of slightly different images rendered at a high frame rate to create the "animation" effect.

```
    window.requestAnimationFrame(userCallback); // userCallback must specify how the canvas is drawn
```

For the animation to be smooth, `userCallback` needs to be lightweighted and fast. In particular, `userCallback` is typically called 60 times per second, so it's bad if `userCallback` takes longer than 1/60 sec to finish executing.

### Creating drag-and-drop effect

The trick:

1. Have a global Javascript variable that represents the "state" of the user's mouse: is it down, is it up, or is it being held?

2. Establish the mouse-and-item position dependency on `mousedown` event.

3. Update position of the item that is being dragged to be the same as that of the user's mouse when `mousemove` is being handled.

4. Break the mouse-and-item position dependency on `mouseup` event.


### Creating rotation effect

The trick is to use [CanvasRenderingContext2D.bezierCurveTo()](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/bezierCurveTo) method.
