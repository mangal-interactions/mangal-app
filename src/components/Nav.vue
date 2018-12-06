<template>
    <b-navbar toggleable="md" type="dark" variant="info">

    <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

    <b-navbar variant="faded" type="light">
      <b-navbar-brand tag="h1" class="title">- Mangal.io -</b-navbar-brand>
      <b-nav-text class="title"> Ecological interaction database</b-nav-text>
    </b-navbar>

      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">
        <b-nav-form>
          <b-form-input class="mr-sm-2" type="text" placeholder="Search"/>
        </b-nav-form>
      </b-navbar-nav>

    </b-navbar>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

@import url('https://fonts.googleapis.com/css?family=Suez+One');

.title {
 font-family: 'Suez One', serif;
 margin-bottom: 0px;
}

.navbar-dark .navbar-text {
    color: rgba(255,255,255);
}

</style>
