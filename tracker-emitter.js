const transform = (obj, fn) => {
  return Object.keys(obj).reduce(
    (next, key) => {
      next[key] = fn(obj[key]);
      return next;
    },
    {}
  );
};

Tracker.emitter = (sourceFn, onChangeFn, argsFn) => {
  const args = argsFn
    ? transform(argsFn(), value => new ReactiveVar(value))
    : {};

  let response;

  const c = Tracker.autorun(() => {
    response = sourceFn(
      transform(args, value => value.get())
    );
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
      return Object.keys(args).forEach(
        key => args[key].set(argsFn()[key])
      );
    }
  };
};
