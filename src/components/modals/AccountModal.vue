<template>
  <modal
    name="accountModal"
    height="auto"
    @before-open="beforeOpen"
    @closed="closed"
    :scrollable="true"
    :adaptive="true">
      <div v-if="currentAddress" class="container account-modal">
        <h2 class="ui header center aligned">
          <a href="" class="ui sub header right floated" @click.prevent="closeModal()"><i class="fa fa-times"></i></a>
          <i class="fa fa-user"></i> 
          Account<br />
          <div class="ui sub header">{{ currentAddress }}</div>
        </h2>
        <!-- Details -->
        <div class="ui segment basic grid equal width">
          <div class="row">
            <div class="column">
              <b>Balance</b>
            </div>
            <div class="column right aligned">
              {{ balance }} Ξ
              <span class="ui icon red tiny compact button"
                    data-tooltip="Withdraw balance"
                    data-position="top right"
                    :class="{ 'disabled': balance === '0' }"
                    @click.prevent="withdraw()">
                  <i class="fa fa-arrow-down"></i>
              </span>
            </div>
          </div>
        </div>
        <h4 class="ui header">Zones <small>({{ zonesOwned.length }})</small></h4>
        <!-- No zones -->
        <div v-if="zonesOwned.length === 0" class="ui segment raised center aligned">
          No zones bought yet
        </div>
        <!-- Zones -->
        <div v-if="zonesOwned.length > 0" class="ui link cards">
          <div v-for="zone in zonesOwned" :key="zone.id" class="ui fluid raised card"
               :class="{ 'zone-sale-owner' : zone.onSale() }"
               @click.prevent="zoneClicked(zone.id)">
            <div class="content">
              <div class="ui grid equal width">
                <div class="column">
                  <span v-if="zone.code" :class="`flag flag-${zone.code.toLowerCase()}`"></span>
                  <b>{{ zone.name }}</b>
                </div>
                <div class="column right aligned">
                  <span v-if="zone.onSale()"
                    :data-tooltip="`On sale for ${zone.sellPrice} Ξ`" data-inverted="" data-position="left center">
                    <i class="fa fa-money"></i> {{ zone.sellPrice }} Ξ
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- MetaMask not installed -->
      <div v-if="!currentAddress" class="container account-modal">
        <h2 class="ui header center aligned">
          MetaMask required
        </h2>
        <p>
          ETHMap runs on the Ethereum blockchain, you need MetaMask to be installed in order to access your account/buy a zone.
        </p>
        <p>
          <a target="_blank" href="https://metamask.io/">MetaMask</a> is a browser Chrome and plugin that bridge the Ethereum blockchain 
            and is the easiest way to interact with Smart Contracts.
        </p>
      </div>
  </modal>
</template>

<script>
import Zone from '@/api/Zone'
import * as notif from '@/api/notif'

export default {
  name: 'accountModal',
  data () {
    return {
      balance: 0
    }
  },
  computed: {
    contract () {
      return this.$store.getters.contract
    },
    currentAddress () {
      return this.$store.getters.currentAddress
    },
    zonesOwned () {
      return this.$store.getters.zones.filter(z => z.owner === this.currentAddress)
    }
  },
  methods: {
    getZone (id) {
      return Zone.getById(id)
    },
    getBalance () {
      this.contract.methods.getBalance()
        .call({ from: this.currentAddress })
        .then((balance) => {
          this.balance = window.web3.utils.fromWei(balance, 'ether')
        })
    },
    zoneClicked (zoneId) {
      const zone = Zone.getById(zoneId)
      this.$modal.show('zoneModal', {
        zone: zone
      })
      this.closeModal()
    },
    withdraw () {
      this.contract.methods.withdraw()
        .send({ from: this.currentAddress })
        .then((res) => {
          this.balance = '0'
          notif.success(`Balance withdrawed !`)
        })
        .catch((err) => {
          console.log(err.message)
          notif.transactionDenied(err.message)
          notif.transactionPending(err.message)
        })
    },
    closeModal () {
      this.$modal.hide('accountModal')
    },
    beforeOpen (event) {
      this.getBalance()
    },
    closed (event) {
      this.balance = 0
    }
  },
  mounted () {

  }
}
</script>

<style scoped>
.account-modal {
  padding: 1.5em;
}
.card {
  margin-bottom: 0.1em !important;
}
.cards {
  margin-bottom: 0.35em !important;
  max-height: 512px;
  overflow-y: scroll;
}
.zone-sale-owner {
  background-color: rgba(255, 136, 17, 0.3) !important;
}
</style>
