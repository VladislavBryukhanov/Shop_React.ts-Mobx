import ow from 'ow';

export const fieldValidator = (condition: (fn: string) => boolean, errorMessage: string) =>
  (fn: string) => ow(fn, ow.string.validate(fn => ({
      validator: condition(fn),
      message: () => errorMessage
    })
  ));
