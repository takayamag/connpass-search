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
  resultsReturned: state => state.resultsReturned, // 含まれる検索結果の件数
  resultsAvailable: state => state.resultsAvailable, // 検索結果の総件数
  resultsStart: state => state.resultsStart // 検索の開始位置
}

const actions = {
  setQueryParams ({ commit }, queryParams) {
    commit(types.SET_QUERY_PARAMS, { queryParams })
  },

  setPrefecture ({ commit }, payload) {
    commit(types.SET_PREFECTURE, payload.prefecture)
  },

  setSearchMode ({ commit }, payload) {
    commit(types.SET_SEARCH_MODE, payload.searchMode)
  },

  setItems ({ commit }, payload) {
    commit(types.RECEIVE_SEARCH_API_RESPONSE, payload)
  },

  getEvents ({ commit }, payload) {
    commit(types.REQUEST_SEARCH_API)
    return connpassApi.getItems(
      payload.queryParams,
      payload.searchMode,
      payload.prefecture
    )
  }
}

const mutations = {
  [types.SET_QUERY_PARAMS] (state, { queryParams }) {
    Object.assign(state.queryParams, queryParams)
  },

  [types.SET_PREFECTURE] (state, payload) {
    state.prefecture = payload
  },

  [types.SET_SEARCH_MODE] (state, payload) {
    state.searchMode = payload
  },

  [types.RECEIVE_SEARCH_API_RESPONSE] (state, payload) {
    state.isLoading = false
    Object.assign(state, {
      resultsReturned: payload.results_returned,
      resultsAvailable: payload.results_available,
      resultsStart: payload.results_start,
      events: payload.events // 検索結果のイベントリスト(配列)
    })
  },

  [types.REQUEST_SEARCH_API] (state) {
    state.isLoading = true
  }
}

export default {
  namespaced,
  state,
  getters,
  actions,
  mutations
}
