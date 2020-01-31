function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

import defineProperties from 'object-define-properties-x';
import isFunction from 'is-function-x';
import isPrimitive from 'is-primitive-x';
import isArrayLike from 'is-array-like-x';
import includes from 'array-includes-x';
import some from 'array-some-x';
import objectKeys from 'object-keys-x';
import methodize from 'simple-methodize-x';
import call from 'simple-call-x';
var aPop = methodize([].pop);
var SKIP = 'skip';
var BREAK = 'break';
var STOP = 'stop'; // eslint-disable jsdoc/check-param-names
// noinspection JSCommentMatchesSignature

/**
 * This method walks a given object and invokes a function on each
 * iteration.
 *
 * @private
 * @param {*} object - The `object` to walk.
 * @param {Function} props - The function that returns an array of the
 * properties of `value` to be walked, invoked per iteration.
 * @param {Function} supplier - The function invoked per `depth`.
 * @param {*} thisArg - The `this` binding of `supplier`.
 * @param args
 * @param {!object} stack - The `stack` for tracking circularity.
 */
// eslint-enable jsdoc/check-param-names

var internalWalk = function internalWalk(args) {
  var _args = _slicedToArray(args, 5),
      object = _args[0],
      props = _args[1],
      supplier = _args[2],
      thisArg = _args[3],
      stack = _args[4];

  if (isPrimitive(object)) {
    return null;
  }

  var length = stack.length;
  var keys = props(object, length);

  if (isArrayLike(keys) === false) {
    keys = [];
  }

  var control = null;
  some(keys, function predicate(prop) {
    var value = object[prop];
    control = call(supplier, thisArg, [value, prop, object, length]);

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
    control = internalWalk([value, props, supplier, thisArg, stack]);
    aPop(stack);
    return control === STOP;
  });
  return control;
}; // eslint-disable jsdoc/check-param-names
// noinspection JSCommentMatchesSignature

/**
 * This method walks a given object and invokes a function on each iteration.
 *
 * @param {*} object - The `object` to walk.
 * @param {Function} props - The function that returns an array of the
 *  properties of `value` to be walked, invoked per iteration.
 * @param {Function} supplier - The function invoked per iteration.
 * @param {*} [thisArg] - The `this` binding of `supplier`.
 */
// eslint-enable jsdoc/check-param-names


var objectWalk = function objectWalk(object, props, supplier) {
  if (isPrimitive(object) || isFunction(supplier) === false) {
    return;
  }
  /* eslint-disable-next-line prefer-rest-params */


  internalWalk([object, isFunction(props) ? props : objectKeys, supplier, arguments[4], [object]]);
}; // noinspection JSValidateTypes


defineProperties(objectWalk, {
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
export default objectWalk;

//# sourceMappingURL=object-walk-x.esm.js.map