<template>
  <modal
    name="zoneModal"
    height="auto"
    @before-open="beforeOpen"
    @closed="closed"
    :adaptive="true">
      <div class="container zone-modal"
        v-if="zone">
        <!-- Header -->
        <h2 class="ui header center aligned">
          <a href="" class="ui sub header right floated" @click.prevent="closeModal()"><i class="fa fa-times"></i></a>
          <span :class="`flag flag-${zone.code.toLowerCase()}`"></span> {{ zone.name }}
          <div v-if="zone.hasOwner()" class="ui sub header"
               data-tooltip="Current owner" data-inverted="" data-position="bottom center">
            <i class="fa fa-user"></i> {{ zone.owner }}
          </div>
        </h2>
        <!-- Zone not on sale -->
        <div v-if="!zone.onSale() && !zone.isOwner()" class="ui container message owned-message center aligned">
          <p><span :class="`flag flag-${zone.code.toLowerCase()}`"></span> <b>{{ zone.name }}</b> is currently owned by <b>{{ zone.owner }}</b></p>
        </div>
        <!-- Zone Owner -->
        <!-- -->
        <div v-if="zone.isOwner()" class="ui container">
          <div class="ui container center aligned message owner-message"
               :class="{ 'owner-sale-message': zone.onSale() }">
            <p>You own <span :class="`flag flag-${zone.code.toLowerCase()}`"></span> <b>{{ zone.name }}</b>.
            <span v-if="zone.onSale()"><br />Listed on sale for {{ zone.sellPrice }} Ξ</span></p>
          </div>
          <!-- Menu -->
          <div class="ui two item menu">
            <a class="item" :class="{ 'active' : panel === 'sell' }"
               @click.prevent="switchPanel('sell')">
              <i class="fa fa-money"></i> Sell
            </a>
            <a class="item" :class="{ 'active' : panel === 'xfer' }"
               @click.prevent="switchPanel('xfer')">
              <i class="fa fa-exchange"></i> Transfer
            </a>
          </div>
          <!-- Sell panel -->
          <form v-if="panel === 'sell'" class="ui form">
            <div class="field">
              <label>Sell price</label>
              <div class="ui right labeled input">
                <input class="ui input" type="number" v-model="sellPrice" name="sellPrice" placeholder="Enter price" autocomplete="off">
                <div class="ui label">
                  Ξ
                </div>
              </div>
            </div>
            <!-- Sell actions -->
            <div v-if="!txWait" class="ui segment basic center aligned">
              <button class="ui green button"
                      :class="{ 'disabled': sellPrice <= 0 }"
                      @click.prevent="confirmSell()">
                <i class="fa fa-check"></i>
                Confirm
              </button>
            </div>
          </form>
          <!-- Xfer panel -->
          <form v-if="panel === 'xfer'" class="ui form">
            <div class="field">
              <label>Recipient address</label>
              <div class="ui input">
                <input class="ui input" type="text" v-model="xferAddress" name="xferAddress" placeholder="Enter recipient address">
              </div>
            </div>
            <!-- Xfer actions -->
            <div v-if="!txWait" class="ui segment basic center aligned">
              <button class="ui green button"
                      :class="{ 'disabled': !xferValid }"
                      @click.prevent="confirmXfer()">
                <i class="fa fa-check"></i>
                Confirm
              </button>
            </div>
          </form>
        </div>
        <!-- Buy Form -->
        <!-- -->
        <div v-if="!zone.isOwner() && zone.onSale()">
          <!-- Details -->
          <div class="ui segment basic center aligned" style="margin-bottom: 0em;">
              <h3 class="ui header">
                <i class="fa fa-tag"></i> {{ zone.getRequiredPrice() }} Ξ
              </h3>
          </div>
          <!-- MetaMask warning -->
          <div v-if="zoneNonBuyable" class="ui container yellow message center aligned">
            You need <b>MetaMask</b> unlocked to buy <span :class="`flag flag-${zone.code.toLowerCase()}`"></span> <b>{{ zone.name }}</b>
          </div>
          <!-- Actions -->
          <div v-if="!txWait" class="ui segment basic center aligned" style="margin-top: 0em;">
            <div v-if="!zoneNonBuyable" class="ui container" style="margin-bottom: 0.75em;">
              Become owner of <span :class="`flag flag-${zone.code.toLowerCase()}`"></span> 
              <b>{{ zone.name }}</b> for <b>{{ zone.getRequiredPrice() }}</b> Ξ ?
            </div>
            <button class="ui green button"
                    :class="{ 'disabled': zoneNonBuyable }"
                    @click.prevent="confirmBuy()">
              <i class="fa fa-check"></i>
              Confirm
            </button>
            <button class="ui basic button"
              @click.prevent="closeModal()">
              <i class="fa fa-times"></i>
              Cancel
            </button>
          </div>
        </div>
        <!-- Tx wait -->
        <div v-if="txWait" class="ui segment basic center aligned">
          <hr />
          <h2 class="ui header">
            <i class="fa fa-circle-o-notch fa-spin"></i> Waiting for MetaMask
          </h2>
          <h3 class="ui subheader">You can close this window when transaction has been submitted</h3>
        </div>
      </div>
  </modal>
