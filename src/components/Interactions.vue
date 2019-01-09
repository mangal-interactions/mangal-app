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
      <template slot="items" slot-scope="props">
        <td>{{ props.item.id }}</td>
        <td class="text-xs-left"><a href="#">{{ props.item.taxon_1_desc.original_name }}</a></td>
        <td class="text-xs-left"><a href="#">{{ props.item.taxon_2_desc.original_name }}</a></td>
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
        { text: 'From', value: 'taxon_1_desc.original_name' }, // Set Hyperlink to ITIS on click
        { text: 'To', value: 'taxon_2_desc.original_name' }, // Set Hyperlink to ITIS on click
        { text: 'Directed?', value: 'direction' },
        { text: 'Type', value: 'type' },
        { text: 'Traits available', value: 'carbs' }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'getInteractions',
      'getTaxons'
    ]),
    taxaInteractions () {
      let taxaInteractions = this.getInteractions.map((interac) => {
        return {
          ...interac,
          taxon_1_desc: _.find(this.getTaxons, { id: interac.taxon_1 }),
          taxon_2_desc: _.find(this.getTaxons, { id: interac.taxon_2 })
        }
      })

      // taxaInteractions.map((interac) => {
      //   interac.taxo_1 = axios.get('/taxonomy/' + interac.taxon_1_desc.taxo_id).then((result) => {
      //     return result.data
      //   })
      //   interac.taxo_2 = axios.get('/taxonomy/' + interac.taxon_2_desc.taxo_id).then((result) => {
      //     return result.data
      //   })
      //   return interac
      // })

      return taxaInteractions
    }
  }
}
</script>

<style>
table.v-table tbody td:first-child, table.v-table tbody td:not(:first-child), table.v-table tbody th:first-child, table.v-table tbody th:not(:first-child), table.v-table thead td:first-child, table.v-table thead td:not(:first-child), table.v-table thead th:first-child, table.v-table thead th:not(:first-child) {
    padding: 0 10px
}
</style>
