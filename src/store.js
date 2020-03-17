import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import CONSTANTS from './Constants'

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        count: 0,
        weight: 2,
        random : 0,
        regionList: null,
        sidoList: null
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
        },
        processSido(state, payload){
            state.sidoList = payload.data
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
        },
        sidoList(state, /*getters*/){
            return state.sidoList
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
        loadRegion({commit, /*state*/}, /*payload*/){
            console.log(arguments);
            axios.get(CONSTANTS.API_URL + "/info/region")
                .then((res) =>{
                    commit("processRegion", res.data);
                })
                .catch((res) => {
                    commit("connectionFail", res);
                })
        },
        loadSido({commit, /*state*/}, payload){
            console.log(arguments);
            axios.get(CONSTANTS.API_URL + "/info/region/" + payload)
                .then((res) =>{
                    commit("processSido", res.data);
                })
                .catch((res) =>{
                    commit("connectionFail", res);
                })
        }
    },
})

