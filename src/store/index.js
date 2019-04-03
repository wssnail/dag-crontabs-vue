import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import user from './modules/user'
import getters from './getters'

import dagStore from './modules/dagStore';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    app,
    user,
    dagStore
  },
  getters
});

export default store
