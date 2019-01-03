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
              ></v-select>
            </v-flex>
          </v-layout>
          <v-flex xs12>
            <v-card color="teal" class="white--text">
              <v-layout justify-center>
                <v-flex x12>
                  <v-card-title primary-title>
                    <div>
                      <div class="headline">Supermodel</div>
                      <div>Foster the People</div>
                      <div>(2014)</div>
                    </div>
                  </v-card-title>
                </v-flex>
              </v-layout>
            </v-card>
          </v-flex>
          <v-layout align-center justify-center fill-height pt-3 row>
            <v-flex x3>
              <v-card flat color="white">
                <div class="text-md-center">
                  <div class="font-weight-bold teal--text">Number of nodes</div>
                  <p> {{ nNodes }} </p>
                </div>
              </v-card>
            </v-flex>
            <v-flex x3>
              <v-card flat color="white">
                <div class="text-md-center">
                  <div class="font-weight-bold teal--text">Number of edges</div>
                  <p> {{ nEdges }} </p>
                </div>
              </v-card>
            </v-flex>
            <v-flex x3>
              <v-card flat color="white">
                <div class="text-md-center">
                  <div class="font-weight-bold teal--text">Connectance</div>
                  <p>{{ con }}</p>
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
        Taxons list
      </v-tab>
      <v-tab-item>
        <Taxons></Taxons>
      </v-tab-item>
      <v-tab ripple>
        Interactions list
      </v-tab>
      <v-tab-item>
        <v-card flat>
          <v-card-text>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit.
            Vitae, labore temporibus? Consectetur, blanditiis. Fugit, unde id dignissimos in sed corporis,
            velit necessitatibus optio quis provident aperiam reprehenderit voluptates ullam similique!
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab ripple>
        Citation
      </v-tab>
      <v-tab-item>
        <v-card flat>
          <v-card-text>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit.
            Vitae, labore temporibus? Consectetur, blanditiis. Fugit, unde id dignissimos in sed corporis,
            velit necessitatibus optio quis provident aperiam reprehenderit voluptates ullam similique!
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs>
  </div>
</template>

<script>
import _ from 'lodash'
import D3Network from 'vue-d3-network'
import Taxons from './Taxons'

export default {
  components: {
    D3Network,
    Taxons
  },
  data () {
    return {
      collection: [],
      nodes: [],
      links: [],
      nEdges: 0,
      nNodes: 0,
      con: 0,
      options:
      {
        force: 2000,
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
  conputed: {
    getIdNet () {
      return this.$store.state.selectNet
    }
  },
  methods: {
    getTaxons () {
      return this.$store.state.taxons
    },
    getInteractions () {
      return this.$store.state.interactions
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
    this.updateNetwork(this.$store.state.selectNet)
    this.$store.watch((newId) => {
      return this.$store.state.selectNet
    }, (newId) => {
      this.updateNetwork(newId)
    })
  }
}
</script>

<style>
.rounded-card{
  border-radius:50px;
}
</style>
