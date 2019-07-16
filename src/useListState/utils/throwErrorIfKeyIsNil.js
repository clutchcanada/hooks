import * as R from "ramda";

export default (key) => R.isNil(key) && throwError('List item must have a key value');
