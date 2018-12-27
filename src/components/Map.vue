<template>
  <v-flex x12 fill-height>
    <div id="mangalMap"></div>
  </v-flex>
</template>

<script>
// import axios from 'axios'
import 'leaflet'
import 'leaflet.markercluster'
import _ from 'lodash'
const L = window.L

export default {
  methods: {
    getLayerNetworks () {
      let layerNet = L.featureGroup()
      // Compute unique location for remeasured sites
      let uqLoc = _
        .chain(this.$store.state.networks)
        .map('localisation')
        .uniqWith(_.isEqual)
        .value()

      for (let index = 0; index < uqLoc.length; index++) {
        const loc = uqLoc[index]
        let networks = _
          .chain(this.$store.state.networks)
          .find(function (obj) {
            return obj.localisation === loc
          })
          .value()
        console.log(networks)
      }
      this.$store.state.networks.forEach(network => {
        let feature = {
          type: 'Feature',
          properties: {
            name: network.name,
            id: network.id
          },
          geometry: {
            type: network.localisation.type,
            coordinates: network.localisation.coordinates
          }
        }
        // Add feature to the map
        L.geoJSON(feature)
          .bindPopup(
            '<h3 style="font-weight:bold;">' +
            feature.properties.name.split('_').join(' ').replace(/^\w/, c => c.toUpperCase()) +
            '</h3>' +
            '<b>Mangal ID: </b>' +
            feature.properties.id + '</br>'
          )
          .addTo(layerNet)
      })
      return layerNet
    },
    storeNetworkId (l) {
      let idNet = l.layer.feature.properties.id
      this.$store.dispatch('setSelectedNet', idNet)
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
    var baseLayers = {
      'Grayscale': grayscale,
      'Streets': streets,
      'Satellite': satellite,
      'Satellite and streets': satelliteStreet
    }
    L.control.layers(baseLayers).addTo(mangalMap)
    streets.addTo(mangalMap)
    this.$store.dispatch('loadNetworks').then(() => {
      let layerNet = this.getLayerNetworks()
      layerNet.addTo(mangalMap)
      mangalMap.fitBounds(layerNet.getBounds())
      layerNet.on('click', this.storeNetworkId)
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
