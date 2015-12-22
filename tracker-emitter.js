Tracker.emitter = (sourceFn, onChangeFn, argsFn) => {
  const args = argsFn
    ? R.map(value => new ReactiveVar(value), argsFn())
    : {};

  let response;

  const c = Tracker.autorun(() => {
    const pureArgs = R.map(value => value.get(), args);
    response = sourceFn(pureArgs);
    onChangeFn(response);
  });

  return {
    stop(cleanupFn) {
      if (cleanupFn) {
        cleanupFn(response);
      }
      c.stop();
    },
    update() {
      _.each(argsFn(), (value, key) => args[key].set(value));
    }
  };
};
