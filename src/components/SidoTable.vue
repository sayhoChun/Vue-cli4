<template>
    <div class="SidoTable">
        <b-table class="mt-3 mx-auto small" striped hover
                 :responsive="true"
                 :items="this.sidoList"
                 :busy.sync="sidoBusyFlag"
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
        props: ["id"],
        data() {
            return{
                sidoBusyFlag: false,
                fields: [

                ]
            }
        },
        created() {
            console.log("SIDOTABLE");
            console.log(this.prop)
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
                }, 400)
            })
        },
        methods: {
            toggleBusy(){
                this.sidoBusyFlag = !this.sidoBusyFlag
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
