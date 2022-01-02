import { createStore } from 'vuex'

// Create a new store instance.
const store = createStore({
  state () {
    return {
      user: {
        id: Number,
        name: '',
        highscore: Number
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
