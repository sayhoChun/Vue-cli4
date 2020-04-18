<template>
    <b-container fluid="md" class="mt-3 mx-auto">
        <router-view class="view"></router-view>

        <b-form inline class="mt-3 mb-2" @submit="onSubmit">
            <label class="sr-only" for="account">account</label>
            <b-input id="account"
                     class="mb-2 mr-sm-2 mb-sm-0"
                     v-model="form.searchAccount"
                    placeholder="계정"
            ></b-input>

            <label class="sr-only" for="phone">phone</label>
            <b-input id="phone"
                     class="mb-2 mr-sm-2 mb-sm-0"
                     v-model="form.searchPhone"
                     placeholder="전화번호"
            ></b-input>
            <b-button type="submit" class="ml-2" variant="primary">Search</b-button>
        </b-form>
        <b-table class="mx-auto small" striped hover
                 id="userList"
                 :items="this.provider"
                 :fields="fields"
                 :busy.sync="isBusy"
                 :no-provider-sorting="true"
                 :sort-by.sync="sortBy"
                 :sort-desc.sync="sortDesc"
                 :per-page="perPage"
                 :current-page="currentPage"
                 @row-clicked="rowClickHandler"
                 fixed responsive="md"
        >
            <template v-slot:cell(type)="data">
                {{data.value === "M" ? "인력" : "장비"}}
            </template>

            <template v-slot:table-busy>
                <div class="text-center text-primary my-2">
                    <b-spinner class="align-middle"/>
                    <strong> Loading...</strong>
                </div>
            </template>
        </b-table>

        <b-pagination
                v-model="currentPage"
                :total-rows="rows"
                :per-page="perPage"
                aria-controls="my-table"
                first-text="First"
                prev-text="<"
                next-text=">"
                last-text="Last"
                size="sm"
        />
    </b-container>
</template>

<script>
    export default {
        name: "UserList",
        data(){
            return {
                isBusy: false,
                sortBy: "orderBy",
                sortDesc: false,
                primaryKey: "id",
                fields: [
                    {key: "id", sortable: true, thStyle: {width: "3rem"}},
                    {key: "account", label: "계정", sortable: true, thStyle: {width: "7rem"},},
                    {key: "name", label: "이름", sortable: true, thStyle: {width: "7rem"},},
                    {key: "age", label: "나이",sortable: true, thStyle: {width: "4rem"},},
                    {key: "phone", label: "전화번호",sortable: false, thStyle: {width: "7rem"},},
                    {key: "type", label: "가입유형",sortable: false, thStyle: {width: "5rem"},},
                    {key: "formattedDate", label: "등록일시",sortable: true, thStyle: {width: "10rem"},}
                ],
                rows: 0,
                perPage: 20,
                currentPage: 1,
                form: {
                    searchAccount: "",
                    searchPhone: ""
                }
            }
        },
        mounted() {
            if(!this.$store.getters.isLoggedIn){
                this.$swal({
                    text: "로그인 후 이용 바랍니다.",
                    icon: 'warning',
                    backdrop: "#696969",
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                }).then((result) => {
                    if(result.value){
                        this.$router.push("/");
                    }
                })
            }
        },
        methods:{
            provider(ctx){
                this.toggleBusy();
                let promise = this.$http.get(`${this.CONSTANTS.API_URL}/admin/userList`, {
                    params: {
                        page: ctx.currentPage,
                        limit: ctx.perPage,
                        account: this.form.searchAccount,
                        phone: this.form.searchPhone
                    }
                });
                return promise.then((res) => {
                    this.toggleBusy();
                    this.rows = res.data.data["pageInfo"]["totalRow"];
                    return res.data.data.list;
                }).catch(err => {
                    this.$swal({
                        icon: "error",
                        title: "Oops ...",
                        text: err
                    }).then(res => {if(res) return []});
                })
            },
            toggleBusy(){
                this.isBusy = !this.isBusy
            },
            onSubmit(evt){
                evt.preventDefault();
                this.$root.$emit('bv::refresh::table', 'userList')
            },
            rowClickHandler(record){
                const path = `/userList/detail/${record["id"]}`;
                if(this.$route.path !== path) this.$router.push(path);
                window.scrollTo({
                    top: 0,
                    left: 0,
                    behavior: 'smooth'
                });
            }
        }
    }
</script>

<style scoped>

</style>
