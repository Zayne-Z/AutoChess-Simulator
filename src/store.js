import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    races: [],
    heros: [],
    effect: [],
    battles: [],
    selectBattle: {}
  },
  mutations: {
    _setRaces: (state, datas) => {
      state.races = datas
    },
    _setHeros: (state, datas) => {
      state.heros = datas
    },
    _setEffect: (state, datas) => {
      state.effect = datas
    },
    _setBattles: (state, datas) => {
      state.battles = datas
    },
    _setSelectBattle: (state, data) => {
      state.selectBattle = data
    },
    _clearSelectBattle: (state) => {
      state.selectBattle = {}
    }
  },
  actions: {
    setRaces: (context, datas) => {
      context.commit('_setRaces', datas)
    },
    setHeros: (context, datas) => {
      context.commit('_setHeros', datas)
    },
    setEffect: (context, datas) => {
      context.commit('_setEffect', datas)
    },
    setBattles: (context, datas) => {
      context.commit('_setBattles', datas)
    },
    setSelectBattle: (context, data) => {
      context.commit('_setSelectBattle', data)
    },
    clearSelectBattle: (context) => {
      context.commit('_clearSelectBattle')
    }
  }
})

export default store
