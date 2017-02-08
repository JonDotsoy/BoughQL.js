const expect = require('expect.js')

describe('TObj', function () {
  it('Example use 1', () => {
    const { T } = require('..')

    const obj = { a: { b: { c: [ { }, { }, { e: { f: { g: 'ok' } } } ] } } }

    const t = T(obj)

    expect(t('a')('b')('c')(2)('e')('f')('g').valueOf()).to.be('ok')

    // console.log(t('a')('b')('c')(2)('e')('f')('g').pathTravel)
    // console.log(t('a')('b')('c')(2)('e')('f')('g').rootNode)
  })

  it('Example use 2', () => {
    const { T } = require('..')

    const obj = { a: { b: { c: [ { }, { }, { e: { f: { g: 'ok' } } } ] } } }

    const t = T(obj)

    const parent = t('a')('b')('c')(2)('e')('f')
    const myChild = parent('g')

    expect(myChild.parentNode).to.be(parent)
  })

  it('Example use 3', () => {
    const { T } = require('..')

    expect(() => { T({ my: 'data' })()()()()()()()() }).not.to.throwError()
  })

  it('inspect root element', () => {
    const { T } = require('..')

    const obj = { a: { b: { c: { d: 3 } } } }

    const t = T(obj)

    const d = t('a')('b')('c')('d')

    expect(d.rootNode).to.be(t)
  })

  it('Inspect using not exists path', () => {
    const { T } = require('..')

    const obj = { a: { b: { c: { d: 3 } } } }

    const t = T(obj)

    expect(() => { t('a')('notExists')('c')('d') }).not.to.throwError()

    const child = t('a')('notExists')('c')('d')
    const pathTravel = child.pathTravel

    expect(pathTravel).to.have.length(4)
    expect(pathTravel[0]).to.be('a')
    expect(pathTravel[1]).to.be('notExists')
    expect(pathTravel[2]).to.be('c')
    expect(pathTravel[3]).to.be('d')

    expect(child.valueOf()).to.be(undefined)

    child.set(3)

    expect(child.valueOf()).to.be(3)
  })

  it('Path Travel', () => {
    const { T } = require('..')

    const obj = { a: { b: { c: { d: 3 } } } }

    const t = T(obj)

    expect(t.pathTravel).to.have.length(0)
    expect(t('a').pathTravel).to.have.length(1) // => ['a']
    expect(t('a')('b').pathTravel).to.have.length(2) // => ['a', 'b']
    expect(t('a')('b')('c').pathTravel).to.have.length(3) // => ['a', 'b', 'c']
    expect(t('a')('b')('c')('d').pathTravel).to.have.length(4) // => ['a', 'b', 'c', 'd']
    expect(t('a')('b')('c').pathTravel).to.have.length(3) // => ['a', 'b', 'c']
    expect(t('a')('b').pathTravel).to.have.length(2) // => ['a', 'b']
    expect(t('a').pathTravel).to.have.length(1) // => ['a']
    expect(t.pathTravel).to.have.length(0) // => []

    expect(t('a')('b').pathTravel).not.to.be(t('a')('b').pathTravel)
    expect(t('a')('b')('c')('d').pathTravel[0]).to.be('a')
    expect(t('a')('b')('c')('d').pathTravel[1]).to.be('b')
    expect(t('a')('b')('c')('d').pathTravel[2]).to.be('c')
    expect(t('a')('b')('c')('d').pathTravel[3]).to.be('d')
  })

  describe('Features', function () {
    it('t#set', () => {
      const { T } = require('..')

      const t = T({ a: 3 })

      t('b').set(4)

      expect(t('b').valueOf()).to.be(4)
    })

    it('t#eq', () => {
      const { T } = require('..')

      const t = T({ a: 3 })

      expect(t('a').eq(3)).to.be.ok()
      expect(t('a').eq(4)).not.to.be.ok()
    })

    it('t#valueOf', () => {
      const { T } = require('..')

      const obj = { a: { b: { c: { d: 3 } } } }

      const t = T(obj)

      expect(t.valueOf()).to.be(obj)
      expect(t('a')('b')('c').valueOf()).to.be(obj.a.b.c)
      expect(t('a')('b')('c')('d') + 2).to.be(5)
      expect(t('a')('b')('c')('d') + 2).to.be.a('number')
    })

    it('t#toJSON', () => {
      const { T } = require('..')

      const obj = { a: { b: { c: { d: 3 } } } }

      const t = T(obj)

      expect(t.toJSON()).to.be(obj)
      expect(JSON.stringify(t)).to.be(JSON.stringify(obj))
    })

    it('t#invoke', () => {
      const { T } = require('..')

      const obj = { a: { b: { c: { d: (n = 1) => n + 3 } } } }

      const t = T(obj)

      expect(t('a')('b')('c')('d').invoke()).to.be(4)
      expect(t('a')('b')('c')('d').invoke(2)).to.be(5)
      expect(t('a')('b')('c')('d').invoke(10)).to.be(13)
    })
  })
})

