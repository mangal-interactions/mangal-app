<template>
  <v-flex xs12>
    <table rules="rows">
      <tr>
        <th style="text-align:left;" class="pa-2">Date</th>
        <th style="text-align:left;" class="pa-2">Description</th>
        <th></th>
      </tr>
      <tr v-for="net in sortNets" :key="net.name">
        <td>
          <p class="pr-2" style="font-weight:bold;">{{ net.date | moment }}</p>
        </td>
        <td style="max-width:200px;">
          <p class="pa-2" style="font-style:italic;">{{ net.description }}</p>
        </td>
        <td>
          <v-btn
            small
            depressed
            color="teal"
            dark
            @click="$emit('updateNet', net.id)"
            style="width:50px;font-size:11px;margin:0px;text-transform: none !important;"
            >View
          </v-btn>
        </td>
      </tr>
    </table>
  </v-flex>
</template>

<script>
import moment from "moment";
import _ from "lodash";
export default {
  props: ["networksData"],
  filters: {
    moment: function(date) {
      return moment(date).format("YYYY-MM-DD");
    }
  },
  computed: {
    sortNets: function() {
      let sortData = _.sortBy(this.networksData, function(o) {
        return moment(o.date).format("YYYY-MM-DD");
      });
      return sortData;
    }
  }
};
</script>

<style scoped>
p {
  margin: 0;
}
.v-btn {
  min-width: 30px;
}
</style>
