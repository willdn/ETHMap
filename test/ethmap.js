const ETHMap = artifacts.require('./ETHMap.sol')

contract('ETHMap', (accounts) => {

  const owner = accounts[0]
  const account1  = accounts[1]
  const account2  = accounts[2]
  const account3  = accounts[3]

  it('should fail when not engough amount sent', () => {
    let APP
    return ETHMap.new()
      .then((instance) => {
        APP = instance
        return APP.buyZone(5, { from: account1, value: 1400000000000000 })
      })
      .catch((error) => {
        assert.equal(error.message, 'VM Exception while processing transaction: invalid opcode')
      })
  })

  it('should buy', () => {
    let APP
    return ETHMap.new()
      .then((instance) => {
        APP = instance
        APP.buyZone(5, { from: account1, value: 1500000000000000 })
        return APP.getZone(5)
      })
      .then((res) => {
        assert.equal(res[1], account1)
      })
  })

  it('should fail to buy when not on sale', () => {
    let APP
    return ETHMap.new()
      .then((instance) => {
        APP = instance
        APP.buyZone(5, { from: account1, value: 1500000000000000 })
        return APP.buyZone(5, { from: account2, value: 2000000000000000 })
      })
      .catch((error) => {
        assert.equal(error.message, 'VM Exception while processing transaction: invalid opcode')
      })
  })

  it('should fail buy when on sale and amount insufficient', () => {
    let APP
    return ETHMap.new()
      .then((instance) => {
        APP = instance
        APP.buyZone(5, { from: account1, value: 1500000000000000 })
        // account1 sell his zone
        APP.sell(5, 2000000000000000, { from: account1 })
        // account2 buy the zone
        return APP.buyZone(5, { from: account2, value: 1500000000000000 })
      })
      .catch((error) => {
        assert.equal(error.message, 'VM Exception while processing transaction: invalid opcode')
      })
  })

  it('should buy when on sale', () => {
    let APP
    return ETHMap.new()
      .then((instance) => {
        APP = instance
        APP.buyZone(5, { from: account1, value: 1500000000000000 })
        // account1 sell his zone
        APP.sell(5, 2000000000000000, { from: account1 })
        // account2 buy the zone
        APP.buyZone(5, { from: account2, value: 2000000000000000 })
        return APP.getZone(5)
      })
      .then((res) => {
        assert.equal(res[1], account2)
      })
  })

})