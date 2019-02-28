<template>
  <div id="app">
    <v-data-table
        :headers="headers"
        :items="taxaInteractions"
        class="elevation-1"
        color="teal"
        :rows-per-page-items="rowsPerPageItems"
        :pagination.sync="pagination"
      >
      <template slot="no-data">
        <v-layout wrap row>
          <v-flex x4 class="text-xs-left pt-4">
            Data fetching...
          </v-flex>
          <v-progress-linear
            indeterminate
            color="teal"
          ></v-progress-linear>
        </v-layout>
      </template>
      <template slot="items" slot-scope="props">
        <td>{{ props.item.id }}</td>
        <td class="text-xs-left">
          <div class="font-weight-bold">{{ props.item.node_1_desc.original_name }}</div>
          <a class="caption blue--text" v-if="props.item.taxonomy_node_1" :href="'http://v4.boldsystems.org/index.php/API_Tax/TaxonData?taxId=' + props.item.taxonomy_node_1.bold + '&dataTypes=basic'">BOLD</a>
          <a class="caption blue--text" v-if="props.item.taxonomy_node_1" :href="'https://www.itis.gov/servlet/SingleRpt/SingleRpt?search_topic=TSN&search_value=' + props.item.taxonomy_node_1.tsn">ITIS</a>
          <a class="caption blue--text" v-if="props.item.taxonomy_node_1" :href="'https://eol.org/pages/' + props.item.taxonomy_node_1.eol">EOL</a>
          <a class="caption blue--text" v-if="props.item.taxonomy_node_1" :href="'https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id=' + props.item.taxonomy_node_1.ncbi">NCBI</a>
        </td>
        <td class="text-xs-left">
          <div class="font-weight-bold">{{ props.item.node_2_desc.original_name }}</div>
          <a class="caption blue--text" v-if="props.item.taxonomy_node_2" :href="'http://v4.boldsystems.org/index.php/API_Tax/TaxonData?taxId=' + props.item.taxonomy_node_2.bold + '&dataTypes=basic'">BOLD</a>
          <a class="caption blue--text" v-if="props.item.taxonomy_node_2" :href="'https://www.itis.gov/servlet/SingleRpt/SingleRpt?search_topic=TSN&search_value=' + props.item.taxonomy_node_2.tsn">ITIS</a>
          <a class="caption blue--text" v-if="props.item.taxonomy_node_2" :href="'https://eol.org/pages/' + props.item.taxonomy_node_2.eol">EOL</a>
          <a class="caption blue--text" v-if="props.item.taxonomy_node_2" :href="'https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id=' + props.item.taxonomy_node_2.ncbi">NCBI</a>
        </td>
        <td class="text-xs-center">
          <div v-if="props.item.direction === 'directed'"> <v-icon small color="green">far fa-check-circle</v-icon></div>
          <div v-else> <v-icon small color="red">far fa-times-circle</v-icon></div>
        </td>
        <td class="text-xs-left text-capitalize">{{ props.item.type }}</td>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import axios from 'axios'
import _ from 'lodash'
export default {
  data () {
    return {
      rowsPerPageItems: [10, 25, 50],
      pagination: {
        rowsPerPage: 25
      },
      headers: [
        { text: 'Taxa ID', value: 'id' },
        { text: 'From', value: 'node_1_desc.original_name' }, // Set Hyperlink to ITIS on click
        { text: 'To', value: 'node_2_desc.original_name' }, // Set Hyperlink to ITIS on click
        { text: 'Directed?', value: 'direction' },
        { text: 'Type interaction', value: 'type' }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'getInteractions',
      'getTaxons',
      'getTraits',
      'getTaxonomy'
    ]),
    taxaInteractions () {
      let taxaInteractions = this.getInteractions.map((interac) => {
        let TaxonDesc1 = _.find(this.getTaxons, { id: interac.node_from })
        let TaxonDesc2 = _.find(this.getTaxons, { id: interac.node_to })

        let TaxonomyDesc1 = null
        let TaxonomyDesc2 = null

        if (TaxonDesc1) {
          TaxonomyDesc1 = _.find(this.getTaxonomy, { id: TaxonDesc1.taxonomy_id })
        }
        if (TaxonDesc2) {
          TaxonomyDesc2 = _.find(this.getTaxonomy, { id: TaxonDesc2.taxonomy_id })
        }

        return {
          ...interac,
          node_1_desc: TaxonDesc1,
          node_2_desc: TaxonDesc2,
          taxonomy_node_1: TaxonomyDesc1,
          taxonomy_node_2: TaxonomyDesc2
        }
      })
      console.log(taxaInteractions)
      return taxaInteractions
    }
  }
}
</script>

<style lang="css" scoped>
table.v-table tbody td:first-child, table.v-table tbody td:not(:first-child), table.v-table tbody th:first-child, table.v-table tbody th:not(:first-child), table.v-table thead td:first-child, table.v-table thead td:not(:first-child), table.v-table thead th:first-child, table.v-table thead th:not(:first-child) {
    padding: 0 5px
}
.v-chip .v-chip__content .infra {
    border-radius: 28px;
    cursor: default;
    height: 12px;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
    padding: 0 12px;
    white-space: nowrap;
    z-index: 1;
}
</style>
