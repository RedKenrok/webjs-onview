<div align="center">

[![Documentation website](https://img.shields.io/static/v1?label=Docs&message=%20&style=flat-square&color=green&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAAsTAAALEwEAmpwYAAADLElEQVR42tVVTUgbQRSeRqse2kNvvZVSeii0XgrW9tCD2hw8SWnpqfRQ2psliTEaxWg0mh8ED0UEUzQqojE9BESxigYlNP6CojVIbKq0oQRsSBETdZNNv7fMbteCUHrrwOzuzLz3zTfvzfuWtbS0MOrNzc3MarVesNlshRjn63Q6Rt3n890VRTE2Ozv7wmw2FxqNRlZbW8tglyf7yRjUlYnW1tY8i8XCTCYTa2pqYiMjI6X7+/vvs9ls7OjoKLywsPCkurqaeTye2263+1ZdXZ3iqwaVHgREu7a3t2smJiaeJZPJUC6XS+zu7nq6u7uv2e12Njc3VxkOh99iE/fg4OCdrq6uK5ylhncJmNhoaCEQCLxKpVKfBEGILi0tmTs6OvJpI7/fX7W3t9e3vr7uwHcZuhZjPzbM9fT03NTr9ayhoUEiJTE0GAwMOz4gg62tLWtnZ2cRGOUHg8E3sVjMu7KyYkIc709PTz9PJBJBmMU3NjZcU1NTTwF4dWhoqHRnZ6evt7e3mMLAampq2MDAgDaTyQjpdPo7jhuB04+1tTXz6OhoyfLysg2sv5ycnGzjFK95vIl55cHBQSDHG0hpKWwSIAYVmEMyRWkRseofGxsrxibfwNI3PDxc0tjYyFwuV8Hi4qIR4J9lINhkkDgBySqjhMoMK/jiKUCzYGJYXV21YCqFd/34+PjLSCTyDuOfMhBAsmSLnqExMH4DguEjbiTQG1fEHAqFdDJjdYNNhoD4iUT+TYDl5wLOz8/X42gGckL8UsQca6eckchjI+32V4DEkAMqc+e1/xdQujb/AKhOyplroyVHBP+YLFRJOQ9QVFKMZFHSlHtIpYfyecitchyQGOr/BBTPNrrTyhowyqVKIXGAyhRubm7aUQFfyQ9HNuEe6jkDQY3C76FCFdK2TadxOp2XCYtEVdI/iCeVVhG07kZbW9slbOCUqyenrkve4vH4B0hdlcPhyCNmhHFGYAGsoUmqWTKYmZl5DL9jMFLA8EpGo9F+r9d7j/xIXciHxFnRQ7Xi0i8AixoCJ9DJyckKhOEjQNOHh4d+xOk66R/9BmBzETpaQD5qxf4FMjl0KL98ftcAAAAASUVORK5CYII=&maxAge=3600)](https://redkenrok.github.io/webjs-onview)
[![GitHub Repository](https://img.shields.io/static/v1?label=GitHub&message=%20&style=flat-square&color=green&logo=github&maxAge=3600)](https://github.com/redkenrok/webjs-onview/)
[![License agreement](https://img.shields.io/github/license/redkenrok/webjs-onview.svg?label=License&style=flat-square&maxAge=86400)](https://github.com/redkenrok/webjs-onview/blob/master/LICENSE)
[![Open issues on GitHub](https://img.shields.io/github/issues/redkenrok/webjs-onview.svg?label=Issues&style=flat-square&maxAge=86400)](https://github.com/RedKenrok/webjs-onview/issues)
[![npm @latest version](https://img.shields.io/npm/v/onview.svg?label=Version&style=flat-square&maxAge=86400)](https://www.npmjs.com/package/onview)
[![minzipped size](https://img.shields.io/bundlephobia/minzip/onview?label=Size&style=flat-square&maxAge=86400)](https://www.npmjs.com/package/onview)

</div>

<hr/>

# OnView

A small JavaScript library allowing element manipulation when an element enters into or exits out of the view without having to write a single line of code. In addition more advanced use cases can utilize inline coding similar to the `onclick` attribute or listen to custom events send out by the element itself.

## Examples

Let's start off with some example use cases in order to give you an idea of what this library can do for you.

### Lazy loading

``` HTML
<!-- Image element that will have its image loaded in when it enters into view. -->
<img data-onview-enter-add="[src=./image.jpg]" />

<!-- Load OnView script. -->
<script src="./onview.umd.js"></script>
<script>
  // Wait for the DOM to be interactive.
  document.addEventListener('DOMContentLoaded', function() {
    // Setup an OnView instance with the default options.
    var onView = new window.OnView();
  });
</script>
```

As soon as the image element enters into view the `src` attribute with the specified element will be added to the element. The change made to the element will trigger the image to be loaded in.

### Animations

``` HTML
<head>
  <!-- CSS based animation that require a class to be activated. -->
  <style>
    .fade-in {
      opacity: 0;
      transition: opacity 500ms ease-in;
    }
    .animate.fade-in {
      opacity: 1;
    }
  </style>
</head>
<body>
  <!-- Element that will animate when it enters into view and exits out of view. -->
  <div class="fade-in" data-onview-enter-toggle=".animate">
    Fade in animation
  </div>

  <!-- Load OnView script. -->
  <script src="./onview.umd.js"></script>
  <script>
    // Wait for the DOM to be interactive.
    document.addEventListener('DOMContentLoaded', function() {
      // Setup an OnView instance with the default options.
      var onView = new window.OnView();
    });
  </script>
</body>
```

The styling is setup to start fading in when the `animate` class is added the element. As soon as the element enters into view the `animate` class will be added to the element, and as soon as the element exits out of view the `animate` class wil be removed from the element. As a result the element fades in everytime it enters into view.

## Installation

Via a CDN:

``` HTML
<!-- CDN unpkg -->
<script src="https://unpkg.com/onview@latest/dist/onview.umd.min.js"></script>
<!-- Be sure to replace `latest` with the most recent version number. -->
```

Via a package manager:

``` Bash
# Node Yarn
yarn add onview

# Node NPM
npm install onview
```

## Initializations

After adding the script to a webpage the library is added to the global window object. An instance of the library needs to be initialized before it becomes active. The first step is to create an instance using the constructor function: `new window.OnView()`, this function call returns a new instance. By default the instance get automatically initialized if the document has finished loading otherwise it will listen for the window load event. To change this default behaviour change the [readyState option](#options).

### Default

``` HTML
<!-- Load OnView script. -->
<script src="./onview.umd.js"></script>
<script>
  // Wait for the DOM to be interactive.
  document.addEventListener('DOMContentLoaded', function() {
    // Setup an OnView instance with the default options.
    var onView = new window.OnView();
  });
</script>
```

### DOM interactive

``` HTML
<!-- Load OnView script. -->
<script src="./onview.umd.js"></script>
<script>
  // Wait for the DOM to be interactive.
  document.addEventListener('DOMContentLoaded', function() {
    // Setup an OnView instance with the default options.
    var onView = new window.OnView({
      readyState: 'interactive'
    });
  });
</script>
```

### Manually

``` HTML
<!-- Load OnView script. -->
<script src="./onview.umd.js"></script>
<script>
  // Wait for the DOM to be interactive.
  document.addEventListener('DOMContentLoaded', function() {
    // Setup an OnView instance with the default options.
    var onView = new window.OnView({
      readyState: 'manual'
    });

    // Manually initialize.
    onView.initialize();
  });
</script>
```

## Functions

- `constructor`
  - Description: Construct an OnView instance.
  - Parameters:
    - `options`
      - Description: See [options](#options) for more information.
      - Type: `object`
  - Returns: An OnView instance.
  - Example: `var onView = new OnView(options);`
- `getOptions`
  - Description: Get a copy of the instance's options.
  - Returns: A copy of the instance's options. See [options](#options) for more information.
  - Example: `var options = onView.getOptions();`
- `isInitialized`
  - Description: Whether the instance has been initialized.
  - Example: `var initialize = onView.isInitialzed();`
- `initialize`
  - Description: Initialize the instance after which it will query and start observing the elements discovered.
  - Example: `onView.initialize();`
- `destroy`
  - Description: destroy the instance, after which it is brought back to the same state as before it was initialized.
  - Example: `onView.destroy();`
- `queryDocument`
  - Description: Re-queries the document in order to discover new elements to start observing.
  - Example: `onView.queryDocument();`

## Options

The following options can be set when calling the constructor method of the library.

- `debug`
  - Description: Whether to log debug messages to the console.
  - Type: `boolean`
  - Default: `false`
- `readyState`
  - Description: Which document ready state the initialize the module at.
  - Type: `string`
  - Options: `complete`, `interactive`, and `manual`. Also available through the `READY_STATES` property, for instance `OnView.READY_STATES.complete` equals `'complete'`.
  - Default: `complete`
- `observedElement`
  - Description: The root element to query for all other elements.
  - Type: `Element`
  - Default: document.body
- `observerElement`
  - Description: The element whose intersection with the queried elements is observed. See the `root` options of the [`IntersectionObserver`](https://developer.mozilla.org/docs/Web/API/Intersection_Observer_API) for more information.
  - Type: `Element`
  - Default: `null`, `null` defaults to the window's viewport.
- `observerMargin`
  - Description: Margin of the observed element before intersection is seen as intersecting. See the `rootMargin` options of the [`IntersectionObserver`](https://developer.mozilla.org/docs/Web/API/Intersection_Observer_API) for more information.
  - Type: `string`
  - Default: `0px`
- `attributePrefix`
  - Description: The prefix the attributes.
  - Type: `string`
  - Default: `data-onview`
- `eventContextName`
  - Description: Name of the context when executing the inline code. See [code execution](#code-execution) for more information.
  - Type: `string`
  - Default: `detail`
- `selectorSplitCharacter`
  - Description: The text which splits the attribute selector. See [attribute selector](#attribute-selector) for more information.
  - Type: `string`
  - Default: `,`

``` HTML
<!-- Load OnView script. -->
<script src="./onview.umd.js"></script>
<script>
  // Wait for the DOM to be interactive.
  document.addEventListener('DOMContentLoaded', function() {
    // Create options variable.
    var options = {
      debug: false,
      readyState: OnView.READY_STATES.complete,

      observedElement: document.body,
      observerElement: null,
      observerMargin: `0px`,

      attributePrefix: 'data-onview',
      eventContextName: `detail`,
      selectorSplitCharacter: `,`,
    };

    // Setup an OnView instance with the default options.
    var onView = new window.OnView(options);
  });
</script>
```

> Do note the `threshold` property of the IntersectionObserver is not available through the `observableOptions` option.

## Attributes

### Observed attributes

The following data attributes can be added to any elements in order for them to be observed by the OnView library.

#### Enter and exit

- Attribute name: `data-onview`
- Attribute value type: JavaScript code
- Description: [Executes the code](#code-execution) specified when the element enters into view and/or exits out of view.

``` HTML
<!-- Logs the message to the console when the element enters into or exits out of view. -->
<div data-onview="console.log('Element entered into or exited out of view.');"></div>
```

#### Enter

- Attribute name: `data-onview-enter`
- Attribute value type: JavaScript code
- Description: [Executes the code](#code-execution) specified when the element enters into view.

``` HTML
<!-- Logs the message to the console when the element enters into view. -->
<div data-onview-enter="console.log('Element entered into view.');"></div>
```

#### Enter add

- Attribute name: `data-onview-enter-add`
- Attribute value type: [attribute selector](#attribute-selector)
- Descriptions: Adds the attributes to the element when it enters into view.

``` HTML
<!-- Adds the class `test` to the element when it enters into view. -->
<div data-onview-enter-add=".test"></div>

<!-- Result after entering into view. -->
<div class="test"></div>
```

#### Enter remove

- Attribute name: `data-onview-enter-remove`
- Attribute value type: [attribute selector](#attribute-selector)
- Description: Removes the attributes from the element when it exits out of view.

``` HTML
<!-- Remove the class `test` from the element when it exits out of view. -->
<div class="test" data-onview-enter-remove=".test"></div>

<!-- Result after entering into view. -->
<div></div>
```

#### Enter toggle

- Attribute name: `data-onview-enter-toggle`
- Attribute value type: [attribute selector](#attribute-selector)
- Description: Adds the attributes to the element when it enters into view, and removes the attributes from the element when it exits out of view.

``` HTML
<!--
  Adds the class `test` to the element when it enters into view,
  and removes the class `test` from the element when it exits out of view.
-->
<div data-onview-enter-toggle=".test"></div>

<!-- Result after entering into view. -->
<div class="test" data-onview-enter-toggle=".test"></div>

<!-- Result after exiting out of view. -->
<div data-onview-enter-toggle=".test"></div>
```

#### Exit

- Attribute name: `data-onview-exit`
- Attribute value type: JavaScript code
- Description: [Executes the code](#code-execution) specified when the element exits out of view.

``` HTML
<!-- Logs the message to the console when the element exits out of view. -->
<div data-onview-enter="console.log('Element exited out of view.');"></div>
```

#### Exit add

- Attribute name: `data-onview-exit-add`
- Attribute value type: [attribute selector](#attribute-selector)
- Descriptions: Adds the attributes to the element when it exits out of view.

``` HTML
<!-- Adds the class `test` to the element when it exits out of view. -->
<div data-onview-exit-add=".test"></div>

<!-- Result after exiting out of view. -->
<div class="test"></div>
```

#### Exit remove

- Attribute name: `data-onview-exit-remove`
- Attribute value type: [attribute selector](#attribute-selector)
- Descriptions: Removes the attributes from the element when it exits out of view.

``` HTML
<!-- Removes the class `test` from the element when it exits out of view. -->
<div class="test" data-onview-exit-remove=".test"></div>

<!-- Result after exiting out of view. -->
<div></div>
```

#### Exit toggle

- Attribute name: `data-onview-exit-toggle`
- Attribute value type: [attribute selector](#attribute-selector)
- Description: Removes the attributes from the element when it enters into view, and adds the attributes to the element when it exits out of view.

``` HTML
<!--
  Removes the class `test` from the element when it enters into view,
  and adds the class `test` to the element when it exits out of view.
-->
<div class="test" data-onview-enter-toggle=".test"></div>

<!-- Result after entering into view. -->
<div data-onview-enter-toggle=".test"></div>

<!-- Result after exiting out of view. -->
<div class="test" data-onview-enter-toggle=".test"></div>
```

### Functional attributes

The following attributes can be combined with the previously mentioned observer attributes to modify their behaviour.

#### Delay

- Attribute name: `data-onview-delay`
- Attribute value type: Time in milliseconds as a number.
- Description: Delays the resulting effect by the given amount of time.

``` HTML
<!-- Logs the message 1000ms (1s) after the element has entered into view. -->
<div data-onview-enter="console.log('Element entered into view.');" data-onview-delay="1000"></div>

<!-- Logs the message 2500ms (2.5s) after the element has entered into view. -->
<div data-onview-enter="console.log('Element entered into view.');" data-onview-delay="2500"></div>
```

#### Repeat

- Attribute name: `data-onview-repeat`
- Description: Allows the `data-onview-enter`, `data-onview-enter-add`, `data-onview-enter-remove`, `data-onview-exit`, `data-onview-exit-add`, `data-onview-exit-add`, and `data-onview-exit-remove` to be repeated by not removing them from the observered element.

``` HTML
<!-- Logs the message to the console every time the element enters into view. -->
<div data-onview-enter="console.log('Element entered into view.');" data-onview-repeat></div>
```

## Code execution

Certain [observed attributes](#observed-attributes) can receive a value that is JavaScript code which will be executed when the criteria for the observer are met. The code is wrapped in a function call and provided with a single parameter called `detail`. The name of the given parameter can be changed through the [options](#options).

- `detail`
  - Description: Context of the invocation event.
  - Type: `object`
  - Properties
    - `entry`
      - Type: `IntersectionObserverEntry`. See the [IntersectionObserverEntry documentation](https://developer.mozilla.org/docs/Web/API/IntersectionObserverEntry) for more information.

``` HTML
<!-- Logs the message with the elements data. -->
<div data-onview-enter="console.log('Element entered into view: ', detail.entry.target);"></div>
```

## Attribute selector

Attributes can be added or removed using a [CSS style selector](https://developer.mozilla.org/docs/Web/CSS/CSS_Selectors).

### ID

To change the ID prepent the ID with a number sign (`#`).

``` HTML
<!-- Adds the ID with the text 'after' to the element when it enters into view. -->
<div data-onview-enter-add="#after"></div>

<!-- Result after entering into view. -->
<div id="after"></div>
```

``` HTML
<!-- Replaces the ID of 'before' with the ID of 'after' of the element when in enters into view. -->
<div id="before" data-onview-enter-add="#after"></div>

<!-- Result after entering into view. -->
<div id="after"></div>
```

### Classlist

To change the class list prepent the class name with a full stop (`.`).

``` HTML
<!-- Adds the class of 'after' to the classlist of the element when it enters into view. -->
<div class="before" data-onview-enter-add=".after"></div>

<!-- Result after entering into view. -->
<div class="before after"></div>
```

``` HTML
<!-- Removes the class of 'before' from the classlist of the element when it enters into view. -->
<div class="before" data-onview-enter-remove=".before"></div>

<!-- Result after entering into view. -->
<div></div>
```

### Attributes

To change the attributes an attribute name and value pair concatinated with an equals sign (`=`) and wrapped by a set of brackets (`[` and `]`) needs to be used.

``` HTML
<!-- Add the alt attribute with the text 'after' to the element when it enters into view. -->
<div data-onview-enter-add="[alt=after]"></div>

<!-- Result after entering into view. -->
<div alt="after"></div>
```

When removing attributes only the attribute name is read, therefore the attribute name wrapped by a set of brackets (`[` and `]`) is enough.

``` HTML
<!-- Removes the attribute with the name 'alt' from the element when it enters into view. -->
<div alt="before.jpg" data-onview-enter-remove="[alt]"></div>

<!-- Result after entering into view. -->
<div></div>
```

To add or remove multiple attributes, separate the values using the selector split character. By default the selector split chracter is a comma (`,`), this can be changed through the [options](#options).

``` HTML
<!--
  Replaces the ID of 'before' with the ID 'after'
  and adds the alt attribute with the text 'after'
  to the element when it enters into view.
-->
<div id="before" data-onview-enter-add="#after, [alt=after]"></div>

<!-- Result after entering into view. -->
<div id="after" alt="after"></div>
```

> Do note any invalid values will be ignored.

## Event listening

An event gets dispatched from each observed element regardless of which one of the [observered attribute](#observered-attributes) is applied. Only one event is dispatched per element no matter how many of the data attributes are added.

``` HTML
<!-- Add an element with an OnView observered attribute. -->
<div data-onview></div>

<!-- Load OnView script. -->
<script src="./onview.umd.js"></script>
<script>
  // Wait for the DOM to be interactive.
  document.addEventListener('DOMContentLoaded', function() {
    // Setup an OnView instance with the default options.
    var onView = new window.OnView();

    // Get the element that will be observed.
    var element = document.querySelector('[data-onview]');
    // Listen to the OnView change event.
    element.addEventListener('onview-change', function(event) {
      // Logs the message with the elements data.
      console.log('Element entered into view: ', event.detail.entry.target);
    });
  });
</script>
```

## Compatibility

The following functionality is required and therefore polyfills are recommended for supporting for older browsers:
- [Intersection Observer API](https://developer.mozilla.org/docs/Web/API/Intersection_Observer_API): see the [IntersectionObserver polyfill](https://github.com/w3c/IntersectionObserver/tree/master/polyfill#readme), or simply add `<script src="https://polyfill.io/v3/polyfill.min.js?features=IntersectionObserver"></script>` to your markup.
- [Custom events](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent): see the [CustomEvent polyfill](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent#Polyfill).
