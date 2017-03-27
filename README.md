<a name="module_object-walk-x"></a>

## object-walk-x
<a href="https://travis-ci.org/Xotic750/object-walk-x"
title="Travis status">
<img src="https://travis-ci.org/Xotic750/object-walk-x.svg?branch=master"
alt="Travis status" height="18">
</a>
<a href="https://david-dm.org/Xotic750/object-walk-x"
title="Dependency status">
<img src="https://david-dm.org/Xotic750/object-walk-x.svg"
alt="Dependency status" height="18"/>
</a>
<a href="https://david-dm.org/Xotic750/object-walk-x#info=devDependencies"
title="devDependency status">
<img src="https://david-dm.org/Xotic750/object-walk-x/dev-status.svg"
alt="devDependency status" height="18"/>
</a>
<a href="https://badge.fury.io/js/object-walk-x" title="npm version">
<img src="https://badge.fury.io/js/object-walk-x.svg"
alt="npm version" height="18">
</a>

Like DOM walk but for objects.

**Version**: 1.1.1  
**Author**: Xotic750 <Xotic750@gmail.com>  
**License**: [MIT](&lt;https://opensource.org/licenses/MIT&gt;)  
**Copyright**: Xotic750  

* [object-walk-x](#module_object-walk-x)
    * [`module.exports(object, props, predicate, thisArg)`](#exp_module_object-walk-x--module.exports) ⏏
        * [`.BREAK`](#module_object-walk-x--module.exports.BREAK) : <code>string</code>
        * [`.SKIP`](#module_object-walk-x--module.exports.SKIP) : <code>string</code>
        * [`.STOP`](#module_object-walk-x--module.exports.STOP) : <code>string</code>

<a name="exp_module_object-walk-x--module.exports"></a>

### `module.exports(object, props, predicate, thisArg)` ⏏
This method walks a given object and invokes a function on each iteration.

**Kind**: Exported function  

| Param | Type | Description |
| --- | --- | --- |
| object | <code>\*</code> | The `object` to walk. |
| props | <code>function</code> | The function that returns an array of the  properties of `value` to be walked, invoked per iteration. |
| predicate | <code>function</code> | The function invoked per iteration. |
| thisArg | <code>\*</code> | The `this` binding of `predicate`. |

<a name="module_object-walk-x--module.exports.BREAK"></a>

#### `module.exports.BREAK` : <code>string</code>
**Kind**: static property of <code>[module.exports](#exp_module_object-walk-x--module.exports)</code>  
**Default**: <code>&quot;break&quot;</code>  
<a name="module_object-walk-x--module.exports.SKIP"></a>

#### `module.exports.SKIP` : <code>string</code>
**Kind**: static property of <code>[module.exports](#exp_module_object-walk-x--module.exports)</code>  
**Default**: <code>&quot;skip&quot;</code>  
<a name="module_object-walk-x--module.exports.STOP"></a>

#### `module.exports.STOP` : <code>string</code>
**Kind**: static property of <code>[module.exports](#exp_module_object-walk-x--module.exports)</code>  
**Default**: <code>&quot;stop&quot;</code>  
