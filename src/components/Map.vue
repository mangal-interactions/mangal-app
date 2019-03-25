<template>
    <div id='mangalMap'></div>
</template>

<script>
import mapboxgl from 'mapbox-gl'
import _ from 'lodash'
import { mapGetters } from 'vuex'
import Popup from './Popup'
import Vue from 'vue'
import store from '../store'

export default {
  components: {
    Popup
  },
  methods: {
    updateNetworks (networks) {
      this.$store.dispatch('setNet', networks[0].id)
      this.$store.dispatch('setNetCollection', networks)
    },
    setNet (id) {
      this.$store.dispatch('setNet', id)
    },
    getNetworksAtLocation (group) {
      return this.getMapCollection[group]
    }
  },
  data () {
    return {
      networksAtLocation: null
    }
  },
  computed: {
    ...mapGetters([
      'getNetCollection',
      'getMapCollection'
    ])
  },
  mounted () {
    let vm = this
    // Init map
    mapboxgl.accessToken = 'pk.eyJ1Ijoic3RldmV2aXNzIiwiYSI6ImNpaG53N2RsczBwOTZ0dGx6c3JqdXBoYzMifQ.w3eEV_jVfAo7d46D1i55BA'
    // eslint-disable-next-line
    let map = new mapboxgl.Map({
      container: 'mangalMap', // container id
      style: 'mapbox://styles/mapbox/streets-v9', // stylesheet location
      zoom: 1 // starting zoom
    })

    map.addControl(new mapboxgl.NavigationControl(), 'top-left')

    map.on('click', function (e) {
      const features = map.queryRenderedFeatures(e.point, {
        layers: ['netPoints', 'netPolys']
      })

      vm.networksAtLocation = vm.getNetworksAtLocation(features[0].properties.group)
      vm.updateNetworks(vm.networksAtLocation)

      var popup = new Vue({
        ...Popup,
        store: store,
        propsData: {
          networksData: vm.networksAtLocation
        }
      }).$mount()

      popup.$on('updateNet', (id) => {
        console.log(id)
        vm.setNet(id)
      })

      // Populate the popup and set its coordinates
      // based on the feature found.
      // eslint-disable-next-line
      new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setDOMContent(popup.$el)
        .addTo(map)
    })

    this.$store.dispatch('loadNetworks').then(() => {
      this.$store.dispatch('loadNetworksCollection').then((mapCollection) => {
        // Add a layer showing the places.
        let features = _.values(mapCollection).map(netGroup => {
          return {
            type: 'Feature',
            properties: {
              group: netGroup[0].group
            },
            geometry: {
              type: netGroup[0].geom.type,
              coordinates: netGroup[0].geom.coordinates
            }
          }
        })
        map.on('load', function () {
          map.addSource('netLocations', {
            'type': 'geojson',
            'data': {
              'type': 'FeatureCollection',
              'features': features
            }
          })
          map.addLayer({
            'id': 'netPolys',
            'type': 'fill',
            'source': 'netLocations',
            'paint': {
              'fill-color': '#004e6b',
              'fill-opacity': 0.7
            },
            'filter': ['==', '$type', 'Polygon']
          })
          map.addLayer({
            'id': 'netPoints',
            'type': 'circle',
            'source': 'netLocations',
            'paint': {
              'circle-opacity': 0.8,
              'circle-stroke-width': 1,
              'circle-stroke-color': '#fff',
              'circle-color': '#004e6b'
            },
            'filter': ['==', '$type', 'Point']
          })
        })
      })
    }).then(() => {
      this.$store.dispatch('openStatePane', true)
    })
  }
}
</script>

<style>
#mangalMap {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
}
.mapboxgl-popup-content {
  max-height: 200px;
  overflow-y: auto;
}
</style>
