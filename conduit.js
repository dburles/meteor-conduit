const transform = (obj, fn) => {
  return Object.keys(obj).reduce(
    (next, key) => {
      next[key] = fn(obj[key]);
      return next;
    },
    {}
  );
};

export const conduit = {
  input(argsFn) {
    this.argsFn = argsFn;
    return this;
  },

  source(sourceFn) {
    this.sourceFn = sourceFn;
    return this;
  },

  output(onChangeFn) {
    const { argsFn, sourceFn } = this;
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
  }
};
