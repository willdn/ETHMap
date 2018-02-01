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
          What is ETHMap ?
        </h3>
        <p>
          ETHMap is a Decentralized Application (ÐApp) running on Ethereum blockchain. This means ETHMap don't use a regular database to store
          the owner of each zone. Instead, zone ownership is recorded on the Ethereum blockchain and thus, cannot be tampered by anyone.
        </p>
        <p>
          You can have a look at the <a target="_blank" href="https://etherscan.io/address/0xb6bbf89c3dbba20cb4d5cabaa4a386acbbab455e">Smart Contract</a>.
        </p>
        <h3 class="ui header">
          How it works ?
        </h3>
        <p>
          ETHMap displays a world map with 178 countries (<i>"zone"</i>). Each zone is initially sold at a price related to its area.
          If the zone is available, you can purchase it at the price fixed by the current zone owner. You are now the new owner of this zone !
        </p>
        <p>
          Once you own a zone, you may sell it for a price of your own choosing. Your zone is then on sale and can be bought by anyone willing
          to pay the amount you fixed. You will be credited of the amount (minus 2% fee for ETHMap) and the buyer is now the new owner of this zone.
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
