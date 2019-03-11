<template>
<v-flex xs12>
  <table  rules="rows">
    <tr>
      <th>Date</th>
      <th>Description</th>
      <th></th>
    </tr>
    <tr v-for="net in networksData" :key="net.name">
      <td><p class="pr-2" style="font-weight:bold;">{{ net.date | moment }}</p></td>
      <td style="max-width:200px;"><p class="pa-2" style="font-style:italic;">{{ net.description }}</p></td>
      <td><v-btn small depressed outline color="primary" @click="$emit('updateNet', net.id)" style="width:50px;font-size:11px;margin:0px;text-transform: none !important;">View</v-btn></td>
    </tr>
  </table>
</v-flex>
</template>

<script>
import moment from 'moment'
export default {
  props: ['networksData'],
  filters: {
    moment: function (date) {
      return moment(date).format('YYYY-MM-DD')
    }
  }
}
</script>

<style scoped>
table {
    display: table;
    border-color: #004e6b;
}
p {
  margin: 0;
}
.v-btn {
  min-width: 30px;
}
</style>
