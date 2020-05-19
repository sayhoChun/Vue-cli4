<template>
    <b-container fluid="sm">
        <h2>Chat</h2>
        <hr class="my-3">
        <b-list-group>
            <b-list-group-item v-for="rowItem in this.chatList" href="#"
                               class="flex-column align-items-start"
                               v-bind:key="rowItem.id"
                               @click="onRowClick(rowItem.id)"
            >
                <div class="d-flex w-100 justify-content-between">
                    <h5 class="mb-1">{{rowItem.name}}</h5>
                    <small>{{rowItem["regDate"]}}</small>
                </div>
                <p class="mb-1">{{rowItem.type === 1 ? rowItem.content : '&lt;image&gt;'}}</p>
            </b-list-group-item>
        </b-list-group>
    </b-container>
</template>

<script>
    export default {
        name: "ChatList",
        data(){
            return{
                chatList: null
            }
        },
        mounted(){
            // TODO
            // let res = this.$authCheck();
            // console.log(res);
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
            }else this.provider();
        },
        methods:{
            provider(){
                let promise = this.$http.get(`${this.CONSTANTS.API_URL}/dummy/user/chat/rooms/${this.$store.getters.getToken.id}`);
                return promise.then(res => {this.chatList = res.data.data;})
                    .catch(err => {
                    this.$swal({
                        icon: "error",
                        title: "Oops ...",
                        text: err
                    }).then(res => {if(res) return []});
                })
            },
            onRowClick(id){
                const path = `/chatList/${id}`;
                if(this.$route.path !== path) this.$router.push(path);
            }
        }
    }
</script>

<style scoped>

</style>