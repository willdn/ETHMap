const state = {
  contract: null,
  currentAddress: null,
  mapLoaded: false,
  networkUnknown: false,
  zones: []
}

// getters
const getters = {
  app: state => state,
  contract: state => state.contract,
  currentAddress: state => state.currentAddress,
  mapLoaded: state => state.mapLoaded,
  networkUnknown: state => state.networkUnknown,
  zones: state => state.zones
}

// actions
const actions = {
  setContract ({ commit, state }, contract) {
    commit('setContract', contract)
  },
  setCurrentAddress ({ commit, state }, currentAddress) {
    commit('setCurrentAddress', currentAddress)
  },
  addZone ({ commit, state }, zone) {
    commit('addZone', zone)
  },
  setMapLoaded ({ commit, state }, status) {
    commit('setMapLoaded', status)
  },
  setNetworkUnknown ({ commit, state }, status) {
    commit('setNetworkUnknown', status)
  }
}

// mutations
const mutations = {
  setContract (state, contract) {
    state.contract = contract
  },
  setCurrentAddress (state, currentAddress) {
    state.currentAddress = currentAddress
  },
  addZone (state, zone) {
    state.zones.push(zone)
  },
  setMapLoaded (state, status) {
    state.mapLoaded = status
  },
  setNetworkUnknown (state, status) {
    state.networkUnknown = status
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
