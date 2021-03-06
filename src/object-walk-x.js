import defineProperties from 'object-define-properties-x';
import isFunction from 'is-function-x';
import isPrimitive from 'is-primitive-x';
import isArrayLike from 'is-array-like-x';
import includes from 'array-includes-x';
import some from 'array-some-x';
import objectKeys from 'object-keys-x';
import methodize from 'simple-methodize-x';
import call from 'simple-call-x';

const aPop = methodize([].pop);
const SKIP = 'skip';
const BREAK = 'break';
const STOP = 'stop';

// eslint-disable jsdoc/check-param-names
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
const internalWalk = function internalWalk(args) {
  const [object, props, supplier, thisArg, stack] = args;

  if (isPrimitive(object)) {
    return null;
  }

  const {length} = stack;
  let keys = props(object, length);

  if (isArrayLike(keys) === false) {
    keys = [];
  }

  let control = null;
  some(keys, function predicate(prop) {
    const value = object[prop];
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
};

// eslint-disable jsdoc/check-param-names
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
const objectWalk = function objectWalk(object, props, supplier) {
  if (isPrimitive(object) || isFunction(supplier) === false) {
    return;
  }

  /* eslint-disable-next-line prefer-rest-params */
  internalWalk([object, isFunction(props) ? props : objectKeys, supplier, arguments[4], [object]]);
};

// noinspection JSValidateTypes
defineProperties(objectWalk, {
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

export default objectWalk;
