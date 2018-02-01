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
        return APP.buyZone(5, { from: account1, value: 2900000000000000 })
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
        APP.buyZone(5, { from: account1, value: 3000000000000000 })
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
        APP.buyZone(5, { from: account1, value: 3000000000000000 })
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
        APP.buyZone(5, { from: account1, value: 3000000000000000 })
        // account1 sell his zone
        APP.sellZone(5, 2000000000000000, { from: account1 })
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
        APP.buyZone(5, { from: account1, value: 3000000000000000 })
        // account1 sell his zone
        APP.sellZone(5, 2000000000000000, { from: account1 })
        // account2 buy the zone
        APP.buyZone(5, { from: account2, value: 2000000000000000 })
        return APP.getZone(5)
      })
      .then((res) => {
        assert.equal(res[1], account2)
      })
  })

  it('should fail to xfer zone not owner', () => {
    let APP
    return ETHMap.new()
      .then((instance) => {
        APP = instance
        APP.buyZone(5, { from: account1, value: 3000000000000000 })
        return APP.transferZone(5, account2 , { from: account2 })
      })
      .catch((error) => {
        assert.equal(error.message, 'VM Exception while processing transaction: invalid opcode')
        return APP.transferZone(178, account2 , { from: account2 })
      })
      .catch((error) => {
        assert.equal(error.message, 'VM Exception while processing transaction: invalid opcode')
      })
  })

  it('should xfer zone', () => {
    let APP
    return ETHMap.new()
      .then((instance) => {
        APP = instance
        APP.buyZone(5, { from: account1, value: 3000000000000000 })
        APP.transferZone(5, account2, { from: account1 })
        return APP.getZone(5)
      })
      .then((res) => {
        assert.equal(res[1], account2)
      })
  })

  it('should fail to change owner address', () => {
    let APP
    return ETHMap.new()
      .then((instance) => {
        APP = instance
        return APP.transferContractOwnership(account1, { from: account1 })
      })
      .catch((error) => {
        assert.equal(error.message, 'VM Exception while processing transaction: invalid opcode')
      })
  })

  it('should correctly distribute amount', () => {
    let APP
    return ETHMap.new()
      .then((instance) => {
        APP = instance
        APP.buyZone(5, { from: account1, value: 3000000000000000 })
        APP.buyZone(6, { from: account1, value: 3500000000000000 })
        APP.buyZone(7, { from: account1, value: 4000000000000000 })
        APP.sellZone(5, 1000000000000000000 , { from: account1 }) // Sell for 1 ETH
        APP.sellZone(6, 1000000000000000000 , { from: account1 }) // Sell for 1 ETH
        APP.buyZone(5, { from: account2, value: 1000000000000000000 })
        APP.buyZone(6, { from: account2, value: 1000000000000000000 })
        return APP.getBalance({ from: account1 })
      })
      .then((res) => {
        // (1000000000000000000 * 0.98) * 2
        assert.equal(res.toNumber(), 1960000000000000000)
        return APP.getBalance({ from: owner })
      })
      .then((res) => {
        // 3000000000000000 + 3500000000000000 + 4000000000000000 + (1000000000000000000 * 0.02) * 2
        assert.equal(res.toNumber(), 50500000000000000)
      })
  })

})