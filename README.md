<a
  href="https://travis-ci.org/Xotic750/object-walk-x"
  title="Travis status">
<img
  src="https://travis-ci.org/Xotic750/object-walk-x.svg?branch=master"
  alt="Travis status" height="18">
</a>
<a
  href="https://david-dm.org/Xotic750/object-walk-x"
  title="Dependency status">
<img src="https://david-dm.org/Xotic750/object-walk-x/status.svg"
  alt="Dependency status" height="18"/>
</a>
<a
  href="https://david-dm.org/Xotic750/object-walk-x?type=dev"
  title="devDependency status">
<img src="https://david-dm.org/Xotic750/object-walk-x/dev-status.svg"
  alt="devDependency status" height="18"/>
</a>
<a
  href="https://badge.fury.io/js/object-walk-x"
  title="npm version">
<img src="https://badge.fury.io/js/object-walk-x.svg"
  alt="npm version" height="18">
</a>
<a
  href="https://www.jsdelivr.com/package/npm/object-walk-x"
  title="jsDelivr hits">
<img src="https://data.jsdelivr.com/v1/package/npm/object-walk-x/badge?style=rounded"
  alt="jsDelivr hits" height="18">
</a>
<a
  href="https://bettercodehub.com/results/Xotic750/object-walk-x"
  title="bettercodehub score">
<img src="https://bettercodehub.com/edge/badge/Xotic750/object-walk-x?branch=master"
  alt="bettercodehub score" height="18">
</a>

<a name="module_object-walk-x"></a>

## object-walk-x

Walks a given object and invokes a function on each iteration.

- [object-walk-x](#module_object-walk-x)
  - [`module.exports(object, props, supplier, [thisArg])`](#exp_module_object-walk-x--module.exports) ⏏
    - [`.BREAK`](#module_object-walk-x--module.exports.BREAK) : <code>string</code>
    - [`.SKIP`](#module_object-walk-x--module.exports.SKIP) : <code>string</code>
    - [`.STOP`](#module_object-walk-x--module.exports.STOP) : <code>string</code>

<a name="exp_module_object-walk-x--module.exports"></a>

### `module.exports(object, props, supplier, [thisArg])` ⏏

This method walks a given object and invokes a function on each iteration.

**Kind**: Exported function

| Param     | Type                  | Description                                                                                          |
| --------- | --------------------- | ---------------------------------------------------------------------------------------------------- |
| object    | <code>\*</code>       | The `object` to walk.                                                                                |
| props     | <code>function</code> | The function that returns an array of the properties of `value` to be walked, invoked per iteration. |
| supplier  | <code>function</code> | The function invoked per iteration.                                                                  |
| [thisArg] | <code>\*</code>       | The `this` binding of `supplier`.                                                                    |

**Example**

```js
const objectWalk from 'object-walk-x';

const subject = {
  one: {
    a: true,
    b: true,
  },
  two: {
    x: true,
    y: true,
  },
};

objectWalk(subject, Object.keys, function(value, prop, object, depth) {
  object[prop + '_renamed'] = value;
  delete object[prop];
});

// {
//  one_renamed: {
//    a_renamed: true,
//     b_renamed: true
//   },
//   two_renamed: {
//    x_renamed: true,
//     y_renamed: true
//   }
// }
```

<a name="module_object-walk-x--module.exports.BREAK"></a>

#### `module.exports.BREAK` : <code>string</code>

**Kind**: static property of [<code>module.exports</code>](#exp_module_object-walk-x--module.exports)  
**Default**: <code>&quot;break&quot;</code>  
<a name="module_object-walk-x--module.exports.SKIP"></a>

#### `module.exports.SKIP` : <code>string</code>

**Kind**: static property of [<code>module.exports</code>](#exp_module_object-walk-x--module.exports)  
**Default**: <code>&quot;skip&quot;</code>  
<a name="module_object-walk-x--module.exports.STOP"></a>

#### `module.exports.STOP` : <code>string</code>

**Kind**: static property of [<code>module.exports</code>](#exp_module_object-walk-x--module.exports)  
**Default**: <code>&quot;stop&quot;</code>
