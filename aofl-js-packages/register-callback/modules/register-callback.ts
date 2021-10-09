type UnsubscribeFunction = {
  /** @internal */
  executed: boolean;
  (): void
};

type CallbackFunction = (err: Error|null, ...args: any) => void;
/**
 * RegisterCallback class. It allows callback functions to be registered and called in
 * series when registerCallbackinstance.next is called.
 */
class RegisterCallback {
  /**
   * array of registered callbacks
   */
  private callbacks : CallbackFunction[] = [];
  /**
   * When register() is invoked, it adds next and error functions to the callbacks list.
   */
  register(cb: CallbackFunction) {
    this.callbacks.push(cb);

    const unsubscribe : UnsubscribeFunction = () => {
      if (unsubscribe.executed) { return; }
      unsubscribe.executed = true;

      const index = this.callbacks.indexOf(cb);
      /* istanbul ignore else */
      if (index > -1) {
        this.callbacks.splice(index, 1);
      }
    };
    unsubscribe.executed = false;

    return unsubscribe;
  }

  /**
   * When next() is invoked, it calls all functions in this.callbacks list and passes error and args
   * to each function.
   */
  next(err : Error|null = null, ...args: any[]) {
    for (let i = 0; i < this.callbacks.length; i++) {
      this.callbacks[i].call(null, err, ...args);
    }
  }
}

export {
  RegisterCallback,
  CallbackFunction,
  UnsubscribeFunction
};
