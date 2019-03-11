<template>
  <div>
    <v-container class="text-md-left">
        <div class="title teal--text pt-4">Taxon resolved <span class="caption">(Beta)</span></div>
        <v-divider class="pb-4"></v-divider>
        <div>
        <v-layout row wrap>
          <v-flex xs3 text-xs-center>
            <div class="font-weight-bold body-2">ITIS</div>
          </v-flex>
          <v-flex xs3 text-xs-center>
            <div class="font-weight-bold body-2">BOLD</div>
          </v-flex>
          <v-flex xs3 text-xs-center>
            <div class="font-weight-bold body-2">EOL</div>
          </v-flex>
          <v-flex xs3 text-xs-center>
            <div class="font-weight-bold body-2">NCBI</div>
          </v-flex>
          <v-flex xs3 text-xs-center>
            <v-progress-circular
              :rotate="360"
              :size="100"
              :width="15"
              :value="percentTSN"
              color="teal"
            >
              {{ percentTSN }}
            </v-progress-circular>
          </v-flex>
          <v-flex xs3 text-xs-center>
            <v-progress-circular
              :rotate="360"
              :size="100"
              :width="15"
              :value="percentBOLD"
              color="orange"
            >
              {{ percentBOLD }}
            </v-progress-circular>
          </v-flex>
          <v-flex xs3 text-xs-center>
            <v-progress-circular
              :rotate="360"
              :size="100"
              :width="15"
              :value="percentEOL"
              color="red"
            >
              {{ percentEOL }}
            </v-progress-circular>
          </v-flex>
          <v-flex xs3 text-xs-center>
            <v-progress-circular
              :rotate="360"
              :size="100"
              :width="15"
              :value="percentNCBI"
              color="primary"
            >
              {{ percentNCBI }}
            </v-progress-circular>
          </v-flex>
        </v-layout>
      </div>
      <div class="title teal--text pt-5">Traits available</div>
      <v-divider class="pb-10"></v-divider>
    </v-container>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import _ from 'lodash'

export default {
  computed: {
    ...mapGetters([
      'getTaxons'
    ]),
    percentTSN: function () {
      let v = _.map(this.getTaxons, function (taxa) {
        if (_.has(taxa, 'taxonomy.tsn')) {
          if (taxa.taxonomy.tsn !== null) {
            return true
          } else {
            return false
          }
        } else {
          return false
        }
      })
      return (_.filter(v, (o) => { if (o) return o }).length / this.getTaxons.length * 100).toFixed(1)
    },
    percentNCBI: function () {
      let v = _.map(this.getTaxons, function (taxa) {
        if (_.has(taxa, 'taxonomy.ncbi')) {
          if (taxa.taxonomy.ncbi !== null) {
            return true
          } else {
            return false
          }
        } else {
          return false
        }
      })
      return (_.filter(v, (o) => { if (o) return o }).length / this.getTaxons.length * 100).toFixed(1)
    },
    percentBOLD: function () {
      let v = _.map(this.getTaxons, function (taxa) {
        if (_.has(taxa, 'taxonomy.bold')) {
          if (taxa.taxonomy.bold !== null) {
            return true
          } else {
            return false
          }
        } else {
          return false
        }
      })
      return (_.filter(v, (o) => { if (o) return o }).length / this.getTaxons.length * 100).toFixed(1)
    },
    percentEOL: function () {
      let v = _.map(this.getTaxons, function (taxa) {
        if (_.has(taxa, 'taxonomy.eol')) {
          if (taxa.taxonomy.eol !== null) {
            return true
          } else {
            return false
          }
        } else {
          return false
        }
      })
      return (_.filter(v, (o) => { if (o) return o }).length / this.getTaxons.length * 100).toFixed(1)
    }
  }
}
</script>
