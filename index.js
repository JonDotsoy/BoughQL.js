const _eq = require('lodash/eq')
const _set = require('lodash/set')
const _get = require('lodash/get')
const _setimmutable = require('setimmutable')

const parentNode = Symbol('parentNode')
const rootNode = Symbol('rootNode')
const pathTravel = Symbol('pathTravel')
const noValue = Symbol('noValue')
const immutable = 'immutable'

/**
 * Selector
 */
function genSelectChild ({_, _t: __t}) {
  return function selectChild (paramChild, b) {
    const _t = __t()

    if (paramChild === undefined) return _t

    return T(_, {
      [parentNode]: _t,
      [pathTravel]: [..._t.pathTravel, paramChild],
      [rootNode]: _t.rootNode || _t
    })
  }
}

/**
 * Set a value
 */
function getSet ({_, rootNode, pathTravel, immutable}) {
  /**
   * @param {*} value
   */
  return function set (value) {
    if (immutable) {
      rootNode._ = _setimmutable(rootNode._, [...pathTravel], value)
    } else {
      rootNode._ = _set(rootNode._, [...pathTravel], value)
    }

    return this
  }
}

/**
 * Comapare value
 */
function genEq (_t) {
  return function eq (value) {
    return _eq(_t.valueOf(), value)
  }
}

/**
 * Load ValueOf
 * Inspect if exists value, this remplace valueOf function.
 */
function genValueOf (_t) {
  const {[noValue]: _noValue} = _t

  return () => {
    const {rootNode, pathTravel, _} = _t

    if (pathTravel.length === 0 || rootNode === null) return _

    return _get(rootNode.valueOf(), pathTravel)
  }
}

/**
 * Tree Object
 */
function T (objArg, opts = {}) {
  if (objArg instanceof T) return objArg
  if (!(this instanceof T)) return new T(objArg, opts)

  const _parentNode = opts[parentNode] || null
  const _rootNode = opts[rootNode] || null
  const _pathTravel = opts[pathTravel] || []
  const _noValue = opts[noValue] || false
  const _immutable = opts[immutable] || true

  let _t

  _t = genSelectChild({
    _: objArg,
    _t: () => _t
  })

  _t[noValue] = _noValue
  _t.immutable = _immutable

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

