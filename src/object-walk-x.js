/**
 * @file Walks a given object and invokes a function on each iteration.
 * @version 1.7.0
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module object-walk-x
 */

import defineProperties from 'object-define-properties-x';

import isFunction from 'is-function-x';
import isPrimitive from 'is-primitive';
import isArrayLike from 'is-array-like-x';
import includes from 'array-includes-x';
import some from 'array-some-x';
import objectKeys from 'object-keys-x';

const aPop = Array.prototype.pop;
const SKIP = 'skip';
const BREAK = 'break';
const STOP = 'stop';

/**
 * This method walks a given object and invokes a function on each
 * iteration.
 *
 * @private
 * @param {*} object - The `object` to walk.
 * @param {Function} props - The function that returns an array of the
 *  properties of `value` to be walked, invoked per iteration.
 * @param {Function} supplier - The function invoked per `depth`.
 * @param {*} thisArg - The `this` binding of `supplier`.
 * @param {!object} stack - The `stack` for tracking circularity.
 */
// eslint-disable-next-line max-params
var iWalk = function internalWalk(object, props, supplier, thisArg, stack) {
  if (isPrimitive(object)) {
    return void 0;
  }

  const {length} = stack;
  let keys = props(object, length);

  if (isArrayLike(keys) === false) {
    keys = [];
  }

  let control;
  some(keys, function _some(prop) {
    const value = object[prop];
    control = supplier.call(thisArg, value, prop, object, length);

    if (control === BREAK || control === STOP) {
      return true;
    }

    if (control === SKIP) {
      return false;
    }

    if (includes(stack, value)) {
      throw new RangeError('Circular object');
    }

    stack[stack.length] = value;
    control = iWalk(value, props, supplier, thisArg, stack);
    aPop.call(stack);

    return control === STOP;
  });

  return control;
};

/**
 * This method walks a given object and invokes a function on each iteration.
 *
 * @private
 * @param {*} object - The `object` to walk.
 * @param {Function} props - The function that returns an array of the
 *  properties of `value` to be walked, invoked per iteration.
 * @param {Function} supplier - The function invoked per iteration.
 * @param {*} [thisArg] - The `this` binding of `supplier`.
 */
// eslint-disable-next-line max-params
const oWalk = function objectWalk(object, props, supplier, thisArg) {
  if (isPrimitive(object) || isFunction(supplier) === false) {
    return;
  }

  iWalk(object, isFunction(props) ? props : objectKeys, supplier, thisArg, [object]);
};

defineProperties(oWalk, {
  /**
   * @static
   * @type string
   * @default break
   */
  BREAK: {
    value: BREAK,
  },
  /**
   * @static
   * @type string
   * @default skip
   */
  SKIP: {
    value: SKIP,
  },
  /**
   * @static
   * @type string
   * @default stop
   */
  STOP: {
    value: STOP,
  },
});

/**
 * This method walks a given object and invokes a function on each iteration.
 *
 * @function
 * @param {*} object - The `object` to walk.
 * @param {Function} props - The function that returns an array of the
 *  properties of `value` to be walked, invoked per iteration.
 * @param {Function} supplier - The function invoked per iteration.
 * @param {*} [thisArg] - The `this` binding of `supplier`.
 * @example
 * var objectWalk = require('object-walk-x');
 *
 * var subject = {
 *   one: {
 *     a: true,
 *     b: true
 *   },
 *   two: {
 *     x: true,
 *     y: true
 *   }
 * };
 *
 * objectWalk(
 *   subject,
 *   Object.keys,
 *   function (value, prop, object, depth) {
 *     object[prop + '_renamed' ] = value;
 *     delete object[prop];
 *   }
 * );
 *
 * // {
 * //  one_renamed: {
 * //    a_renamed: true,
 * //     b_renamed: true
 * //   },
 * //   two_renamed: {
 * //    x_renamed: true,
 * //     y_renamed: true
 * //   }
 * // }
 */
export default oWalk;
