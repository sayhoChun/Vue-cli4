<template>
    <div class="w-75 mt-3 mx-auto text-sm-left">
        <div class="text-center mb-3 justify-content-between">
            <b-spinner v-if="this.spinnerStatus" variant="success" label="contentHidden" key="spinner" ref="spinner">
            </b-spinner>
        </div>

        <b-form v-if="!this.spinnerStatus" @submit="onSubmit">
            <b-form-group id="nameGroup" label="이름" label-for="name">
                <b-form-input id="name" v-model="form.name" required placeholder="Enter name">
                </b-form-input>
            </b-form-group>

            <b-form-group id="regionGroup" label="지역 선택" label-for="region" description="We'll never share your email with anyone else.">
                <div v-for="(item, index) in form.region" :key="item['sidoID']">
                    <b-form-select :id="'region' + index" class="mt-1 w-25" v-model="selected[index][0]" @change="onChange(index)">
                        <option label="선택..." :value="null" selected></option>
                        <option v-for="region in regionList"
                                :key="region['sidoID']"
                                :value="region['sidoID']"
                        >{{region['abbreviation']}}</option>
                    </b-form-select>
                    <b-form-select :id="'gugun' + index" class="mt-1 w-25 ml-3" v-model="selected[index][1]">
                        <option label="선택..." :value="null" selected></option>
                        <option v-for="gugun in gugunList[index]"
                                :key="gugun['gugunID']"
                                :value="gugun['gugunID']"
                        >{{gugun['description']}}</option>
                    </b-form-select>
                    <b-button class="mt-3 ml-3" variant="danger"> - </b-button>
<!--                    {{index}}-->
<!--                    {{selected[index]}}-->
                </div>
                <b-button variant="primary"> + </b-button>
            </b-form-group>

            <b-form-group id="input-group-1" label="Account" label-for="typeSelect">
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
                        required
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
                spinnerStatus: true,
                selected: [],
                gugunList: [],
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
                this.spinnerStatus = true;
                let promise = axios.get(CONSTANTS.API_URL + "/web/user/info/" + id);
                promise.then(res => {
                    this.form.name = res.data.data["name"];
                    this.form.type = res.data.data["type"];
                    this.form.region = res.data.data["userRegion"];
                    let idx = 0;
                    this.form.region.forEach(item => {
                       this.selected.push([item["sidoId"], item["gugunId"]]);
                       this.gugunListProvider(idx++);
                       this.spinnerStatus = false
                    });
                }).catch(error => {console.log(error)});
            },
            onChange(idx){
                this.gugunListProvider(idx);
                this.selected[idx][1] = null;
            },
            gugunListProvider(idx){
                axios.get(CONSTANTS.API_URL + "/info/region/" + this.selected[idx][0])
                .then(res => {
                    this.$set(this.gugunList, idx, res.data.data);
                    return true;
                }).catch(error => {console.log(error)});
            },
            onSubmit(evt){
                evt.preventDefault();
            },
        },
        computed: {
            ...mapState([
                "regionList"
            ])
        }
    }
</script>

<style scoped>

</style>
