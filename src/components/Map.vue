<template>
  <v-flex x12 fluid fill-height>
    <l-map :bounds="bounds">
      <l-tilelayer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"></l-tilelayer>
          <l-marker v-for="item in markers" :key="item.id" :lat-lng="item.latlng" @l-add="$event.target.openPopup()">
          <l-popup :content="item.name"></l-popup> -->
        </l-marker>
    </l-map>
  </v-flex>
</template>

<script>
import axios from 'axios'
import { L } from 'vue2-leaflet'

export default {

  data () {
    return {
      bounds: L.latLngBounds([
        [
          -173.671875,
          -25.16517336866393
        ],
        [
          185.625,
          -31.353636941500987
        ],
        [
          183.515625,
          73.42842364106816
        ],
        [
          -173.671875,
          73.42842364106816
        ],
        [
          -173.671875,
          -25.16517336866393
        ]
      ]),
      url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      markers: [],
      networks: []
    }
  },
  mounted () {
    axios.get(process.env.BASE_URL + '/network?page=0')
      .then(response => {
        // store page 0
        this.networks.push.apply(this.networks, response.data)
        // Check number of pages
        let range = response.headers['content-range'].match(/\d+/g).map(Number)
        let nPages = Math.ceil(range[2] / range[1]) - 1

        if (nPages > 0) {
          let requests = []
          for (let i = 1; i <= nPages; i++) {
            requests.push(axios.get(process.env.BASE_URL + '/network?page=' + i))
          }
          Promise.all(requests)
            .then(responses => responses.forEach(
              response => {
                this.networks.push.apply(this.networks, response.data)
              }
            ))
        }
      }).then(() => {
        // prep markers
        this.networks.forEach(
          network => {
            if (network.localisation.type === 'Point' && network.localisation.coordinates[0] && network.localisation.coordinates[1]) {
              this.markers.push({ id: network.id, latlng: L.latLng(network.localisation.coordinates), name: network.name })
            }
          }
        )
        this.$log.info(this.markers.getBounds())
      })
  }
}
</script>
