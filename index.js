/**
 * @file Walks a given object and invokes a function on each iteration.
 * @version 1.5.0
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module object-walk-x
 */

'use strict';

var defineProperties = require('object-define-properties-x');
var isFunction = require('is-function-x');
var isPrimitive = require('is-primitive');
var isArrayLike = require('is-array-like-x');
var includes = require('array-includes');
var some = require('array-some-x');
var SKIP = 'skip';
var BREAK = 'break';
var STOP = 'stop';

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
 * @param {!Object} stack - The `stack` for tracking circularity.
 */
// eslint-disable-next-line max-params
var iWalk = function internalWalk(object, props, supplier, thisArg, stack) {
  if (isPrimitive(object)) {
    return void 0;
  }

  var length = stack.length;
  var keys = props(object, length);
  if (isArrayLike(keys) === false) {
    keys = [];
  }

  var control;
  some(keys, function _some(prop) {
    var value = object[prop];
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

    stack.push(value);
    control = iWalk(value, props, supplier, thisArg, stack);
    stack.pop();
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
var oWalk = function objectWalk(object, props, supplier, thisArg) {
  if (isPrimitive(object) || isFunction(supplier) === false) {
    return;
  }

  iWalk(
    object,
    isFunction(props) ? props : Object.keys,
    supplier,
    thisArg,
    [object]
  );
};

defineProperties(oWalk, {
  /**
   * @static
   * @type string
   * @default break
   */
  BREAK: {
    value: BREAK
  },
  /**
   * @static
   * @type string
   * @default skip
   */
  SKIP: {
    value: SKIP
  },
  /**
   * @static
   * @type string
   * @default stop
   */
  STOP: {
    value: STOP
  }
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
module.exports = oWalk;
