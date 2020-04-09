<template>
    <div class="w-75 mt-3 mx-auto text-sm-left">
        <div class="text-center mb-3 justify-content-between">
            <b-spinner v-if="this.spinnerStatus" variant="success" label="contentHidden" key="spinner" ref="spinner"></b-spinner>
        </div>
        <b-form v-if="!this.spinnerStatus" @submit="onSubmit">
            <b-form-group id="nameGroup" label="이름" label-for="name">
                <b-form-input id="name" v-model="form.name" required placeholder="Enter name"></b-form-input>
            </b-form-group>

            <b-form-group id="phoneGroup" label="전화번호" label-for="userPhone" description="- 없이 입력해주시기 바랍니다.">
                <b-form-input id="userPhone" type="number" v-model="form.phone" required placeholder="Enter phone number"></b-form-input>
            </b-form-group>

            <b-form-group id="regionGroup" label="지역 선택" label-for="region" description="복수 지역 선택 가능">
                <div v-for="(item, index) in form.regions" :key="item['sidoID']">
                    <b-form-select :id="'region' + index" class="mt-1 w-25" v-model="form.selected[index][0]" @change="onChange(index)" required>
                        <option label="선택..." :value="null"></option>
                        <option v-for="region in regionList"
                                :key="region['sidoID']"
                                :value="region['sidoID']"
                        >{{region['abbreviation']}}</option>
                    </b-form-select>
                    <b-form-select :id="'gugun' + index" class="mt-1 w-25 ml-3" v-model="form.selected[index][1]" required>
                        <option label="선택..." :value="null"></option>
                        <option v-for="gugun in gugunList[index]"
                                :key="gugun['gugunID']"
                                :value="gugun['gugunID']"
                        >{{gugun['description']}}</option>
                    </b-form-select>
                    <b-button class="mt-1 ml-3" variant="danger" @click="removeCurrentRegion(index)"> - </b-button>
                </div>
                <b-button variant="primary" @click="addNewRegion"> + </b-button>
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
                        v-model="form.type"
                        required
                ></b-form-select>
            </b-form-group>

            <b-button type="submit" variant="primary">
                <b-spinner small v-if="submitBtnSpinnerStat" variant="success"></b-spinner>
                Submit
            </b-button>
        </b-form>
    </div>
</template>

<script>
    import {mapState} from "vuex";

    export default {
        name: "UserDetail",
        data(){
            return {
                spinnerStatus: true,
                gugunList: [],
                form: {
                    id: null,
                    name: "",
                    phone: null,
                    type: "",
                    regions: [],
                    selected: [],
                    region: {
                        sidoId: null,
                        gugunId: null,
                        userId: null
                    }
                },
                submitBtnSpinnerStat: false
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
            render(res){
                this.form.name = res.data.data["name"];
                this.form.type = res.data.data["type"];
                this.form.regions = res.data.data["userRegion"];
                this.form.phone = res.data.data["phone"];
                let idx = 0;
                this.form.selected = [];
                this.form.regions.forEach(item => {
                    this.form.selected.push([item["sidoId"], item["gugunId"]]);
                    this.gugunListProvider(idx++);
                });
            },
            provider(id){
                this.spinnerStatus = true;
                let promise = this.$http.get(this.CONSTANTS.API_URL + "/web/user/info/" + id);
                promise.then(res => {
                    this.render(res);
                    this.spinnerStatus = false
                }).catch(error => {console.log(error)});
            },
            onChange(idx){
                this.gugunListProvider(idx);
                this.form.selected[idx][1] = null;
            },
            gugunListProvider(idx){
                this.$http.get(this.CONSTANTS.API_URL + "/info/region/" + this.form.selected[idx][0])
                .then(res => {
                    this.$set(this.gugunList, idx, res.data.data);
                    return true;
                }).catch(error => {console.log(error)});
            },
            addNewRegion(){
                this.form.regions.push(this.Vue.util.extend({}, this.form.region));
                this.form.selected.push([null, null]);
            },
            removeCurrentRegion(index){
                const removeItem = (items, idx) => items.slice(0, idx).concat(items.slice(idx + 1, items.length));
                this.form.regions = removeItem(this.form.regions, index);
                this.form.selected = removeItem(this.form.selected, index);
            },
            onSubmit(evt){
                evt.preventDefault();
                this.submitBtnSpinnerStat = true;
                this.$http.post(this.CONSTANTS.API_URL + "/dummy/user/update/info/" + this.form.id, this.qs.stringify({
                    name: this.form.name,
                    phone: this.form.phone,
                    selected: JSON.stringify(this.form.selected),
                    type: this.form.type
                }))
                .then(res => {
                    if(res.data["returnCode"] === 1){
                        this.render(res);
                        this.$swal({
                            icon: "success",
                            title: "Success",
                            text: "저장되었습니다."
                        })
                    }
                    else{
                        this.$swal({
                            icon: "error",
                            title: "Oops...",
                            text: res.data["returnMessage"]
                        }).then(res => {
                            if(res.value) this.$router.go(0);
                        });
                    }
                    this.submitBtnSpinnerStat = false;
                }).catch(err => {
                    this.$swal({
                        icon: "error",
                        title: "Oops ...",
                        text: err
                    }).then(res => {
                        if(res.value) this.$router.go(0);
                    });
                });
            }
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
