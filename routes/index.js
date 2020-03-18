import Vue from 'vue'
import VueRouter from 'vue-router'
import TableView from "../src/components/TableView";
import SidoTable from "../src/components/SidoTable";

Vue.use(VueRouter);

export const router = new VueRouter({
    mode: "history",
    base: __dirname,
    routes: [
        {
            path: '/region',
            component: TableView,
            children: [
                {
                    path: ":id/sido",
                    name: "sido",
                    component: SidoTable
                }
            ],
            // meta: {
            //     requiresGuest: true
            // }
        },
        // {
        //     path: '/sido/:id',
        //     component: SidoTable,
        //     props: true
        // }
    ]
});
