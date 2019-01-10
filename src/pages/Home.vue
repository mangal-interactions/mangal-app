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
    <v-dialog
      v-model="$store.state.loading"
      hide-overlay
      persistent
      width="400"
      style="z-index:9999"
    >
      <v-card
        color="teal"
        dark
      >
        <v-card-text>
          Data fetching...
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
    <Navig></Navig>
    <v-content>
      <v-container class="pa-0" fluid fill-height>
        <MapMangal></MapMangal>
      </v-container>
    </v-content>
  </v-app>
</template>
