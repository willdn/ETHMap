<template>
  <div class="container">
    <img :src="require('@/assets/loader.svg')" />
  </div>
</template>

<script>
export default {
  name: 'loader',
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
.container {
  position: absolute;
  width: 150px;
  height: 150px;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
}
</style>
