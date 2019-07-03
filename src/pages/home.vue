<template>
  <v-app>
    <v-layout align-center justify-center row fill-height bg>
    <v-flex xs4 class="text-md-right primary--text pr-5" jumbo>
    <div class="display-3">
      Welcome to <strong class="primary--text">Mangal</strong>,
    </div>
    <div class="display-1 font-weight-light">
      the ecological interactions database
    </div>
    </v-flex>
    <v-flex xs4>
    <table style="width:100%">
      <tr>
        <th style="text-align:center;"><div class="display-2 font-weight-bold primary--text pb-1">Explore</div></th>
        <th colspan="2" style="text-align:center;"><div class="display-2 font-weight-bold primary--text pb-1">Analyze</div></th>
        <th style="text-align:center;"><div class="display-2 font-weight-bold primary--text pb-1">Contribute</div></th>
      </tr>
      <tr>
        <td style="text-align:center;"><v-btn color="primary" href="#/network" >Map</v-btn></td>
        <td style="text-align:center;"><v-btn color="primary" href="https://mangal.io/doc/jl" >with Julia</v-btn></td>
        <td style="text-align:center;"><v-btn color="primary" href="https://mangal.io/doc/r" >with R</v-btn></td>
        <td style="text-align:center;"><v-btn color="primary" href="https://mangal.io/doc/api" >Documentation</v-btn></td>
      </tr>
    </table>
    </v-flex>
    </v-layout>
  </v-app>
</template>

<style>
@import url('https://fonts.googleapis.com/css?family=Cardo');
div.display-2, div.display-3 {
  font-family: Cardo !important;
  color: primary;
}
.display-2, .display-3 {
  font-family: Cardo !important;
  color: primary;
}
.bg {
  background-image: url(../assets/img/bg5.jpg);
  background-size: cover;
}
</style>
