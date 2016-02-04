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
  .source(args => Meteor.subscribe('todos', args.limit))
  .output(handle => console.log(handle.ready()));

// Change state
limit = 10;

// Notify the emitter of the new limit
todosSubscriptionConduit.update();

// At a later time we can stop the emitter and
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
  .source(args => {
    const selector = args.hideDone ? { checked: { $ne: true } } : {};
    return Todos.find(selector).fetch();
  })
  .output(response => state.todos = response);

// Update state
state.hideDone = true;

// Notify the `todosConduit` of the update
todosConduit.update();

// Call the stop method to stop the emitter
todosConduit.stop();
```

## API

### conduit

```
conduit [.input] .source .output
```

##### input (optional)

Must return an object. This function is called when `update` is called.

Example:

```js
const argsFn = () => {
  const { currentPostId } = store.getState();
  return { currentPostId };
};
```

#### 

This function must return a reactive data source. If an `argsFn` is provided to the emitter, the `sourceFn` is called with an argument containing the object returned by `argsFn`.

Examples:

```js
// No args required
const sourceFn = () => Session.get('test');

// Args passed to subscription
const sourceFn = args => Meteor.subscribe('post', args.currentPostId);
```

##### 2. Change

This function is called with an argument containing the returned value from `sourceFn` both when the reactive function provided by `sourceFn` changes, or any of the arguments change.

Examples:

```js
const onChange = response => console.log(response);

// Log subscription readiness
const onChange = handle => console.log(handle.ready());
```

##### 3. Arguments (Optional)



#### Return value

Calling `Tracker.emitter` returns an object containing two functions, `stop` and `update`.

```
stop([callback])
```

Calling this method stops the emitter from running (internally this just calls the `stop` method on the Tracker computation). It also takes an optional callback function that gets passed the response value from the emitter `sourceFn`. This allows you to perform extra cleanup, one example might be calling a `stop` on a subscription handle.

```
update
```

Calling this function notifies the emitter to call the `argsFn`.


### License

MIT
