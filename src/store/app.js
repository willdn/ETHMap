const state = {
  contract: null,
  currentAddress: null,
  zones: []
}

// getters
const getters = {
  app: state => state,
  contract: state => state.contract,
  currentAddress: state => state.currentAddress,
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
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
