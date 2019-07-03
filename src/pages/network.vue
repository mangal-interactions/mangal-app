<script>
import MapMangal from '../components/Map'
import Navig from '../components/Nav'

export default {
  components: {
    Navig,
    MapMangal
  }
}
</script>

<template>
  <v-app>
    <Navig></Navig>
    <v-content>
      <v-container class="pa-0" fluid fill-height>
        <MapMangal></MapMangal>
      </v-container>
    </v-content>
  </v-app>
</template>
