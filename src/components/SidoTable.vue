<template>
    <div class="SidoTable mx-auto">
        <b-table class="mt-3 mx-auto small" striped hover
                 :items="this.sidoList"
                 :fields="fields"
                 :busy.sync="sidoBusyFlag"
                 :primary-key="primaryKey"
                 @row-clicked="sidoClickHandler"
        >
            <template v-slot:table-busy>
                <div class="text-center text-danger my-2">
                    <b-spinner class="align-middle"></b-spinner>
                    <strong> Loading...</strong>
                </div>
            </template>
        </b-table>
    </div>
</template>

<script>
    import {mapState} from "vuex";

    export default {
        name: "test",
        data() {
            return{
                sidoBusyFlag: true,
                fields: [
                    {key: "gugunID", label: "ID"},
                    {key: "description", label: "지역"}
                ],
                primaryKey: "gugunID"
            }
        },
        created() {
            console.log(this.$store.state.userRegion);
        },
        mounted() {
            const promise = new Promise(((resolve, reject) => {
                if(this.$store.dispatch("loadSido", this.$route.params.id)){
                    resolve();
                }else{
                    reject(Error("connection Error"));
                }
            }));
            promise.then(() => {
                window.setTimeout(() => {
                    this.toggleBusy();
                }, 600)
            })
        },
        methods: {
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
