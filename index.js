const _eq = require('lodash/eq')
const _set = require('lodash/set')
const _get = require('lodash/get')

const parentNode = Symbol('parentNode')
const rootNode = Symbol('rootNode')
const pathTravel = Symbol('pathTravel')
const noValue = Symbol('noValue')

/**
 * Selector
 */
function genSelectChild ({_, _t: __t}) {
  return function selectChild (paramChild, b) {
    const _t = __t()

    if (paramChild === undefined) return _t

    const obj = _[paramChild]

    if (obj) {
      return T(obj, {
        [parentNode]: _t,
        [pathTravel]: [..._t.pathTravel, paramChild],
        [rootNode]: _t.rootNode || _t
      })
    } else {
      return T({}, {
        [noValue]: true,
        [parentNode]: _t,
        [pathTravel]: [..._t.pathTravel, paramChild],
        [rootNode]: _t.rootNode || _t
      })
    }
  }
}

/**
 * Set a value
 */
function getSet ({_, [noValue]: _noValue, rootNode, pathTravel}) {
  /**
   * @param {String} [name]
   * @param {any}    value
   */
  return function set (value) {
    if (_noValue) {
      _set(rootNode, [...pathTravel], value)
    } else {
      _[name] = value
    }

    return this
  }
}

/**
 * Comapare value
 */
function genEq ({valueOf}) {
  return function eq (value) {
    return _eq(valueOf(), value)
  }
}

/**
 * Load ValueOf
 * Inspect if exists value, this remplace valueOf function.
 */
function genValueOf (_t) {
  const {[noValue]: _noValue} = _t

  if (_noValue) {
    return () => {
      const {rootNode, pathTravel, _} = _t

      return _get(rootNode, pathTravel)
    }
  } else {
    const {_} = _t
    return () => _
  }
}

/**
 * Tree Object
 */
function T (objArg, opts = {}) {
  const _parentNode = opts[parentNode] || null
  const _rootNode = opts[rootNode] || null
  const _pathTravel = opts[pathTravel] || []
  const _noValue = opts[noValue] || false

  let _t

  _t = genSelectChild({
    _: objArg,
    _t: () => _t
  })

  _t[noValue] = _noValue

  _t._ = objArg
  _t.valueOf = genValueOf(_t)

  // Alias to _t.valueOf
  _t.toJSON = _t.valueOf

  _t.rootNode = _rootNode

  _t.parentNode = _parentNode

  _t.pathTravel = _pathTravel

  _t.set = getSet(_t)
  _t.eq = genEq(_t)

  return _t
}

exports = module.exports
exports.T = T

