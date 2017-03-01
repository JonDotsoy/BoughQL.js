## Proposal

_**Before:**_

```javascript
const myObj = {}

myObj.a.b.c.d.f.e.g = 9
/*TypeError: Cannot read property 'b' of undefined
*     at [eval]:1:8
*     at ContextifyScript.Script.runInThisContext (vm.js:23:33)
*     at Object.exports.runInThisContext (vm.js:74:17)
*     at Object.<anonymous> ([eval]-wrapper:6:22)
*     at Module._compile (module.js:571:32)
*     at Immediate.<anonymous> (bootstrap_node.js:387:29)
*     at runCallback (timers.js:651:20)
*     at tryOnImmediate (timers.js:624:5)
*     at processImmediate [as _immediateCallback] (timers.js:596:5)
*/
```

_**After:**_

```javascript
const myObj = T({})

myObj.a.b.c.d.f.e.g = 9
/*result:
* // myObj
* {
*     a: {
*         b: {
*             c: {
*                 d: {
*                     e: {
*                         g: 9
*                     }
*                 }
*             }
*         }
*     }
* }
*/
```
