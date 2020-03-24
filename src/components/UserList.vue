<template>
    <div class="mt-3 mx-auto">
        <b-table class="mx-auto small" striped hover id="userList"
                 :items="this.provider"
                 :fields="fields"
                 :busy.sync="isBusy"
                 :no-provider-sorting="true"
                 :sort-by.sync="sortBy"
                 :sort-desc.sync="sortDesc"
        >
            <template v-slot:cell(type)="data">
                {{data.value === "M" ? "인력" : "장비"}}
            </template>

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
    import axios from 'axios';
    import CONSTANTS from "../Constants";
    export default {
        name: "UserList",
        data(){
            return {
                isBusy: false,
                sortBy: "orderBy",
                sortDesc: false,
                primaryKey: "id",
                fields: [
                    {key: "id", sortable: true},
                    {key: "account", label: "계정", sortable: true},
                    {key: "name", label: "이름", sortable: true},
                    {key: "age", label: "나이",sortable: true},
                    {key: "phone", label: "전화번호",sortable: false},
                    {key: "type", label: "가입유형",sortable: false},
                    {key: "formattedDate", label: "등록일시",sortable: true}
                ]
            }
        },
        methods:{
            provider(){
                this.toggleBusy();
                let promise = axios.get(CONSTANTS.API_URL + "/admin/userList", {
                    params: {
                        page: 1,
                        limit: 20,
                        account: '',
                        phone: ''
                    }
                });
                return promise.then((res) => {
                    this.toggleBusy();
                    return res.data.data.list;
                }).catch(error => {
                    alert("error");
                    console.log(error);
                    return [];
                })
            },
            toggleBusy(){
                this.isBusy = !this.isBusy
            },
        }
    }
</script>

<style scoped>

</style>
