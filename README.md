# Conduit

This package provides a functional API for Tracker.

## Installation

```sh
$ meteor add dburles:conduit
```

## Examples

### Basic usage

```js
// This example simply logs the current user document
// to the console whenever it changes
conduit
  .source(Meteor.user)
  .output(user => console.log(user));
```

### Advanced usage

#### Meteor Subscription

This example highlights working with a Meteor subscription.

```js
let limit = 5;

// This conduit will subscribe to the 'todos' collection
// with a `limit` argument and log the subscription readiness
const todosSubscriptionConduit = conduit
  .input(() => ({ limit }))
  .source(({ limit }) => Meteor.subscribe('todos', limit))
  .output(handle => console.log(handle.ready()));

// Change state
limit = 10;

// Notify the conduit of the new limit
todosSubscriptionConduit.update();

// At a later time we can stop the conduit and
// through the callback function, stop the Meteor subscription.
// In the real world this might live within a React component's
// `componentDidUnmount` method.
todosSubscriptionConduit.stop(handle => handle.stop());
```

#### Minimongo Cursor

```js
// Example state
const state = {
  todos: [],
  hideDone: false
};

// Watch a mongo cursor
const todosConduit = conduit
  .input(() => ({ hideDone: state.hideDone }))
  .source(input => {
    const selector = input.hideDone ? { checked: { $ne: true } } : {};
    return Todos.find(selector).fetch();
  })
  .output(source => state.todos = source);

// Update state
state.hideDone = true;

// Notify the `todosConduit` of the update
todosConduit.update();

// Call the stop method to stop the conduit
todosConduit.stop();
```

## API

#### input (optional)

Must return an object. This function is called when `update` is called.

Example:

```js
.input(() => {
  const { currentPostId } = store.getState();
  return { currentPostId };
});
```

####  source

This function must return a reactive data source. If `input` is provided, the `source` is called with an argument containing the object returned by `input`.

Examples:

```js
// No args required
.source(() => Session.get('test'))

// Args passed to subscription
.source(args => Meteor.subscribe('post', args.currentPostId));
```

#### output

This function is called with an argument containing the returned value from `source` both when the reactive function provided by `source` changes, or any of the arguments change.

Examples:

```js
.output(response => console.log(response));

// Log subscription readiness
.output(handle => console.log(handle.ready()));
```

#### Return value

Calling `.output()` returns an object containing two functions, `stop` and `update`.

```
stop([callback])
```

Calling this method stops the conduit from running (internally this just calls the `stop` method on the Tracker computation). It also takes an optional callback function that gets passed the response value from the conduit `source`. This allows you to perform extra cleanup, one example might be calling `stop` on a subscription handle.

```
update
```

Calling this function notifies the conduit to call the `input` function.

### License

MIT
