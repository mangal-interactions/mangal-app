import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

// root state object.
// each Vuex instance is just a single state tree.
const state = {
  networks: [],
  interactions: [],
  taxons: [],
  selectNet: null,
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
  setSelectedNet (state, selectNet) {
    state.selectNet = selectNet
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
  loadNetworks ({ commit }) {
    return new Promise((resolve, reject) => {
      commit('emptyNetworks')
      axios.get(process.env.BASE_URL + '/network?page=0')
        .then(response => {
          // store page 0
          commit('storeNetworks', response.data)
          // Check number of pages
          let range = response.headers['content-range'].match(/\d+/g).map(Number)
          let nPages = Math.ceil(range[2] / range[1]) - 1
          if (nPages > 0 && nPages !== Infinity) {
            let requests = []
            for (let i = 1; i <= nPages; i++) {
              requests.push(axios.get(process.env.BASE_URL + '/network?page=' + i))
            }
            Promise.all(requests)
              .then(responses => responses.forEach(
                response => {
                  commit('storeNetworks', response.data)
                }
              )).then(() => {
                commit('changeLoadingState', false)
              }).catch((err) => {
                this.$log.error(err)
              })
          }
        }).then(() => {
          resolve()
        }).catch((err) => {
          reject(err)
        })
    })
  },
  loadInteractions ({ commit }, ids) {
    return new Promise((resolve, reject) => {
      commit('emptyInteractions')
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
    return new Promise((resolve, reject) => {
      commit('emptyTaxons')
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
                }
              ))
              .catch((err) => {
                this.$log.error(err)
              })
          }
        }).then(() => {
          return resolve()
        }).catch((err) => {
          return reject(err)
        })
    })
  },
  setSelectedNet ({ commit }, selectNet) {
    return commit('setSelectedNet', selectNet)
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
