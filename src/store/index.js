import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import _ from 'lodash'

Vue.use(Vuex)

// root state object.
// each Vuex instance is just a single state tree.
const state = {
  mapCollection: null,
  dataset: null,
  ref: null,
  networks: [],
  interactions: [],
  taxons: [],
  taxonomy: [],
  traits: [],
  attributes: [],
  drawerRight: false,
  // Default loading values
  selectNet: 1102,
  netCollection: [{'id': 1102, 'name': 'bulman_2001', 'date': '1993-07-01T04:00:00.000Z', 'geom': {'type': 'Point', 'coordinates': [120.433333, 22.45]}, 'description': 'Dietary matrix of  demersal fishes of the south-eastern Australian shelf', 'public': true, 'all_interactions': false, 'created_at': '2019-02-26T23:22:13.839Z', 'updated_at': '2019-02-26T23:22:13.839Z', 'dataset_id': 58, 'environment_id': null, 'user_id': null, 'group': '120.433333_22.45'}, {'id': 89, 'name': 'lin_2006', 'date': '2006-01-01T05:00:00.000Z', 'geom': {'type': 'Point', 'coordinates': [120.433333, 22.45]}, 'description': 'Dietary matrix of the Tapong Bay', 'public': true, 'all_interactions': false, 'created_at': '2019-02-23T21:33:15.418Z', 'updated_at': '2019-02-23T21:33:15.418Z', 'dataset_id': 25, 'environment_id': null, 'user_id': null, 'group': '120.433333_22.45'}],
  loading: true
}

const mutations = {
  // Loading
  changeLoadingState (state, loading) {
    state.loading = loading
  },
  // Open Panes
  changeStatePane (state, bol) {
    state.drawerRight = bol
  },
  // Networks
  storeNetworks (state, networks) {
    state.networks.push.apply(state.networks, networks)
  },
  emptyNetworks (state) {
    state.networks = []
  },
  // ID net
  setNet (state, selectNet) {
    state.selectNet = selectNet
  },
  // NetCollection for map
  setMapCollection (state, mapCollection) {
    state.mapCollection = mapCollection
  },
  setNetCollection (state, netCollection) {
    state.netCollection = netCollection
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
  },
  // Taxonomy
  storeTaxonomy (state, taxonomy) {
    state.taxonomy.push(taxonomy)
  },
  emptyTaxonomy (state) {
    state.taxonomy = []
  },
  // Traits
  storeTraits (state, traits) {
    state.traits = traits
  },
  emptyTraits (state) {
    state.traits = []
  },
  // Dataset
  storeDataset (state, dataset) {
    state.dataset = dataset
  },
  // Reference
  storeRef (state, ref) {
    state.ref = ref
  },
  // Attributes
  emptyAttributes (state) {
    state.attributes = []
  },
  storeAttributes (state, attributes) {
    state.attributes = attributes
  }
}

