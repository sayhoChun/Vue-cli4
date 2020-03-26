<template>
    <div class="w-75 mt-3 mx-auto text-sm-left">
        <b-form @submit="onSubmit">
            <b-form-group id="name" label="Your Name:" label-for="name">
                <b-form-input
                        id="name"
                        v-model="form.name"
                        required
                        placeholder="Enter name"
                ></b-form-input>
            </b-form-group>

            <b-form-group id="input-group-2"
                          label="Your Name:"
                          label-for="input-2"
                          description="We'll never share your email with anyone else."
            >
                <b-form-input
                        id="input-2"
                        v-model="form.region"
                        required
                        placeholder="Enter name"
                ></b-form-input>
            </b-form-group>

            <b-form-group id="input-group-1"
                    label="Account"
                    label-for="typeSelect"
            >
                <b-form-select
                        id="typeSelect"
                        class="mb-2 mr-sm-2 mb-sm-0"
                        :options="[
                            {text: '선택...', value: null},
                            {text: '장비회원', value: 'G'},
                            {text: '인력회원', value: 'M'},
                            {text: '구인회원', value: 'N'}
                        ]"
                        :value="this.form.type"
                ></b-form-select>
            </b-form-group>

            <b-button type="submit" variant="primary">Submit</b-button>
            <b-button type="reset" variant="danger">Reset</b-button>
        </b-form>
    </div>
</template>

<script>
    import axios from 'axios';
    import CONSTANTS from "../Constants";

    export default {
        name: "UserDetail",
        data(){
            return {
                form: {
                    id: null,
                    name: "",
                    type: "",
                    region: "",
                }
            }
        },
        mounted() {
            this.form.id = this.$route.params.id
            this.provider();
        },
        methods:{
            provider(){
                let promise = axios.get(CONSTANTS.API_URL + "/web/user/info/" + this.$route.params.id);
                promise.then((res) => {
                    this.form.name = res.data.data["name"];
                    this.form.type = res.data.data["type"];
                    this.form.region = res.data.data["userRegion"];
                }).catch(error => {
                    console.log(error);
                })
            },
            onSubmit(evt){
                evt.preventDefault();
            }
        }
    }
</script>

<style scoped>

</style>
