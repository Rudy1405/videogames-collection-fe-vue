import { createStore } from 'vuex';

const store = createStore({
  state: {
    user: null,
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
  },
  actions: {
    loginUser({ commit }, user) {
      commit('setUser', user);
    },
  },
  getters: {
    isLoggedIn: (state) => !!state.user,
  },
});

export default store;
