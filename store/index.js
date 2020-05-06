import Vue from 'vue'
import Vuex from 'vuex'
import axios from "axios";
import CONSTANTS from "../src/Constants";
import qs from 'qs';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        headerVisible: true,
        token: {
            id: null,
            name: null,
        },
        count: 0,
        weight: 2,
        random : 0,
        regionList: null,
        sidoList: null,
        userRegion: null,
        userSido: null
    },
    mutations: {
        increment: state => state.count++,
        decrement: state => state.count--,
        successGenerateRandomNumber: (state, payload) => state.random = payload.num,
        failGenerateRandomNumber: state => {
            console.log("Connection Failed");
            state.random = 1234444
        },
        processRegion: (state, payload) => state.regionList = payload.data,
        processSido: (state, payload) => state.sidoList = payload.data,
        setUserRegion: (state, payload) => state.userRegion = payload,
        setUserSido: (state, payload) => state.userSido = payload,
        setToken: (state, payload) => {
            state.token = payload;
            localStorage.setItem("token", JSON.stringify(payload));
            // localStorage.token = payload;
        },
        logout: (state) => {
            state.token = {id: null};
            delete localStorage.token;
        }
    },
    getters: {
        powCount: (state, getters) => Math.pow(state.count, getters.weight),
        weight: state => state.weight,
        random: state => state.random,
        regionList: state => state.regionList,
        sidoList: state => state.sidoList,
        userRegion: state => state.userRegion,
        userSido: state => state.userSido,
        getToken: state => state.token,
        isLoggedIn: state => !!state.token.id
    },
    actions: {
        checkLogin: ({commit}) => {
            if(localStorage.token != null) commit("setToken", JSON.parse(localStorage.getItem("token")));
        },
        login: ({commit, /*state*/}, payload) => {
            return axios.post(`${CONSTANTS.API_URL}/web/user/login`, qs.stringify(payload))
                .then(res => {
                    if(res.data["returnCode"] === 1){
                        commit("setToken", res.data.data);
                        return true;
                    }
                    else return false;
                })
                .catch(err => console.error(err));
        },
        logout: ({commit}) => {
            commit("logout");
        },
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
        loadRegion: ({commit, /*state*/}, /*payload*/) => {
            axios.get(`${CONSTANTS.API_URL}/info/region`)
                .then((res) =>{
                    commit("processRegion", res.data);
                })
                .catch((res) => {
                    commit("connectionFail", res);
                })
        },
        loadSido: ({commit, /*state*/}, payload) => {
            axios.get(`${CONSTANTS.API_URL}/info/region/${payload}`)
                .then((res) =>{
                    commit("processSido", res.data);
                })
                .catch((res) =>{
                    commit("connectionFail", res);
                })
        },
    },
})

