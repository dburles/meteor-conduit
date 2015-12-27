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
  const argsR = argsFn
    ? transform(argsFn(), value => new ReactiveVar(value))
    : {};

  let response;

  const c = Tracker.autorun(() => {
    response = sourceFn(
      transform(argsR, value => value.get())
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
      const args = argsFn();
      return Object.keys(argsR).forEach(
        key => argsR[key].set(args[key])
      );
    }
  };
};
