<template>
  <modal
    name="zoneListModal"
    height="auto"
    @before-open="beforeOpen"
    @closed="closed"
    :scrollable="true"
    :adaptive="true">
      <div class="container zone-list">
        <h2 class="ui header center aligned">
          <i class="fa fa-globe"></i> 
          <a href="" class="ui sub header right floated" @click.prevent="closeModal()"><i class="fa fa-times"></i></a>
          Zone list
        </h2>
        <!-- <div class="ui container">
          <div class="ui transparent fluid right icon input">
            <i class="fa fa-search"></i>
            <input type="text" v-model="searchZone" placeholder="Search...">
          </div>
        </div> -->
        <div class="ui button compact basic" @click.prevent="sortByArea()">
          <i :class="`fa fa-sort-amount-${sortAreaType}`"></i>
          Area
        </div>
        <div class="ui button compact basic" @click.prevent="sortByPrice()">
          <i :class="`fa fa-sort-amount-${sortPriceType}`"></i>
          Price
        </div>
        <div class="ui button compact basic" @click.prevent="sortByName()">
          <i :class="`fa fa-sort-amount-${sortNameType}`"></i>
          Name
        </div>
        <!-- Zones -->
        <div class="ui link cards">
          <div v-if="zones" v-for="zone in zones" :key="zone.id" class="ui fluid raised card"
               :class="{ 
                 'zone-owner': zone.zoneKeyFill() === 'OWNER',
                 'zone-sale-owner': zone.zoneKeyFill() === 'OWNER_SALE',
                 'zone-available': zone.zoneKeyFill() === 'AVAILABLE',
                 'zone-not-available': zone.zoneKeyFill() === 'NOT_AVAILABLE'
                }"
               @click.prevent="zoneClicked(zone.id)">
            <div class="content">
              <div class="ui grid equal width">
                <div class="column">
                  <span v-if="zone.code" :class="`flag flag-${zone.code.toLowerCase()}`"></span>
                  <b>{{ zone.name }}</b>
                </div>
                <div class="column right aligned">
                  <span v-if="zone.hasOwner()"><i class="fa fa-user"></i> {{ zone.owner.substring(0, 10) }}...</span>
                </div>
                <div class="column right aligned">
                  <span v-if="zone.onSale()"><i class="fa fa-tag"></i> {{ zone.getRequiredPrice() }} Ξ</span>
                  <span v-if="!zone.onSale()"><i class="fa fa-times"></i> Not available</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  </modal>
</template>

<script>
import Zone from '@/api/Zone'
export default {
  name: 'zoneListModal',
  data () {
    return {
      zones: null,
      searchZone: '',
      sortNameType: 'desc',
      sortPriceType: 'asc',
      sortAreaType: 'desc'
    }
  },
  computed: {
  },
  methods: {
    zoneClicked (zoneId) {
      const zone = Zone.getById(zoneId)
      this.$modal.show('zoneModal', {
        zone: zone
      })
      this.closeModal()
    },
    closeModal () {
      this.$modal.hide('zoneListModal')
    },
    sortByName () {
      this.sortNameType = (this.sortNameType === 'desc') ? 'asc' : 'desc'
      this.zones = this.zones.sort((a, b) => {
        if (this.sortNameType === 'desc') return b.name.localeCompare(a.name)
        return a.name.localeCompare(b.name)
      })
    },
    sortByPrice () {
      this.sortPriceType = (this.sortPriceType === 'desc') ? 'asc' : 'desc'
      this.zones = this.zones.sort((a, b) => {
        if (this.sortPriceType === 'asc') return a.getRequiredPrice() - b.getRequiredPrice()
        return b.getRequiredPrice() - a.getRequiredPrice()
      })
    },
    sortByArea () {
      this.sortAreaType = (this.sortAreaType === 'desc') ? 'asc' : 'desc'
      this.zones = this.zones.sort((a, b) => {
        if (this.sortAreaType === 'asc') return a.id - b.id
        return b.id - a.id
      })
    },
    beforeOpen (event) {
      // Hack : if we use computed zones, map is displayed twice (why ?)
      this.zones = JSON.parse(JSON.stringify(this.$store.getters.zones))
      this.zones = this.zones
                      .map((zone) => {
                        return new Zone(zone)
                      })
                      .sort((a, b) => {
                        return b.id - a.id
                      })
    },
    closed (event) {
      this.zones = null
    }
  },
  mounted () {
  }
}
</script>

<style scoped>
.zone-list {
  padding: 1.5em;
}
.cards {
  margin-top: 0.5em;
  max-height: 512px;
  overflow-y: scroll;
}
.card {
  margin-bottom: 0.1em !important;
}
.zone-owner {
  background-color: rgba(252, 222, 156, 0.50) !important;
}
.zone-sale-owner {
  background-color: rgba(255, 136, 17, 0.3) !important;
}
.zone-available {
  background-color: rgba(168, 218, 220, 0.35) !important;
}
.zone-not-available {
  background-color: rgba(230, 57, 70, 0.2) !important;
}
</style>
