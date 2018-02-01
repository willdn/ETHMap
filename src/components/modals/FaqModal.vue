<template>
  <modal
    name="faqModal"
    height="auto"
    :scrollable="true"
    :adaptive="true">
      <div class="container faq-modal">
        <h2 class="ui header center aligned">
          <i class="fa fa-question"></i> 
          FAQ<br />
        </h2>
        <h3 class="ui header">
          How it works ?
        </h3>
        <p>
          ETHMap displays a world map with 178 countries (<i>zones</i>). Each zone is initially sold at a price related to its area.
          Once you own a zone, you will earn some Ether every time someone else buy it. The amount the new owner paid is splitted
          between all zone's owners, minus a small fee for ETHMap. Zone's price is then increased by 2.5%.
        </p>
        <p>
          ETHMap runs on the Ethereum blockchain. This imply you can read the <a href="">Smart Contract</a> that set above rules.
        </p>
        <h3 class="ui header">
          What do I need ?
        </h3>
        <p>
          You only need a browser to view the map. However, you will need <a target="_blank" href="https://metamask.io/">MetaMask</a> to buy zones.
        MetaMask is a browser (<i class="fa fa-chrome"></i> Chrome and <i class="fa fa-firefox"></i> Firefox) plugin that bridge the Ethereum blockchain 
        and is the easiest way to interact with Smart Contracts.
        </p>
      </div>
  </modal>
</template>

<script>

export default {
  name: 'faqModal',
  data () {
    return {
    }
  },
  computed: {
  },
  methods: {
  },
  mounted () {
  }
}
</script>

<style scoped>
.faq-modal {
  padding: 1.5em;
}
p {
  text-align: justify;
}
</style>
