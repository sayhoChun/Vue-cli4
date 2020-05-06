import Vue from 'vue'
import VueRouter from 'vue-router'

// import Home from "../src/components/Home";
// import TableView from "../src/components/TableView";
// import SidoTable from "../src/components/SidoTable";
// import UserList from "../src/components/UserList";
// import UserDetail from "../src/components/UserDetail";
// import ChatList from "../src/components/ChatList";
// import Chat from "../src/components/Chat";

function loadView(view) {
    return () => import(/* webpackChunkName: "view-[request]" */ `@/components/${view}.vue`)
}

Vue.use(VueRouter);

export const router = new VueRouter({
    mode: "history",
    base: __dirname,
    routes: [
        {path: "/", redirect: "/home"},
        {path: "/home", component: loadView("Home")},
        {path: '/region', component: loadView("TableView")},
        {path: "/region/:id", name: "sido", component: loadView("SidoTable")},
        {
            path: "/userList",
            name: "userList",
            component: loadView("UserList"),
            children: [
                {path: "detail/:id", name: "userDetail", component: loadView("UserDetail")}
            ]
        },
        {path: "/chatList", name: "chatList", component: loadView("ChatList")},
        {path: "/chatList/:id", name: "chat", component: loadView("Chat")}
    ]
});
