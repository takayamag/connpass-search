import {
  cloneDeep
} from 'lodash-es'

import types from '@/store/mutation-types'
import initialState from '@/store/initialState/itemList'
import connpassApi from '@/api/connpassApi'

const namespaced = true

const state = cloneDeep(initialState)

const getters = {
  state: state => state,
  queryParams: state => state.queryParams,
  searchMode: state => state.searchMode,
  prefecture: state => state.prefecture,
  count: state => state.count,
  resultsReturned: state => state.resultsReturned,
  resultsAvailable: state => state.resultsAvailable,
  resultsStart: state => state.resultsStart
}

const actions = {
  setQueryParams ({ commit, state }, queryParams) {
    commit(types.SET_QUERY_PARAMS, { queryParams })
  },

  setPrefecture ({ commit, state }, payload) {
    commit(types.SET_PREFECTURE, payload.prefecture)
  },

  setSearchMode ({ commit, state }, payload) {
    commit(types.SET_SEARCH_MODE, payload.searchMode)
  },

  getEvents ({ commit, state }, payload) {
    commit(types.REQUEST_SEARCH_API)
    return connpassApi.getItems(payload.queryParams, payload.searchMode, payload.prefecture)
  },

  setItems ({ commit, state }, payload) {
    commit(types.RECEIVE_SEARCH_API_RESPONSE, payload)
  }
}

const mutations = {
  [types.SET_PREFECTURE] (state, payload) {
    state.prefecture = payload
  },

  [types.SET_SEARCH_MODE] (state, payload) {
    state.searchMode = payload
  },

  [types.SET_QUERY_PARAMS] (state, { queryParams }) {
    Object.assign(state.queryParams, queryParams)
  },

  [types.REQUEST_SEARCH_API] (state) {
    state.isLoading = true
  },

  [types.RECEIVE_SEARCH_API_RESPONSE] (state, payload) {
    state.isLoading = false
    Object.assign(state, {
      resultsReturned: payload.results_returned,
      resultsAvailable: payload.results_available,
      resultsStart: payload.results_start,
      events: payload.events
    })
  }
}

export default {
  namespaced,
  state,
  getters,
  actions,
  mutations
}
