<template>
  <div>
    <loader v-if="!mapLoaded" />
    <div id="map"></div>
  </div>
</template>

<script>
import Loader from '@/components/Loader'

import Datamap from 'datamaps'
import d3 from 'd3'
import Zone from '@/api/Zone'

export default {
  name: 'main',
  components: {
    Loader
  },
  data () {
    return {
      mapLoaded: false,
      selectedZone: null,
      zonesListID: []
    }
  },
  watch: {
    zones (zones) {
      if (zones.length === 178) {
        this.getZonesListId()
      }
    },
    zonesListID (zones) {
      if (zones.length === 178) {
        this.createMap()
      }
    }
  },
  computed: {
    contract () {
      return this.$store.getters.contract
    },
    zones () {
      return this.$store.getters.zones
    },
    zonesBought () {
      return this.zones.filter(z => z.isBought())
    }
  },
  methods: {
    selectZone (zoneId) {
      const zone = Zone.getById(zoneId)
      this.selectedZone = zone
      this.$modal.show('zoneModal', {
        zone: zone
      })
    },
    fillColor () {
      let color = {}
      this.zonesListID.forEach((z, index) => {
        const zone = Zone.getById(index + 1)
        color[z] = { fillKey: zone.zoneKeyFill() }
      })
      return color
    },
    createMap () {
      let that = this
      let colors = that.fillColor()
      /* eslint-disable no-new */
      let map = new Datamap({
        element: document.getElementById('map'),
        scope: 'world',
        responsive: true,
        geographyConfig: {
          dataUrl: './static/data/world.topo.json',
          hideAntarctica: false,
          highlightFillColor: '#D3D3D3',
          highlightBorderColor: '#FFFFFF',
          popupTemplate (geography, data) {
            const zone = Zone.getById(geography.properties.id)
            const price = zone.getRequiredPrice()
            let hoverInfo = ''
            switch (zone.zoneKeyFill()) {
              case 'AVAILABLE': hoverInfo = `<i class="fa fa-tag"></i> Price: ${price} Ξ`; break
              case 'NOT_AVAILABLE': hoverInfo = `<i class="fa fa-times"></i> Not available`; break
              case 'OWNER_SALE': hoverInfo = `<i class="fa fa-money"></i> On sale for ${price} Ξ`; break
              case 'OWNER': hoverInfo = `<i class="fa fa-user"></i> You own this zone`; break
            }
            return `<div class="hoverinfo"><b><span class="flag flag-${zone.code.toLowerCase()}"></span>
                                              ${geography.properties.name}</b><br />
                                              ${hoverInfo}<br /></div>`
          }
        },
        fills: {
          defaultFill: '#D3D3D3',
          'AVAILABLE': '#A8DADC',
          'NOT_AVAILABLE': 'rgba(230, 57, 70, 0.5)',
          'OWNER': '#FCDE9C',
          'OWNER_SALE': 'rgba(255, 136, 17, 0.5)'
        },
        data: colors,
        setProjection (element) {
          let projection = d3.geo.equirectangular()
            .scale((element.offsetWidth / 640) * 100)
            .translate([element.offsetWidth / 2, element.offsetHeight / 2 - 50])

          var path = d3.geo.path().projection(projection)
          return { path: path, projection: projection }
        },
        done (datamap) {
          that.mapLoaded = true
          datamap.svg.call(d3.behavior.zoom().on('zoom', redraw))
          function redraw () {
            // Scale
            datamap.svg.selectAll('g')
              .attr('transform', 'translate(' + d3.event.translate + ')scale(' + d3.event.scale + ')')
          }
          datamap.svg.selectAll('.datamaps-subunit')
            .on('click', (geography) => {
              that.selectZone(geography.properties.id)
            })
        }
      })
      d3.select(window).on('resize', () => {
        map.resize()
      })
      setInterval(() => {
        map.updateChoropleth(this.fillColor())
      }, 5000)
    },
    getZonesListId () {
      let world = require('../../static/data/world.topo.json')
      let zones = world.objects.world.geometries
      this.zonesListID = zones.map((c) => {
        let zone = Zone.getById(c.properties.id)
        zone.code = c.id
        zone.name = c.properties.name
        return c.id
      })
    }
  },
  mounted () {
  }
}
</script>

<style scoped>
#map {
  background-color: #FFF;
  width: 100%;
  height: 100%;
}

.hoverinfo {
  position: absolute;
  text-align: center;
  width: 150px;
  height: 25px;
  padding: 2px;
  font-size: 10px;
  background: #FFFFE0;
  color: rgba(255, 136, 17, 0.75) !important;
  border: 1px;
  border-radius: 8px;
  pointer-events: none;
} 
</style>
