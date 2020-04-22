import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from "../src/components/Home";
import TableView from "../src/components/TableView";
import SidoTable from "../src/components/SidoTable";
import UserList from "../src/components/UserList";
import UserDetail from "../src/components/UserDetail";
import ChatList from "../src/components/ChatList";

Vue.use(VueRouter);

export const router = new VueRouter({
    mode: "history",
    base: __dirname,
    routes: [
        {path: "/", redirect: "/home"},
        {path: "/home", component: Home},
        {path: '/region', component: TableView},
        {path: "/region/:id", name: "sido", component: SidoTable},
        {
            path: "/userList",
            name: "userList",
            component: UserList,
            children: [
                {path: "detail/:id", name: "userDetail", component: UserDetail}
            ]
        },
        {
            path: "/chatList",
            name: "chatList",
            component: ChatList
        }
    ]
});
