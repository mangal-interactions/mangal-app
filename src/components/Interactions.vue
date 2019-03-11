<template>
  <v-flex xs12  v-if="taxaInteractions">
    <v-data-table
      :headers="headers"
      :items="taxaInteractions"
      class="elevation-1"
      color="teal"
      :rows-per-page-items="rowsPerPageItems"
      :pagination.sync="pagination"
      style="width:100%"
    >
      <template slot="no-data">
        <v-progress-linear v-slot:progress color="primary" indeterminate></v-progress-linear>
      </template>
      <template slot="items" slot-scope="props">
        <td class="text-xs-center">
          <div class="font-weight-bold">
            <span v-if="props.item.node_from_desc.taxonomy">{{ props.item.node_from_desc.taxonomy.name }}</span>
            <span v-else>{{ props.item.node_from_desc.original_name }}</span>
          </div>
          <span v-if="props.item.node_from_desc.taxonomy">
          <a class="caption blue--text" v-if="props.item.node_from_desc.taxonomy.bold" :href="'http://v4.boldsystems.org/index.php/API_Tax/TaxonData?taxId=' + props.item.node_from_desc.taxonomy.bold + '&dataTypes=basic'">BOLD</a>
          <a class="caption blue--text" v-if="props.item.node_from_desc.taxonomy.tsn" :href="'https://www.itis.gov/servlet/SingleRpt/SingleRpt?search_topic=TSN&search_value=' + props.item.node_from_desc.taxonomy.tsn">ITIS</a>
          <a class="caption blue--text" v-if="props.item.node_from_desc.taxonomy.eol" :href="'https://eol.org/pages/' + props.item.node_from_desc.taxonomy.eol">EOL</a>
          <a class="caption blue--text" v-if="props.item.node_from_desc.taxonomy.ncbi" :href="'https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id=' + props.item.node_from_desc.taxonomy.ncbi">NCBI</a>
          </span>
        </td>
        <td class="text-xs-center">
          <div v-if="props.item.direction === 'directed'"> <v-icon color="primary" small>fas fa-arrow-right</v-icon></div>
          <div v-else>  <v-icon color="primary" small>fas fa-arrows-alt-h</v-icon></div>
        </td>
        <td class="text-xs-center">
          <div class="font-weight-bold">
            <span v-if="props.item.node_to_desc.taxonomy">{{ props.item.node_to_desc.taxonomy.name }}</span>
            <span v-else>{{ props.item.node_to_desc.original_name }}</span>
          </div>
          <span v-if="props.item.node_to_desc.taxonomy">
          <a class="caption blue--text" v-if="props.item.node_to_desc.taxonomy.bold" :href="'http://v4.boldsystems.org/index.php/API_Tax/TaxonData?taxId=' + props.item.node_to_desc.taxonomy.bold + '&dataTypes=basic'">BOLD</a>
          <a class="caption blue--text" v-if="props.item.node_to_desc.taxonomy.tsn" :href="'https://www.itis.gov/servlet/SingleRpt/SingleRpt?search_topic=TSN&search_value=' + props.item.node_to_desc.taxonomy.tsn">ITIS</a>
          <a class="caption blue--text" v-if="props.item.node_to_desc.taxonomy.eol" :href="'https://eol.org/pages/' + props.item.node_to_desc.taxonomy.eol">EOL</a>
          <a class="caption blue--text" v-if="props.item.node_to_desc.taxonomy.ncbi" :href="'https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id=' + props.item.node_to_desc.taxonomy.ncbi">NCBI</a>
          </span>
        </td>
        <td class="text-xs-center">{{ props.item.type }}</td>
        <td class="text-xs-center">{{ props.item.method }}</td>
        <td class="text-xs-center">{{ props.item.attribute.name}}</td>
        <td>{{ props.item.value }}</td>
      </template>
    </v-data-table>
  </v-flex>
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
        // eslint-disable-next-line
        { text: 'Node', value: 'node_from_desc.original_name', width: "1%" }, // Set Hyperlink to ITIS on click
        // eslint-disable-next-line
        { text: '', value: 'direction', width: "1%" },
        // eslint-disable-next-line
        { text: 'Node', value: 'node_to_desc.original_name', width: "1%" }, // Set Hyperlink to ITIS on click
        // eslint-disable-next-line
        { text: 'Type', value: 'type', width: '1%' },
        // eslint-disable-next-line
        { text: 'Method', value: 'method', width: '1%' },
        // eslint-disable-next-line
        { text: 'Variable', value: 'variable', width: '1%' },
        // eslint-disable-next-line
        { text: 'Value', value: 'value', width: '1%' }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'getInteractions',
      'getTaxons'
    ]),
    taxaInteractions () {
      let interactions = this.getInteractions
      let taxaInteractions = []
      if (interactions.length > 0) {
        taxaInteractions = interactions.map((interac) => {
          let TaxonDesc1 = _.find(this.getTaxons, { id: interac.node_from })
          let TaxonDesc2 = _.find(this.getTaxons, { id: interac.node_to })

          return {
            ...interac,
            node_from_desc: TaxonDesc1,
            node_to_desc: TaxonDesc2
          }
        })
      }
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
