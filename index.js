/**
 * @file
 * <a href="https://travis-ci.org/Xotic750/object-walk-x"
 * title="Travis status">
 * <img src="https://travis-ci.org/Xotic750/object-walk-x.svg?branch=master"
 * alt="Travis status" height="18">
 * </a>
 * <a href="https://david-dm.org/Xotic750/object-walk-x"
 * title="Dependency status">
 * <img src="https://david-dm.org/Xotic750/object-walk-x.svg"
 * alt="Dependency status" height="18"/>
 * </a>
 * <a href="https://david-dm.org/Xotic750/object-walk-x#info=devDependencies"
 * title="devDependency status">
 * <img src="https://david-dm.org/Xotic750/object-walk-x/dev-status.svg"
 * alt="devDependency status" height="18"/>
 * </a>
 * <a href="https://badge.fury.io/js/object-walk-x" title="npm version">
 * <img src="https://badge.fury.io/js/object-walk-x.svg"
 * alt="npm version" height="18">
 * </a>
 *
 * Like DOM walk but for objects.
 *
 * Requires ES3 or above.
 *
 * @version 1.2.0
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module object-walk-x
 */

/* eslint strict: 1, max-statements: 1 */

/* global module */

;(function () { // eslint-disable-line no-extra-semi

  'use strict';

  var define = require('define-properties-x');
  var isFunction = require('is-function-x');
  var isPrimitive = require('is-primitive');
  var isArrayLike = require('is-array-like-x');
  var includes = require('array-includes');
  var some = require('array.prototype.some');
  var SKIP = 'skip';
  var BREAK = 'break';
  var STOP = 'stop';

  /**
   * This method walks a given object and invokes a function on each
   * iteration.
   *
   * @private
   * @param {*} object The `object` to walk.
   * @param {Function} props The function that returns an array of the
   *  properties of `value` to be walked, invoked per iteration.
   * @param {Function} predicate The function invoked per `depth`.
   * @param {*} thisArg The `this` binding of `predicate`.
   * @param {!Object} stack The `stack` for tracking circularity.
   */
  var iWalk = function internalWalk(object, props, predicate, thisArg, stack) {
    if (isPrimitive(object)) {
      return void 0;
    }
    var length = stack.length;
    var keys = props(object, length);
    if (!isArrayLike(keys)) {
      keys = [];
    }
    var control;
    some(keys, function (prop) {
      var value = object[prop];
      control = predicate.call(thisArg, value, prop, object, length);
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
      control = iWalk(value, props, predicate, thisArg, stack);
      stack.pop();
      return control === STOP;
    });
    return control;
  };

  /**
   * This method walks a given object and invokes a function on each iteration.
   *
   * @private
   * @param {*} object The `object` to walk.
   * @param {Function} props The function that returns an array of the
   *  properties of `value` to be walked, invoked per iteration.
   * @param {Function} predicate The function invoked per iteration.
   * @param {*} thisArg The `this` binding of `predicate`.
   */
  var oWalk = function objectWalk(object, props, predicate, thisArg) {
    if (isPrimitive(object) || !isFunction(predicate)) {
      return;
    }
    iWalk(object, isFunction(props) ? props : Object.keys, predicate, thisArg, [object]);
  };

  define.properties(oWalk, {
    /**
     * @static
     * @type string
     * @default break
     */
    BREAK: BREAK,
    /**
     * @static
     * @type string
     * @default skip
     */
    SKIP: SKIP,
    /**
     * @static
     * @type string
     * @default stop
     */
    STOP: STOP
  });

  /**
   * This method walks a given object and invokes a function on each iteration.
   *
   * @function
   * @param {*} object The `object` to walk.
   * @param {Function} props The function that returns an array of the
   *  properties of `value` to be walked, invoked per iteration.
   * @param {Function} predicate The function invoked per iteration.
   * @param {*} thisArg The `this` binding of `predicate`.
   */
  module.exports = oWalk;
}());
