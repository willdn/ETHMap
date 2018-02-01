<template>
  <div id="app">
    <navbar />
    <router-view />
    <!-- Modals -->
    <zone-modal></zone-modal>
    <account-modal></account-modal>
    <faq-modal></faq-modal>
    <zone-list-modal></zone-list-modal>
  </div>
</template>

<script>
import '@/assets/css/semantic.simplex.css'
import '@/assets/css/style.css'
import '@/assets/css/flag-css.css'
// import 'vue-nav-tabs/themes/vue-tabs.css'
import '../node_modules/izitoast/dist/css/iziToast.min.css'

import Navbar from '@/components/Navbar'
// Modals
import ZoneModal from '@/components/modals/ZoneModal'
import AccountModal from '@/components/modals/AccountModal'
import FaqModal from '@/components/modals/FaqModal'
import ZoneListModal from '@/components/modals/ZoneListModal'

import Zone from '@/api/Zone'
import JSONInterface from '../static/contracts/ETHMap.json'
import config from './config'
import Web3 from 'web3'

const networkConfig = {
  'live': {
    networkId: 1,
    contractAddress: config.contractAddressLive,
    fallback: `https://mainnet.infura.io/${config.infuraAPIKey}`
  },
  'ropsten': {
    networkId: 3,
    contractAddress: config.contractAddressRopsten,
    fallback: `https://ropsten.infura.io/${config.infuraAPIKey}`
  },
  'dev': {
    contractAddress: config.contractAddressDev,
    fallback: 'http://localhost:9545'
  }
}

export default {
  components: {
    Navbar,
    ZoneModal,
    AccountModal,
    FaqModal,
    ZoneListModal
  },
  name: 'app',
  data () {
    return {
      network: 'live'
    }
  },
  methods: {
    setWeb3 () {
      if (typeof web3 !== 'undefined') {
        console.log('Web3 injected browser: OK.')
        window.web3 = new Web3(window.web3.currentProvider)
      } else {
        console.log('Web3 injected browser: Fail.')
        window.web3 = new Web3(new Web3.providers.HttpProvider(networkConfig[this.network].fallback))
      }
      return window.web3
    },
    getContract () {
      const MapContract = new window.web3.eth.Contract(JSONInterface.abi, networkConfig[this.network].contractAddress)
      return Object.freeze(MapContract)
    },
    getCurrentAddress () {
      return window.web3.eth.getAccounts()
        .then((addresses) => {
          const address = addresses[0]
          if (this.$store.getters.currentAddress !== address) {
            this.$store.dispatch('setCurrentAddress', address)
          }
          return address
        })
    },
    loadZones () {
      for (let i = 1; i <= 178; i++) {
        this.getZone(i)
      }
      return true
    },
    getZone (id) {
      return this.$store.getters.contract.methods.getZone(id)
        .call()
        .then((_zone) => {
          /* globals web3 */
          const price = web3.utils.fromWei(_zone.sellPrice, 'ether')
          const zone = new Zone({
            id: id,
            sellPrice: price,
            owner: _zone.owner
          })
          this.$store.dispatch('addZone', zone)
        })
        .catch((err) => {
          // Most certainly because on wrong network
          this.$store.dispatch('setNetworkUnknown', true)
          this.$store.dispatch('setMapLoaded', true)
          console.log(err.message)
          return err
        })
    }
  },
  mounted () {
    this.setWeb3()
    const contract = this.getContract()
    this.$store.dispatch('setContract', contract)
    this.getCurrentAddress()
      .then((currentAddress) => {
        return this.$store.dispatch('setCurrentAddress', currentAddress)
      })
      .then(() => {
        return this.loadZones()
      })
      .then(() => {
        setInterval(() => {
          // Start MetaMask polling
          this.getCurrentAddress()
        }, 5000)
        return true
      })
  }
}
</script>

<style>
</style>