// actions are functions that causes side effects and can involve
// asynchronous operations.
const actions = {
  openStatePane ({ commit }, status) {
    commit('changeStatePane', status)
  },
  loadRef ({ commit }, refId) {
    return new Promise((resolve, reject) => {
      axios.get(process.env.BASE_URL + '/reference/' + refId)
        .then((response) => {
          commit('storeRef', response.data)
          return resolve()
        })
        .catch((err) => {
          return reject(err)
        })
    })
  },
  loadTaxonomy ({ commit }, taxons) {
    return new Promise((resolve, reject) => {
      let uqTaxons = _.chain(taxons).map('taxonomy_id').uniq().compact().value()
      let requests = []
      for (let i = 0; i <= uqTaxons.length - 1; i++) {
        requests.push(axios.get(process.env.BASE_URL + '/taxonomy/' + uqTaxons[i]))
      }
      Promise.all(requests)
        .then(responses => responses.forEach(
          response => {
            if (response.data) {
              commit('storeTaxonomy', response.data)
            }
          }
        )).then(() => {
          return resolve()
        }).catch((err) => {
          this.$log.error(err)
          return reject(err)
        })
    })
  },
  loadTraits ({ commit }, taxons) {
    return new Promise((resolve, reject) => {
      let uqTaxons = _.chain(taxons).map('id').uniq().value()
      let requestsTraits = []
      let requestsAttr = []
      let traits = []
      for (let i = 0; i < uqTaxons.length; i++) {
        requestsTraits.push(axios.get(process.env.BASE_URL + '/trait?node_id=' + uqTaxons[i]))
      }
      Promise.all(requestsTraits)
        .then(responses => responses.forEach(
          response => {
            if (response.data[0]) {
              traits.push.apply(traits, response.data)
            }
          }
        )).then(() => {
          for (let i = 0; i < traits.length; i++) {
            requestsAttr.push(axios.get(process.env.BASE_URL + '/attribute/' + traits[i].attr_id))
          }
          Promise.all(requestsAttr).then((responses) => {
            for (let i = 0; i < responses.length; i++) {
              traits[i].attributes = responses[i].data
            }
          }).then(() => {
            commit('storeTraits', traits)
            return resolve()
          })
        }).catch((err) => {
          this.$log.error(err)
          return reject(err)
        })
    })
  },
  loadDataset ({ commit }, datasetId) {
    return new Promise((resolve, reject) => {
      axios.get(process.env.BASE_URL + '/dataset/' + datasetId)
        .then((response) => {
          commit('storeDataset', response.data)
          return resolve()
        })
        .catch((err) => {
          return reject(err)
        })
    })
  },
  loadNetworksCollection ({ commit, state }) {
    return new Promise((resolve) => {
      // Create collection
      let netCollection = _
        .chain(state.networks)
        .remove((net) => {
          return net.geom !== null
        })
        .each(function (net) {
          net.group = net.geom.coordinates.join('_')
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
                return resolve()
              }).catch((err) => {
                this.$log.error(err)
                return reject(err)
              })
          }
        })
    })
  },
  loadAttributes ({ commit }) {
    return new Promise((resolve, reject) => {
      commit('emptyAttributes')
      axios.get(process.env.BASE_URL + '/attribute').then((response) => {
        commit('storeAttributes', response.data)
      }).then(() => {
        return resolve()
      }).catch((err) => {
        this.$log.error(err)
        return reject(err)
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
          axios.get(process.env.BASE_URL + '/interaction?node_from=' + id)
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
  loadTaxons ({ commit, dispatch }, idNet) {
    return new Promise((resolve, reject) => {
      axios.get(process.env.BASE_URL + '/node?network_id=' + idNet)
        .then(response => {
          commit('emptyTaxons')
          commit('emptyTaxonomy')
          commit('emptyTraits')
          // store page 0
          commit('storeTaxons', response.data)
          dispatch('loadTaxonomy', response.data)
          dispatch('loadTraits', response.data)
          // Check number of pages
          let range = response.headers['content-range'].match(/\d+/g).map(Number)
          let nPages = Math.ceil(range[2] / range[1]) - 1
          if (nPages > 0 && nPages !== Infinity) {
            let requests = []
            for (let i = 1; i <= nPages; i++) {
              requests.push(axios.get(process.env.BASE_URL + '/node?network_id=' + idNet + '&page=' + i))
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
  },
  setNetCollection ({ commit }, netCollection) {
    return commit('setNetCollection', netCollection)
  },
  setLoading ({ commit }, status) {
    commit('changeLoadingState', status)
  }
}

const getters = {
  getNetCollection: (state) => {
    return state.netCollection
  },
  getNetSelected: (state) => {
    return state.selectNet
  },
  getRef: (state) => {
    return state.ref
  },
  getDataset: (state) => {
    return state.dataset
  },
  getInteractions: (state) => {
    return state.interactions
  },
  getTaxons: (state) => {
    return state.taxons
  },
  getAttributes: (state) => {
    return state.attributes
  },
  getTraits: (state) => {
    return state.traits
  },
  getTaxonomy: (state) => {
    return state.taxonomy
  }
}

// A Vuex instance is created by combining the state, mutations, actions,
// and getters.
export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
