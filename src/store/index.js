import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import _ from 'lodash'

Vue.use(Vuex)

// root state object.
// each Vuex instance is just a single state tree.
const state = {
  mapCollection: null,
  networks: [],
  interactions: [],
  taxons: [],
  selectNet: 125,
  loading: true
}

const mutations = {
  // Networks
  storeNetworks (state, networks) {
    state.networks.push.apply(state.networks, networks)
  },
  emptyNetworks (state) {
    state.networks = []
  },
  changeLoadingState (state, loading) {
    state.loading = loading
  },
  setNet (state, selectNet) {
    state.selectNet = selectNet
  },
  setMapCollection (state, mapCollection) {
    state.mapCollection = mapCollection
  },
  // Interactions
  storeInteractions (state, interactions) {
    state.interactions.push.apply(state.interactions, interactions)
  },
  emptyInteractions (state) {
    state.interactions = []
  },
  // Taxons
  storeTaxons (state, taxons) {
    state.taxons.push.apply(state.taxons, taxons)
  },
  emptyTaxons (state) {
    state.taxons = []
  }
}

// actions are functions that causes side effects and can involve
// asynchronous operations.
const actions = {
  loadNetworksCollection ({ commit, state }) {
    return new Promise((resolve) => {
      // Create collection
      let netCollection = _
        .chain(state.networks)
        .each(function (net) {
          net.group = net.localisation.coordinates.join('_')
        })
        .groupBy('group')
        .value()
      commit('setMapCollection', netCollection)
      return resolve()
    })
  },
  loadNetworks ({ commit }) {
    commit('emptyNetworks')
    return new Promise((resolve, reject) => {
      axios.get(process.env.BASE_URL + '/network?q=Kolpelke%&page=0')
        .then(response => {
          // store page 0
          commit('storeNetworks', response.data)
          // Check number of pages
          let range = response.headers['content-range'].match(/\d+/g).map(Number)
          let nPages = Math.ceil(range[2] / range[1]) - 1
          if (nPages > 0 && nPages !== Infinity) {
            let requests = []
            for (let i = 1; i <= nPages; i++) {
              requests.push(axios.get(process.env.BASE_URL + '/network?q=Kolpelke%&page=' + i))
            }
            Promise.all(requests)
              .then(responses => responses.forEach(
                response => {
                  commit('storeNetworks', response.data)
                }
              )).then(() => {
                commit('changeLoadingState', false)
                return resolve()
              }).catch((err) => {
                this.$log.error(err)
                return reject(err)
              })
          }
        })
    })
  },
  loadInteractions ({ commit }, ids) {
    commit('emptyInteractions')
    return new Promise((resolve, reject) => {
      let requests = []
      for (let index = 0; index < ids.length; index++) {
        const id = ids[index]
        requests.push(
          axios.get(process.env.BASE_URL + '/interaction?taxon_1=' + id + '&page=0')
        )
      }
      // TODO: Only page 0 covered by the code
      Promise.all(requests)
        .then(responses => responses.forEach(
          response => {
            commit('storeInteractions', response.data)
          }
        ))
        .then(() => {
          return resolve()
        })
        .catch((err) => {
          this.$log.error(err)
          return reject(err)
        })
    })
  },
  loadTaxons ({ commit }, idNet) {
    commit('emptyTaxons')
    return new Promise((resolve, reject) => {
      axios.get(process.env.BASE_URL + '/taxon?network_id=' + idNet + '&page=0')
        .then(response => {
          // store page 0
          commit('storeTaxons', response.data)
          // Check number of pages
          let range = response.headers['content-range'].match(/\d+/g).map(Number)
          let nPages = Math.ceil(range[2] / range[1]) - 1
          if (nPages > 0 && nPages !== Infinity) {
            let requests = []
            for (let i = 1; i <= nPages; i++) {
              requests.push(axios.get(process.env.BASE_URL + '/taxon?network_id=' + idNet + '&page=' + i))
            }
            Promise.all(requests)
              .then(responses => responses.forEach(
                response => {
                  commit('storeTaxons', response.data)
                  return resolve()
                }
              ))
              .catch((err) => {
                return reject(err)
              })
          }
        })
    })
  },
  setNet ({ commit }, selectNet) {
    return commit('setNet', selectNet)
  }
}

const getters = {
}

// A Vuex instance is created by combining the state, mutations, actions,
// and getters.
export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
