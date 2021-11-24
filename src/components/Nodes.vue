<template>
  <div>
    <v-container class="text-md-left">
      <div class="title teal--text">Traits available</div>
      <v-divider class="pb-10"></v-divider>
      <v-flex xs12 pt-3>
        <v-alert :value="true">
          <div class="font-italic">Coming soon...</div>
        </v-alert>
      </v-flex>
      <div class="title teal--text pt-4">External IDs</div>
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
              {{ percentTSN }}%
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
              {{ percentBOLD }}%
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
              {{ percentEOL }}%
            </v-progress-circular>
          </v-flex>
          <v-flex xs3 text-xs-center>
            <v-progress-circular
              :rotate="360"
              :size="100"
              :width="15"
              :value="percentNCBI"
              color="pink darken-1"
            >
              {{ percentNCBI }}%
            </v-progress-circular>
          </v-flex>
          <v-flex xs3 text-xs-center offset-xs3 pt-2>
            <div class="font-weight-bold body-2">COL</div>
          </v-flex>
          <v-flex xs3 text-xs-center pt-2>
            <div class="font-weight-bold body-2">GBIF</div>
          </v-flex>
          <v-flex xs3 text-xs-center offset-xs3>
            <v-progress-circular
              :rotate="360"
              :size="100"
              :width="15"
              :value="percentCOL"
              color="cyan darken-1"
            >
              {{ percentCOL }}%
            </v-progress-circular>
          </v-flex>
          <v-flex xs3 text-xs-center>
            <v-progress-circular
              :rotate="360"
              :size="100"
              :width="15"
              :value="percentGBIF"
              color="lime"
            >
              {{ percentGBIF }}%
            </v-progress-circular>
          </v-flex>
          <v-flex xs12 text-xs-center pt-3>
            <div class="body-2 pb-3 font-italic">
              Percent of IDs coverage from external sources for nodes of this
              network
            </div>
          </v-flex>
        </v-layout>
      </div>
    </v-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import _ from "lodash";

export default {
  methods: {
    coverTaxo: function(infra) {
      let v = [];

      if (this.getTaxons) {
        this.getTaxons.forEach(node => {
          if (_.has(node, "taxonomy." + infra)) {
            node.taxonomy[infra] === null ? v.push(false) : v.push(true);
          } else {
            v.push(false);
          }
        });
        return v.length > 0 ? _.round((_.sum(v) / v.length) * 100, 1) : 0;
      }
      return 0;
    }
  },
  computed: {
    ...mapGetters(["getTaxons"]),
    percentTSN: function() {
      return this.coverTaxo("tsn");
    },
    percentNCBI: function() {
      return this.coverTaxo("ncbi");
    },
    percentBOLD: function() {
      return this.coverTaxo("bold");
    },
    percentEOL: function() {
      return this.coverTaxo("eol");
    },
    percentCOL: function() {
      return this.coverTaxo("col");
    },
    percentGBIF: function() {
      return this.coverTaxo("gbif");
    }
  }
};
</script>
