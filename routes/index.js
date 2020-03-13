import Vue from 'vue'
import VueRouter from 'vue-router'
import App from "../src/App"

Vue.use(VueRouter);

export const router = new VueRouter({
    routes: [
        {
            path: '/',
            component: App
        },
        {
            path: '/news',
            component: App
        }
    ]
})
