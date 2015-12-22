# Tracker Emitter

This package provides an API to easily hook listener and emitter functions into Tracker.

## Installation

```sh
$ meteor add dburles:tracker-emitter
```

## Examples

### Basic usage

```js
// this example simply logs the current user document
// to the console whenever it changes
Tracker.emitter(
  Meteor.user,
  response => console.log(response)
);
```

### Advanced usage

#### Meteor subscription

This example highlights working with a Meteor subscription.

```js
let limit = 5;

// this emitter will subscribe to the 'todos' collection
// with a `limit` argument and log the subscription readiness
const todosSubscriptionEmitter = Tracker.emitter(
  args => Meteor.subscribe('todos', args.limit),
  handle => console.log(handle.ready()),
  () => ({ limit })
);

// change state
limit = 10;

// notify the emitter of the new limit
todosSubscriptionEmitter.update();

// at a later time we can stop the emitter and
// through the callback function, stop the Meteor subscription.
// in the real world this might live within a React component's
// `componentDidUnmount` method.
todosSubscriptionEmitter.stop(handle => handle.stop());
```

#### Minimongo Cursor

```js
// example state
const state = {
  todos: [],
  hideDone: false
};

// watch a mongo cursor
const todosEmitter = Tracker.emitter(
  args => {
    const selector = args.hideDone ? { checked: { $ne: true } } : {};
    return Todos.find(selector).fetch();
  },
  response => state.todos = response,
  () => ({ hideDone: state.hideDone })
);

// update state
state.hideDone = true;

// notify the `todosEmitter` of the update
todosEmitter.update();

// call the stop method to stop the emitter
todosEmitter.stop();
```

## API

### Tracker.emitter

```
Tracker.emitter(sourceFn, onChangeFn[, argsFn])
```

Returns an object containing two functions, `stop` and `update`.

```
stop([callback])
```

Calling this method stops the emitter from running (interally this just calls the `stop` method on the Tracker computation). It also takes an optional callback function that gets passed the response value from the emitter `sourceFn`. This allows you to perform extra cleanup, one example might be calling a `stop` on a subscription handle.

```
update
```

Calling this function notifies the emitter to call the `argsFn`.


### License

MIT
