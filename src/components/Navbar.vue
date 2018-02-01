<template>
  <div class="ui menu top-header">
      <router-link :to="{ name: 'Main'}" class="header item icon-hover">
        <img class="ui image" :src="require('@/assets/icon.png')" />
        ETHMap
      </router-link>
      <div class="right menu">
        <a class="item" href=""
            @click.prevent="openZoneListModal()">
          <i class="fa fa-globe"></i>
        </a>
        <a class="item" href=""
           @click.prevent="openFaqModal()">
          <i class="fa fa-question"></i> FAQ
        </a>
        <a href="" class="item"
           @click.prevent="openAccountModal()">
          <i class="fa fa-user"></i>
          <span v-if="currentAddress">{{ currentAddress.substring(0, 12) }}...</span>
          <span v-if="!currentAddress">Sign In</span>
        </a>
      </div>
  </div>
</template>

<script>

export default {
  name: 'navbar',
  data () {
    return {
    }
  },
  computed: {
    currentAddress () {
      return this.$store.getters.currentAddress
    }
  },
  methods: {
    openAccountModal () {
      this.$modal.show('accountModal')
    },
    openFaqModal () {
      this.$modal.show('faqModal')
    },
    openZoneListModal () {
      this.$modal.show('zoneListModal')
    }
  },
  mounted () {
  }
}
</script>

<style scoped>
.top-header {
  border-radius: 0em !important;
  background-color: rgba(230, 57, 70, 0.75) !important;
  margin-bottom: 0em !important;
}
.item {
  border-radius: 0em !important;
  color: rgba(255, 255 ,255, 1)!important;
}
a:hover {
  background-color: rgba(255, 255 ,255, 1)!important;
  color: rgba(230, 57, 70, 0.9) !important;
}
.icon-hover:hover {
  background-color: rgba(230, 57, 70, 0.75) !important;
  color: rgba(255, 255 ,255, 1) !important;
}

</style>
