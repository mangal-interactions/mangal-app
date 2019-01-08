<template>
  <div>
    <v-tabs
      slot="extension"
      centered
      color="white"
      slider-color="teal">
      <v-tab ripple>
        Network
      </v-tab>
      <v-tab-item>
        <v-container pa-0>
          <v-layout row wrap fill-height align-center>
            <v-flex x4>
              <h3 class="text-xs-center">Select network</h3>
            </v-flex>
            <v-flex x6 d-flex pl-3 pr-3>
              <v-select
                color="teal"
                v-model="selectNet"
                :items="$store.state.netCollection"
                item-text="name" item-value="name" return-object
              ></v-select>
            </v-flex>
          </v-layout>
          <v-card color="teal" class="white--text">
            <v-layout justify-center>
              <v-flex x12 pa-2 class="text-md-center">
                <div class="subheading font-weight-bold">{{ selectNet.name }}</div>
                <div>Mangal network ID {{ selectNet.id }}</div>
                <div><v-icon small color="white">fas fa-info-circle</v-icon> {{ selectNet.description }}</div>
                <v-chip small v-if="selectNet.public" color="primary" text-color="white">Public</v-chip>
                <v-chip small v-else color="orange" text-color="white">Private</v-chip>
                <v-chip small v-if="!selectNet.all_interactions" color="red" text-color="white">Unrecorded absences</v-chip>
                <v-chip small v-else color="green" text-color="white">Recorded abscences</v-chip>
              </v-flex>
            </v-layout>
          </v-card>
          <v-layout align-center justify-center fill-height pt-3 row>
            <v-flex x3>
              <v-card flat color="white">
                <div class="text-md-center">
                  <div class="body-2 font-weight-bold teal--text">Number of taxons</div>
                  <p class="body-2"> {{ nNodes }} </p>
                </div>
              </v-card>
            </v-flex>
            <v-flex x3>
              <v-card flat color="white">
                <div class="text-md-center">
                  <div class="body-2 font-weight-bold teal--text">Number of interactions</div>
                  <p class="body-2"> {{ nEdges }} </p>
                </div>
              </v-card>
            </v-flex>
            <v-flex x3>
              <v-card flat color="white">
                <div class="text-md-center">
                  <div class="body-2 font-weight-bold teal--text">Connectance</div>
                  <p class="body-2">{{ con }}</p>
                </div>
              </v-card>
            </v-flex>
            <v-flex x3>
              <v-btn outline fab dark color="teal">
                <v-icon dark>fas fa-download</v-icon>
              </v-btn>
            </v-flex>
          </v-layout>
          <v-flex x12 v-if="$store.state.selectNet">
            <v-card flat>
              <v-card-text>
                <d3-network :net-nodes="nodes" :net-links="links" :options="options"></d3-network>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-container>
      </v-tab-item>
      <v-tab ripple>
        Interactions list
      </v-tab>
      <v-tab-item>
        <Interactions></Interactions>
      </v-tab-item>
      <v-tab ripple>
        Dataset
      </v-tab>
      <v-tab-item>
        <Dataset></Dataset>
      </v-tab-item>
    </v-tabs>
  </div>
</template>

<script>
import _ from 'lodash'
import D3Network from 'vue-d3-network'
import Interactions from './Interactions'
import Dataset from './Dataset'

export default {
  components: {
    D3Network,
    Interactions,
    Dataset
  },
  data () {
    return {
      selectNet: this.getNetCollection()[0],
      nodes: [],
      links: [],
      nEdges: 0,
      nNodes: 0,
      con: 0,
      options:
      {
        force: 1000,
        nodeSize: 12,
        nodeLabels: true,
        linkWidth: 4,
        fontSize: 11,
        size: {
          h: 340
        }
      }
    }
  },
  watch: {
    selectNet: function (newNet) {
      this.selectNet = newNet
      this.updateNetwork(newNet.id)
      this.$store.dispatch('loadDataset', newNet.dataset_id).then(() => {
        // Update ref
        this.$store.dispatch('loadRef', this.$store.state.dataset.ref_id)
      })
    }
  },
  methods: {
    getTaxons () {
      return this.$store.state.taxons
    },
    getInteractions () {
      return this.$store.state.interactions
    },
    getNetCollection () {
      return this.$store.state.netCollection
    },
    resetValues () {
      this.nodes = []
      this.links = []
      this.nEdges = 0
      this.nNodes = 0
      this.con = 0
    },
    updateNetwork (idNet) {
      this.$store.dispatch('loadTaxons', idNet).then(() => {
        this.resetValues()
        let taxons = this.getTaxons()
        this.getTaxons().forEach(taxa => {
          this.nodes.push({
            id: taxa.id,
            name: taxa.original_name,
            _color: 'teal'
          })
        })
        return _.map(taxons, 'id')
      }).then((taxaIds) => {
        this.$store.dispatch('loadInteractions', taxaIds).then(() => {
          this.getInteractions().forEach(interac => {
            this.links.push({
              id: interac.id,
              sid: interac.taxon_1,
              tid: interac.taxon_2,
              _color: '#0080804a'
            })
          })
        }).then(() => {
          this.nEdges = this.links.length
          this.con = (this.nEdges / (this.nodes.length ** 2)).toFixed(2)
        })
          .catch((err) => {
            return err
          })
      }).then(() => {
        this.nNodes = this.nodes.length
      })
    }
  },
  mounted () {
    // init value on mounted
    this.updateNetwork(this.$store.state.selectNet)
    this.$store.dispatch('loadDataset', this.getNetCollection()[0].dataset_id).then(() => {
      // Update ref
      this.$store.dispatch('loadRef', this.$store.state.dataset.ref_id)
    })
    // Passed the new selectNet on marker click event by watching the store
    this.$store.watch((newId) => {
      return this.$store.state.selectNet
    }, (newId) => {
      this.selectNet = this.getNetCollection()[0]
    })
  }
}
</script>

<style>
.rounded-card{
  border-radius:50px;
}
</style>
