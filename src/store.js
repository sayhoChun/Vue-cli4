import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        count: 0,
        weight: 2,
        random : 0,
        regionList: null
    },
    mutations: {
        increment(state){
            state.count++
        },
        decrement(state){
            state.count--
        },
        successGenerateRandomNumber(state, payload){
            state.random = payload.num
        },
        failGenerateRandomNumber(state, /*payload*/){
            console.log("Connection Failed");
            state.random = 1234444
        },
        processRegion(state, payload){
            state.regionList = payload.data
        }
    },
    getters: {
        powCount(state, getters){
            return Math.pow(state.count, getters.weight);
        },
        weight(state, /*getters*/){
            return state.weight;
        },
        random(state, /*getters*/){
            return state.random
        },
        regionList(state, /*getters*/){
            return state.regionList
        }
    },
    actions: {
        generateRandomNumber({commit, /*state*/}, /*payload*/){
            console.log(arguments);
            axios.get(`http://localhost:4321/`)
                .then((res) => {
                    commit('successGenerateRandomNumber', res.data);
                })
                .catch((res) => {
                    commit('failGenerateRandomNumber', res);
                });
        },
        getRegion({commit, /*state*/}, /*payload*/){
            console.log(arguments);
            axios.get("http://106.10.33.215:10040/info/region")
                .then((res) =>{
                    commit("processRegion", res.data);
                })
                .catch((res) => {
                    commit("connectionFail", res);
                })
        }
    }
})

