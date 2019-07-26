import * as R from "ramda";
import { throwError } from "@clutch/helpers";

export default (key) => R.isNil(key) && throwError('List item must have a uniqueKey value');
