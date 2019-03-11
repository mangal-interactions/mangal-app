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
        <v-container pa-0 pt-2>
          <v-card color="primary" class="white--text">
            <v-layout justify-center>
              <v-flex x12 pa-2 class="text-md-center">
                <div class="subheading font-weight-bold">{{ selectNet.description }}</div>
                <div> <v-icon small color="white">fas fa-info-circle</v-icon> Mangal network ID #{{ selectNet.id }}, measurement date: {{ selectNet.date | moment }}</div>
                <v-chip small v-if="selectNet.public" color="teal" text-color="white">Public</v-chip>
                <v-chip small v-else color="orange" text-color="white">Private</v-chip>
                <v-chip small v-if="!selectNet.all_interactions" color="red" text-color="white">Unrecorded absences</v-chip>
                <v-chip small v-else color="green" text-color="white">Recorded absences</v-chip>
              </v-flex>
            </v-layout>
          </v-card>
          <v-layout align-center justify-center fill-height pt-3 row>
            <v-flex x3>
              <v-card flat color="white">
                <div class="text-md-center">
                  <div class="body-2 font-weight-bold primary--text">Number of nodes</div>
                  <p class="body-2" style="color:#2c3e50"> {{ nNodes }} </p>
                </div>
              </v-card>
            </v-flex>
            <v-flex x3>
              <v-card flat color="white">
                <div class="text-md-center">
                  <div class="body-2 font-weight-bold primary--text">Number of interactions</div>
                  <p class="body-2" style="color:#2c3e50"> {{ nEdges }} </p>
                </div>
              </v-card>
            </v-flex>
            <v-flex x3>
              <v-card flat color="white">
                <div class="text-md-center">
                  <div class="body-2 font-weight-bold primary--text">Connectance</div>
                  <p class="body-2" style="color:#2c3e50">{{ con }}</p>
                </div>
              </v-card>
            </v-flex>
            <v-flex x3>
              <v-btn outline fab dark color="primary">
                <v-icon dark>fas fa-download</v-icon>
              </v-btn>
            </v-flex>
          </v-layout>
          <v-flex x12 text-xs-center align-end>
            <v-card v-if="getLoading.state" flat>
              <v-card-text class="text-xs-center">
                <v-progress-circular
                  style="padding-top:10rem"
                  indeterminate
                  color="primary"
                  :size="70"
                  :width="7"
                ></v-progress-circular>
                <p>{{ getLoading.message }}</p>
              </v-card-text>
            </v-card>
            <v-card height='100%' v-else flat>
              <v-card-text>
                <span v-if="getLoading.render">
                  <d3-network :net-nodes="nodes" :net-links="links" :options="options"></d3-network>
                </span>
                <span v-else>
                  <p color="primary" class="font-italic" style="padding-top:10rem"> Network not rendering (more than 200 nodes) </p>
                </span>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-container>
      </v-tab-item>
      <v-tab ripple>
        Node properties
      </v-tab>
      <v-tab-item>
        <Nodes></Nodes>
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
import Nodes from './Nodes'
import moment from 'moment'

export default {
  components: {
    D3Network,
    Interactions,
    Dataset,
    Nodes
  },
  data () {
    return {
      selectNet: this.getNetCollection()[0],
      ref: this.getRef(),
      nodes: [],
      links: [],
      nEdges: 0,
      nNodes: 0,
      loading: {
        state: true,
        render: true,
        message: null
      },
      con: 0,
      options:
      {
        force: 1500,
        nodeSize: 14,
        nodeLabels: true,
        linkWidth: 3,
        fontSize: 11
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
  filters: {
    moment: function (date) {
      return moment(date).format('YYYY-MM-DD')
    }
  },
  computed: {
    getLoading: function () {
      return this.loading
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
    getRef () {
      return this.$store.state.ref
    },
    resetValues () {
      this.nodes = []
      this.links = []
      this.nEdges = 0
      this.nNodes = 0
      this.con = 0
    },
    updateNetwork (idNet) {
      this.loading = {
        state: true,
        render: true,
        message: 'Fetching nodes...'
      }
      this.resetValues()
      this.$store.dispatch('loadTaxons', idNet).then(() => {
        let taxons = this.getTaxons()
        if (taxons.length < 200) {
          taxons.forEach(taxa => {
            this.nodes.push({
              id: taxa.id,
              name: taxa.taxonomy ? taxa.taxonomy.name : taxa.original_name,
              _color: '#004e6b'
            })
          })
        } else {
          this.loading.render = false
        }
        return _.map(taxons, 'id')
      }).then((taxaIds) => {
        this.loading.message = 'Fetching interactions...'
        this.$store.dispatch('loadInteractions', taxaIds).then(() => {
          this.loading.state = false
          if (this.loading.render) {
            this.getInteractions().forEach(interac => {
              this.links.push({
                id: interac.id,
                sid: interac.node_from,
                tid: interac.node_to,
                _color: '#004e6b4a'
              })
            })
          }
        }).then(() => {
          this.nEdges = this.getInteractions().length
          this.con = (this.nEdges / (this.getTaxons().length ** 2)).toFixed(2)
        })
          .catch((err) => {
            return err
          })
      }).then(() => {
        this.nNodes = this.getTaxons().length
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
      this.selectNet = _.find(this.getNetCollection(), {id: newId})
    })
  }
}
</script>

<style>
.rounded-card{
  border-radius:50px;
}
.v-card__text {
    padding: 16px;
    width: 100%;
}
svg:not(:root) {
  height: 55vh;
}
</style>
