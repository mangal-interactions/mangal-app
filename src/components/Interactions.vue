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
      <!--
      #{{ props.item.taxonomy_taxon_1.eol }}
      #{{ props.item.taxonomy_taxon_1.ncbi }}
      -->
      <template slot="items" slot-scope="props">
        <td>{{ props.item.id }}</td>
        <td class="text-xs-left">
          <div class="font-weight-bold">{{ props.item.taxonomy_taxon_1.name }}</div>
          <a class="caption blue--text" v-if="props.item.taxonomy_taxon_1.bold" :href="'http://v4.boldsystems.org/index.php/API_Tax/TaxonData?taxId=' + props.item.taxonomy_taxon_1.bold + '&dataTypes=basic'">BOLD</a>
          <a class="caption blue--text" v-if="props.item.taxonomy_taxon_1.tsn" :href="'https://www.itis.gov/servlet/SingleRpt/SingleRpt?search_topic=TSN&search_value=' + props.item.taxonomy_taxon_1.tsn">ITIS</a>
          <a class="caption blue--text" v-if="props.item.taxonomy_taxon_1.eol" :href="'https://eol.org/pages/' + props.item.taxonomy_taxon_1.eol">EOL</a>
          <a class="caption blue--text" v-if="props.item.taxonomy_taxon_1.ncbi" :href="'https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id=' + props.item.taxonomy_taxon_1.ncbi">NCBI</a>
        </td>
        <td class="text-xs-left">
          <div class="font-weight-bold">{{ props.item.taxonomy_taxon_2.name }}</div>
          <a class="caption blue--text" v-if="props.item.taxonomy_taxon_2.bold" :href="'http://v4.boldsystems.org/index.php/API_Tax/TaxonData?taxId=' + props.item.taxonomy_taxon_2.bold + '&dataTypes=basic'">BOLD</a>
          <a class="caption blue--text" v-if="props.item.taxonomy_taxon_2.tsn" :href="'https://www.itis.gov/servlet/SingleRpt/SingleRpt?search_topic=TSN&search_value=' + props.item.taxonomy_taxon_2.tsn">ITIS</a>
          <a class="caption blue--text" v-if="props.item.taxonomy_taxon_2.eol" :href="'https://eol.org/pages/' + props.item.taxonomy_taxon_2.eol">EOL</a>
          <a class="caption blue--text" v-if="props.item.taxonomy_taxon_2.ncbi" :href="'https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id=' + props.item.taxonomy_taxon_2.ncbi">NCBI</a>
        </td>
        <td class="text-xs-center">
          <div v-if="props.item.direction === 'directed'"> <v-icon small color="green">far fa-check-circle</v-icon></div>
          <div v-else> <v-icon small color="red">far fa-times-circle</v-icon></div>
        </td>
        <td class="text-xs-left text-capitalize">{{ props.item.type }}</td>
        <td class="text-xs-left text-capitalize font-italic caption">
          <div v-for="trait in props.item.traits_available" v-bind:key="trait">
            {{ trait }}
          </div>
        </td>
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
        { text: 'From', value: 'taxonomy_taxon_1.name' }, // Set Hyperlink to ITIS on click
        { text: 'To', value: 'taxonomy_taxon_2.name' }, // Set Hyperlink to ITIS on click
        { text: 'Directed?', value: 'direction' },
        { text: 'Type', value: 'type' },
        { text: 'Traits available', value: 'traits_available' }
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
      if (this.getInteractions.length > 0 && this.getTaxons.length > 0 && this.getTraits.length > 0 && this.getTaxonomy.length > 0) {
        let taxaInteractions = this.getInteractions.map((interac) => {
          let traits = _.chain(this.getTraits)
            .filter((trait) => {
              return trait.taxon_id === interac.taxon_1 || trait.taxon_id === interac.taxon_2
            })
            .map('attributes')
            .map('name')
            .value()

          let TaxonDesc1 = _.find(this.getTaxons, { id: interac.taxon_1 })
          let TaxonDesc2 = _.find(this.getTaxons, { id: interac.taxon_2 })
          let TaxonomyDesc1 = _.find(this.getTaxonomy, { id: TaxonDesc1.taxo_id })
          let TaxonomyDesc2 = _.find(this.getTaxonomy, { id: TaxonDesc2.taxo_id })

          return {
            ...interac,
            taxon_1_desc: TaxonDesc1,
            taxon_2_desc: TaxonDesc2,
            taxonomy_taxon_1: TaxonomyDesc1,
            taxonomy_taxon_2: TaxonomyDesc2,
            traits_available: traits
          }
        })
        return taxaInteractions
      }
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
