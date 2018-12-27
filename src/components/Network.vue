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
        <v-layout row pa-12 fill-height v-if="!$store.state.selectNet">
          <v-flex x12>
            <v-alert
              :value="true"
              type="warning"
              color="teal"
            >
              Select one network on the map
            </v-alert>
          </v-flex>
        </v-layout>
        <v-container>
          <v-layout row wrap align-center>
            <v-flex xs4>
              <p class="text-uppercase">Select year</p>
            </v-flex>
            <v-flex x6 d-flex pl-3 pr-3>
              <v-select
                color="teal"
                :items="items"
              ></v-select>
            </v-flex>
          </v-layout>
          <v-layout align-center justify-center fill-height pt-3 row>
            <v-flex x4>
              <v-card flat color="white" class="teal--text">
                <div class="text-md-center">
                  <div class="text-uppercase">Number of nodes</div>
                  <p> {{ nNodes }} </p>
                </div>
              </v-card>
            </v-flex>
            <v-flex x4>
              <v-card flat color="white" class="teal--text">
                <div class="text-md-center">
                  <div class="text-uppercase">Number of edges</div>
                  <p> {{ nEdges }} </p>
                </div>
              </v-card>
            </v-flex>
            <v-flex x4>
              <v-card flat color="white" class="teal--text">
                <div class="text-md-center">
                  <div class="text-uppercase">Connectance</div>
                  <p>{{ con }}</p>
                </div>
              </v-card>
            </v-flex>
          </v-layout>
          <v-flex x12>
            <v-card flat>
              <v-card-text>
                <d3-network :net-nodes="nodes" :net-links="links" :options="options"></d3-network>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-container>
      </v-tab-item>
      <v-tab ripple>
        Nodes list
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
        Edges list
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

export default {
  components: {
    D3Network
  },
  data () {
    return {
      nodes: [],
      links: [],
      nEdges: 0,
      nNodes: 0,
      con: 0,
      options:
      {
        force: 2000,
        nodeSize: 15,
        nodeLabels: true,
        linkWidth: 3,
        fontSize: 12,
        size: {
          h: 400
        }
      }
    }
  },
  methods: {
    getTaxons () {
      return this.$store.state.taxons
    },
    getInteractions () {
      return this.$store.state.interactions
    }
  },
  mounted () {
    // Get Taxa
    this.$store.watch((idNet) => {
      return this.$store.state.selectNet
    },
    (idNet) => {
      this.nodes = []
      this.links = []
      this.nEdges = 0
      this.nNodes = 0
      this.con = 0
      this.$store.dispatch('loadTaxons', idNet).then(() => {
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
          this.con = (this.nEdges / Math.pow(this.nodes.length, 2)).toFixed(2)
        })
          .catch((err) => {
            console.log(err)
          })
      }).then(() => {
        this.nNodes = this.nodes.length
      })
    })
  }
}
</script>

<style>
.rounded-card{
  border-radius:50px;
}
</style>
