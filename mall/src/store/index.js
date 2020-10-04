import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        comment: {},
        fromDetail: false,
        placeholder: '',
        placeholderList: [],
        index: 0,
        phtimer: '',
        phfn: '',
        fromWhere:''
    },
    mutations: {
        changeComment(state, payload) {
            state.comment = payload.comment;
        },
        changefD(state, payload) {
            state.fromDetail = payload.fromDetail;
        },
        changePh(state, payload) {
            state.placeholder = payload.placeholder;
        },
        initPHtimer(state, payload) {
            state.placeholderList = payload.placeholderList;
            state.placeholder = state.placeholderList[state.index];
            state.phfn = function () {
                state.placeholder = state.placeholderList[
                    state.index % state.placeholderList.length
                ];
                state.index++;
            }
            state.phtimer = setInterval(state.phfn, 3000);
        },
        phStop(state) {
            clearInterval(state.phtimer);
            state.phtimer = null;
        },
        phRestart(state) {
            state.phtimer = setInterval(state.phfn, 3000);
        },
        initFromWhere(state,payload){
            state.fromWhere = payload.path;
        }
    },
    actions: {
        changeComment({
            commit,
            state
        }, payload) {
            commit('changeComment', payload);
            commit('changefD', payload);
        },
        aboutComment({
            dispatch,
            commit
        }, payload) {
            dispatch('changeComment', payload).then(() => {
                setTimeout(() => {
                    commit('changefD', {
                        fromDetail: false
                    })
                }, 100000);
            })
        },
    },
    modules: {}
})