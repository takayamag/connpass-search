import Vue from 'vue'
import Vuex from 'vuex'
import event from '@/store/modules/event'

Vue.use(Vuex)

const mode = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    event
  },
  strict: mode,
  plugins: []
})
