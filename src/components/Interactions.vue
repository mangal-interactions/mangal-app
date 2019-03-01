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
          <v-progress-linear v-slot:progress color="primary" indeterminate></v-progress-linear>
        </template>
        <template slot="items" slot-scope="props">
          <td class="text-xs-center">
            <div class="font-weight-bold">{{ props.item.node_1_desc.original_name }}</div>
            <a class="caption blue--text" v-if="props.item.taxonomy_node_1.bold" :href="'http://v4.boldsystems.org/index.php/API_Tax/TaxonData?taxId=' + props.item.taxonomy_node_1.bold + '&dataTypes=basic'">BOLD</a>
            <a class="caption blue--text" v-if="props.item.taxonomy_node_1.tsn" :href="'https://www.itis.gov/servlet/SingleRpt/SingleRpt?search_topic=TSN&search_value=' + props.item.taxonomy_node_1.tsn">ITIS</a>
            <a class="caption blue--text" v-if="props.item.taxonomy_node_1.eol" :href="'https://eol.org/pages/' + props.item.taxonomy_node_1.eol">EOL</a>
            <a class="caption blue--text" v-if="props.item.taxonomy_node_1.cbi" :href="'https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id=' + props.item.taxonomy_node_1.ncbi">NCBI</a>
          </td>
          <td class="text-xs-center">
            <div class="font-weight-bold">{{ props.item.node_2_desc.original_name }}</div>
            <a class="caption blue--text" v-if="props.item.taxonomy_node_2.bold" :href="'http://v4.boldsystems.org/index.php/API_Tax/TaxonData?taxId=' + props.item.taxonomy_node_2.bold + '&dataTypes=basic'">BOLD</a>
            <a class="caption blue--text" v-if="props.item.taxonomy_node_2.tsn" :href="'https://www.itis.gov/servlet/SingleRpt/SingleRpt?search_topic=TSN&search_value=' + props.item.taxonomy_node_2.tsn">ITIS</a>
            <a class="caption blue--text" v-if="props.item.taxonomy_node_2.eol" :href="'https://eol.org/pages/' + props.item.taxonomy_node_2.eol">EOL</a>
            <a class="caption blue--text" v-if="props.item.taxonomy_node_2.ncbi" :href="'https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id=' + props.item.taxonomy_node_2.ncbi">NCBI</a>
          </td>
          <td class="text-xs-center">
            <div v-if="props.item.direction === 'directed'"> <v-icon small color="green">far fa-check-circle</v-icon></div>
            <div v-else> <v-icon small color="red">far fa-times-circle</v-icon></div>
          </td>
          <td class="text-xs-center">{{ props.item.type }}</td>
          <td class="text-xs-center">{{ props.item.method }}</td>
          <td class="text-xs-center">{{ props.item.attr_desc.name }}</td>
          <td>{{ props.item.value }}</td>
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
        rowsPerPage: 10
      },
      headers: [
        { text: 'From', value: 'node_1_desc.original_name', width: '1%' }, // Set Hyperlink to ITIS on click
        { text: 'To', value: 'node_2_desc.original_name', width: '1%' }, // Set Hyperlink to ITIS on click
        { text: 'Directed?', value: 'direction', width: '1%' },
        { text: 'Type interaction', value: 'type', width: '1%' },
        { text: 'Method', value: 'method', width: '1%' },
        { text: 'Variable', value: 'variable', width: '1%' },
        { text: 'Value', value: 'value', width: '1%' }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'getInteractions',
      'getTaxons',
      'getTraits',
      'getTaxonomy',
      'getAttributes'
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
        let attrDesc = _.find(this.getAttributes, { id: interac.attr_id })

        return {
          ...interac,
          attr_desc: attrDesc,
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
    padding: 0 5px;
    font-size: 12px;
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

.caption {
  font-size: 11px !important;
}

</style>
