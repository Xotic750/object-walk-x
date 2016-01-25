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
 * objectWalk module. Like DOM walk but for objects.
 *
 * <h2>ECMAScript compatibility shims for legacy JavaScript engines</h2>
 * `es5-shim.js` monkey-patches a JavaScript context to contain all EcmaScript 5
 * methods that can be faithfully emulated with a legacy JavaScript engine.
 *
 * `es5-sham.js` monkey-patches other ES5 methods as closely as possible.
 * For these methods, as closely as possible to ES5 is not very close.
 * Many of these shams are intended only to allow code to be written to ES5
 * without causing run-time errors in older engines. In many cases,
 * this means that these shams cause many ES5 methods to silently fail.
 * Decide carefully whether this is what you want. Note: es5-sham.js requires
 * es5-shim.js to be able to work properly.
 *
 * `json3.js` monkey-patches the EcmaScript 5 JSON implimentation faithfully.
 *
 * `es6.shim.js` provides compatibility shims so that legacy JavaScript engines
 * behave as closely as possible to ECMAScript 6 (Harmony).
 *
 * @version 1.0.3
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module object-walk-x
 */

/*jslint maxlen:80, es6:false, white:true */

/*jshint bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
  freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
  nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
  es3:true, esnext:false, plusplus:true, maxparams:5, maxdepth:1,
  maxstatements:15, maxcomplexity:5 */

/*global module */

;(function () {
  'use strict';

  var defProps = require('define-properties-x').defineProperties;
  var isFunction = require('is-function-x');
  var isPrimitive = require('is-primitive');
  var isArrayLike = require('is-array-like-x');
  var pSome = Array.prototype.some;
  var pIndexOf = Array.prototype.indexOf;
  var pPush = Array.prototype.push;
  var pPop = Array.prototype.pop;
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
  function internalWalk(object, props, predicate, thisArg, stack) {
    if (isPrimitive(object)) {
      return;
    }
    var length = stack.length;
    var keys = props(object, length);
    if (!isArrayLike(keys)) {
      keys = [];
    }
    var control;
    pSome.call(keys, function (prop) {
      var value = object[prop];
      control = predicate.call(thisArg, value, prop, object, length);
      if (control === BREAK || control === STOP) {
        return true;
      }
      if (control === SKIP) {
        return false;
      }
      if (pIndexOf.call(stack, value) > -1) {
        throw new RangeError('Circular object');
      }
      pPush.call(stack, value);
      control = internalWalk(value, props, predicate, thisArg, stack);
      pPop.call(stack);
      return control === STOP;
    });
    return control;
  }

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
  function objectWalk(object, props, predicate, thisArg) {
    if (isPrimitive(object) || !isFunction(predicate)) {
      return;
    }
    internalWalk(
      object,
      isFunction(props) ? props : Object.keys,
      predicate,
      thisArg, [object]
    );
  }
  defProps(objectWalk, {
    /**
     * @static
     * @type string
     * @default skip
     */
    SKIP: SKIP,
    /**
     * @static
     * @type string
     * @default break
     */
    BREAK: BREAK,
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
  module.exports = objectWalk;
}());
