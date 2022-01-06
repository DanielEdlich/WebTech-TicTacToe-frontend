import { createStore } from 'vuex'

// Create a new store instance.
const store = createStore({
  state () {
    return {
      user: {
        id: NaN,
        name: '',
        highscore: NaN
      }
    }
  },
  getters: {},
  mutations: {
    setUser (state, user) {
      state.user.id = user.id
      state.user.name = user.name
      state.user.highscore = user.highscore
    }
  },
  actions: {}
})

export default store
