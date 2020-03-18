import Vue from 'vue'
import VueRouter from 'vue-router'


import Home from "../src/components/Home";
import TableView from "../src/components/TableView";
import SidoTable from "../src/components/SidoTable";

Vue.use(VueRouter);

export const router = new VueRouter({
    mode: "history",
    base: __dirname,
    routes: [
        {path: "/", redirect: "/home"},
        {path: "/home", component: Home},
        {
            path: '/region',
            component: TableView,
            children: [
                {
                    path: ":id",
                    name: "sido",
                    component: SidoTable
                }
            ]
        },
        // {
        //     path: '/sido/:id',
        //     component: SidoTable,
        //     props: true
        // }
    ]
});
