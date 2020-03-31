<template>
    <div class="w-75 mt-3 mx-auto text-sm-left">
        <b-form @submit="onSubmit">
            <b-form-group id="nameGroup" label="이름" label-for="name">
                <b-form-input
                        id="name"
                        v-model="form.name"
                        required
                        placeholder="Enter name"
                ></b-form-input>
            </b-form-group>

            <b-form-group id="regionGroup"
                          label="Your Name:"
                          label-for="region"
                          description="We'll never share your email with anyone else."
            >
                <div v-for="(item, index) in form.region" :key="item['sidoID']">
                    <b-form-select id="region" class="mt-1" v-model="selected[index][0]">
                        <option label="선택..." :value="null" selected></option>
                        <option v-for="region in regionList"
                                :key="region['sidoID']"
                                :value="region['sidoID']"
                        >{{region['abbreviation']}}</option>
                    </b-form-select>
<!--                    TODO-->
                    <b-form-select id="gugun" class="mt-1" v-model="selected[index][1]">
                        <option label="선택..." :value="null" selected></option>

                    </b-form-select>
                    {{index}}
                    {{selected[index]}}
                </div>

<!--                <b-form-input class="mt-1" v-for="item in form.region" :key="item['gugunID']"-->
<!--                        id="region"-->
<!--                        v-model="item['gugunTxt']"-->
<!--                        placeholder="Enter name"-->
<!--                ></b-form-input>-->
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
    import {mapState} from "vuex";

    export default {
        name: "UserDetail",
        data(){
            return {
                selected: [],
                form: {
                    id: null,
                    name: "",
                    type: "",
                    region: "",
                }
            }
        },
        mounted() {
            this.$store.dispatch("loadRegion");
            this.form.id = this.$route.params.id;
            this.provider(this.form.id);
        },
        watch: {
            $route(to, from){
                console.log(from);
                this.form.id = to.params.id;
                this.provider(this.form.id);
            }
        },
        methods:{
            provider(id){
                let promise = axios.get(CONSTANTS.API_URL + "/web/user/info/" + id);
                promise.then((res) => {
                    this.form.name = res.data.data["name"];
                    this.form.type = res.data.data["type"];
                    this.form.region = res.data.data["userRegion"];
                    this.form.region.forEach((item) => {
                       this.selected.push([item["sidoId"], item["gugunId"]]);
                    });
                }).catch(error => {
                    console.log(error);
                })
            },
            onSubmit(evt){
                evt.preventDefault();
            }
        },
        computed: {
            ...mapState([
                "regionList"
            ]),
        }
    }
</script>

<style scoped>

</style>
