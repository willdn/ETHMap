import store from '../store'
// import config from '../config'
import BigNumber from 'bignumber.js'

class Zone {
  constructor (data) {
    this.id = data.id
    this.name = data.name
    this.code = data.code
    this.owner = data.owner
    this.sellPrice = data.sellPrice
  }

  static getById (id) {
    return store.getters.zones.find(c => c.id === id)
  }

  isOwner () {
    return (this.owner === store.getters.currentAddress)
  }

  hasOwner () {
    return (!this.owner.startsWith('0x0'))
  }

  onSale () {
    return (this.sellPrice !== '0' || this.owner.startsWith('0x0'))
  }

  isInitialSale () {
    return (this.owner.startsWith('0x0'))
  }

  getRequiredPrice () {
    if (this.isInitialSale()) return this.initialPrice()
    return this.sellPrice
  }

  initialPrice () {
    const initPrice = (0.001 + ((this.id - 1) * (0.001 / 2)))
    return new BigNumber(initPrice.toPrecision(6)).round(6).toNumber()
  }

  zoneKeyFill () {
    if (this.isOwner()) {
      if (this.onSale()) return 'OWNER_SALE'
      return 'OWNER'
    }
    if (!this.onSale()) return 'NOT_AVAILABLE'
    return 'AVAILABLE'
  }
}

export default Zone
