<template>
  <v-flex x12 fill-height>
    <div id="mangalMap"></div>
  </v-flex>
</template>

<script>
// import axios from 'axios'
import 'leaflet'
import 'leaflet.markercluster'
const L = window.L

export default {
  methods: {
    getMapCollection () {
      return Object.values(this.$store.state.mapCollection)
    },
    setLayerNetworks () {
      let layerNet = L.featureGroup()
      this.getMapCollection().forEach(netGroup => {
        let records = netGroup.map(
          function (net) {
            return {
              ...net
            }
          }
        )
        let feature = {
          type: 'Feature',
          properties: {
            measurements: records
          },
          geometry: {
            type: netGroup[0].localisation.type,
            coordinates: netGroup[0].localisation.coordinates
          }
        }
        let popup = '<h3>List of networks</h3>'
        feature.properties.measurements.forEach((meas) => {
          popup = popup.concat('<div>', meas.name, ' - ', new Date(meas.date).getFullYear(), '</div>')
        })

        // Add feature to the map
        L.geoJSON(feature)
          .bindPopup(popup)
          .addTo(layerNet)
          .openPopup()
      })
      return layerNet
    },
    storeNetworks (l) {
      let idNet = l.layer.feature.properties.measurements[0].id
      let netCollection = l.layer.feature.properties.measurements
      this.$store.dispatch('setNet', idNet)
      this.$store.dispatch('setNetCollection', netCollection)
    }
  },
  mounted () {
    // Init map
    let mangalMap = L.map('mangalMap').setView([0, 0], 0)
    let mbAttr = 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
        '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
    let mbUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoic3RldmV2aXNzIiwiYSI6ImNpaG53N2RsczBwOTZ0dGx6c3JqdXBoYzMifQ.w3eEV_jVfAo7d46D1i55BA'
    let grayscale = L.tileLayer(mbUrl, {id: 'mapbox.light', attribution: mbAttr})
    let streets = L.tileLayer(mbUrl, {id: 'mapbox.streets', attribution: mbAttr})
    let satellite = L.tileLayer(mbUrl, {id: 'mapbox.satellite', attribution: mbAttr})
    let satelliteStreet = L.tileLayer(mbUrl, {id: 'mapbox.streets-satellite', attribution: mbAttr})
    let baseLayers = {
      'Grayscale': grayscale,
      'Streets': streets,
      'Satellite': satellite,
      'Satellite and streets': satelliteStreet
    }
    L.control.layers(baseLayers).addTo(mangalMap)
    streets.addTo(mangalMap)
    this.$store.dispatch('loadNetworks').then(() => {
      return this.$store.dispatch('loadNetworksCollection')
    }).then(() => {
      let layerNet = this.setLayerNetworks()
      layerNet.addTo(mangalMap)
      mangalMap.fitBounds(layerNet.getBounds())
      layerNet.on('click', this.storeNetworks)
    }).then(() => {
      this.$store.dispatch('openStatePane', true)
      this.$store.dispatch('setLoading', false)
    })
  }
}
</script>

<style>
#mangalMap {
  padding: 0;
  height: 100%;
}
</style>
