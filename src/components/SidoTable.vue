<template>
    <div class="SidoTable mx-auto w-50">
        <b-table class="mt-3 mx-auto small" striped hover
                 :items="this.provider"
                 :fields="fields"
                 :no-provider-sorting="true"
                 :busy.sync="sidoBusyFlag"
                 :sort-by.sync="sortBy"
                 :sort-desc.sync="sortDesc"
                 :primary-key="primaryKey"
                 @row-clicked="sidoClickHandler"
        >
            <template v-slot:table-busy>
                <div class="text-center text-primary my-2">
                    <b-spinner class="align-middle"></b-spinner>
                    <strong> Loading...</strong>
                </div>
            </template>
        </b-table>
    </div>
</template>

<script>
    import {mapState} from "vuex";
    import axios from 'axios';
    import CONSTANTS from "../Constants";

    export default {
        name: "sidoTable",
        data() {
            return{
                sidoBusyFlag: false,
                fields: [
                    {key: "gugunID", label: "ID", sortable: true},
                    {key: "description", label: "지역", sortable: true}
                ],
                primaryKey: "gugunID",
                sortBy: "gugunID",
                sortDesc: false
            }
        },
        created() {
            console.log(this.$store.state.userRegion);
        },
        mounted() {
            // const promise = new Promise(((resolve, reject) => {
            //     if(this.$store.dispatch("loadSido", this.$route.params.id)){
            //         resolve();
            //     }else{
            //         reject(Error("connection Error"));
            //     }
            // }));
            // promise.then(() => {
            //     window.setTimeout(() => {
            //         this.toggleBusy();
            //     }, 600)
            // })
        },
        methods: {
            provider(){
                this.toggleBusy();
                let promise = axios.get(CONSTANTS.API_URL + "/info/region/" + this.$route.params.id);
                return promise.then((res) => {
                    this.toggleBusy();
                    return res.data.data
                });
            },
            toggleBusy(){
                this.sidoBusyFlag = !this.sidoBusyFlag
            },
            sidoClickHandler(record){
                console.log(record["gugunID"]);
                this.$store.commit("setUserSido", record["gugunID"]);
                window.setTimeout(() => {
                    this.$router.replace("/home");
                }, 200);
            }
        },
        computed: {
            ...mapState([
                "sidoList"
            ])
        }
    }
</script>

<style scoped>

</style>
