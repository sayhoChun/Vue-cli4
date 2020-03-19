<template>
    <div class="w-75 mx-auto">
        <b-table class="mx-auto small" striped hover
                 :items="this.provider"
        >

        </b-table>
    </div>
</template>

<script>
    import axios from 'axios';
    import CONSTANTS from "../Constants";
    export default {
        name: "UserList",
        methods:{
            provider(){
                let promise = axios.get(CONSTANTS.API_URL + "/admin/userList", {
                    params: {
                        page: 1,
                        limit: 20,
                        account: '',
                        phone: ''
                    }
                });
                promise.then((res) => {
                    console.log(res.data)
                })
            }
        }
    }
</script>

<style scoped>

</style>