</template>

<script>
import Zone from '@/api/Zone'
import * as notif from '@/api/notif'

export default {
  name: 'zoneModal',
  data () {
    return {
      panel: null,
      sellPrice: 0,
      xferAddress: '',
      zone: null,
      txWait: false
    }
  },
  computed: {
    contract () {
      return this.$store.getters.contract
    },
    currentAddress () {
      return this.$store.getters.currentAddress
    },
    currentPrice () {
      return this.zone.initialPrice()
    },
    zoneNonBuyable () {
      return (!window.web3.currentProvider.isMetaMask || !this.$store.getters.currentAddress)
    },
    xferValid () {
      return web3.utils.isAddress(this.xferAddress)
    }
  },
  methods: {
    switchPanel (panel) {
      if (this.panel === panel) this.panel = null
      else this.panel = panel
    },
    confirmBuy () {
      /* globals web3 */
      this.txWait = true
      const zoneId = this.zone.id
      let price = this.zone.getRequiredPrice()
      price = web3.utils.toWei(price.toString(), 'ether')
      return this.contract.methods.buyZone(zoneId)
        .send({ from: this.currentAddress, value: price })
        .then((res) => {
          let zone = Zone.getById(zoneId)
          zone.sellPrice = '0'
          zone.owner = this.currentAddress
          this.txWait = false
          notif.zoneBought(zone)
          this.closeModal()
        })
        .catch((err) => {
          if (err) {
            notif.transactionDenied(err.message)
            notif.transactionPending(err.message)
            this.txWait = false
            console.log(err.message)
          }
        })
    },
    confirmSell () {
      /* globals web3 */
      this.txWait = true
      const zoneId = this.zone.id
      let price = this.sellPrice
      let priceWei = web3.utils.toWei(price.toString(), 'ether')
      return this.contract.methods.sellZone(zoneId, priceWei)
        .send({ from: this.currentAddress })
        .then((res) => {
          let zone = Zone.getById(zoneId)
          zone.sellPrice = price
          this.txWait = false
          notif.zoneSell(zone, price)
          this.closeModal()
        })
        .catch((err) => {
          if (err) {
            notif.transactionDenied(err.message)
            notif.transactionPending(err.message)
            this.txWait = false
            console.log(err.message)
          }
        })
    },
    confirmXfer () {
      /* globals web3 */
      if (!this.xferValid) return false
      this.txWait = true
      const zoneId = this.zone.id
      return this.contract.methods.transferZone(zoneId, this.xferAddress)
        .send({ from: this.currentAddress })
        .then((res) => {
          let zone = Zone.getById(zoneId)
          zone.owner = this.xferAddress
          this.txWait = false
          notif.zoneXfer(zone, zone.owner)
          this.closeModal()
        })
        .catch((err) => {
          if (err) {
            notif.transactionDenied(err.message)
            notif.transactionPending(err.message)
            this.txWait = false
            console.log(err.message)
          }
        })
    },
    closeModal () {
      this.$modal.hide('zoneModal')
    },
    beforeOpen (event) {
      this.zone = event.params.zone
      if (this.zone.isOwner() && this.zone.onSale()) {
        this.sellPrice = this.zone.sellPrice
      }
    },
    closed (event) {
      this.zone = null
      this.txWait = false
      this.sellPrice = 0
      this.panel = null
      this.xferAddress = ''
    }
  },
  mounted () {
  }
}
</script>

<style scoped>
.zone-modal {
  padding: 1.5em;
}
.owner-message {
  background-color: rgba(252, 222, 156, 0.2);
  border-color: rgba(252, 222, 156, 1);
}
.owner-sale-message {
  background-color: rgba(255, 136, 17, 0.15);
  border-color: rgba(255, 136, 17, 0.75);
}
.owned-message {
  background-color: rgba(230, 57, 70, 0.15);
  border-color: rgba(230, 57, 70, 0.75);
}

a.item  {
  color: #222222 !important;
}
.active.item {
  background-color: #f3f3f3 !important;
}
</style>
