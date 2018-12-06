<template>
<div style="height:100vh">
  <l-map :zoom=13 :center="[47.413220, -1.219482]">
    <l-tilelayer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"></l-tilelayer>
    <l-marker :lat-lng="[47.413220, -1.219482]"></l-marker>
  </l-map>
</div>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      markers: []
    }
  },
  mounted () {
    let apiServer = 'http://' + process.env.API_SERVER + process.env.BASE_URL
    axios.get(apiServer + '/network')
      .then(response => (this.markers = response.data))
  }

}
</script>
