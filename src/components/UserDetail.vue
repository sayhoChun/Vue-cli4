<template>
    <b-container fluid="sm" class="mt-3 mx-auto mb-5 text-sm-left">
        <div class="text-center mb-3 justify-content-between">
            <b-spinner v-if="this.spinnerStatus" variant="success" label="contentHidden" key="spinner" ref="spinner"/>
        </div>
        <b-form v-if="!this.spinnerStatus" @submit="onSubmit">
            <b-form-group id="nameGroup" label="이름" label-for="name">
                <b-form-input id="name" v-model="form.name" required placeholder="Enter name"/>
            </b-form-group>

            <b-form-group id="accountGroup" label="계정" label-for="account">
                <b-form-input id="accunt" v-model="form.account" required placeholder="Enter account"/>
            </b-form-group>

            <b-form-group id="phoneGroup" label="전화번호" label-for="userPhone" description="- 없이 입력해주시기 바랍니다.">
                <b-form-input id="userPhone" type="number" v-model="form.phone" required placeholder="Enter phone number"/>
            </b-form-group>

            <b-form-group id="regionGroup" label="지역 선택" label-for="region" description="복수 지역 선택 가능">
                <b-container fluid="sm" class="mb-1" v-for="(item, index) in form.userRegion" :key="item['sidoID']">
                    <b-row>
                        <b-col cols="5" md="3" class="p-1">
                            <b-form-select class="mt-1"
                                           :id="`region${index}`"
                                           v-model="form.selected[index][0]"
                                           @change="onChange(index)" required
                            >
                                <option label="시/도 선택..." :value="null"/>
                                <option v-for="region in regionList" :key="region['sidoID']" :value="region['sidoID']">
                                    {{region['abbreviation']}}
                                </option>
                            </b-form-select>
                        </b-col>
                        <b-col cols="5" md="3" class="p-1">
                            <b-form-select :id="`gugun${index}`" class="mt-1" v-model="form.selected[index][1]" required>
                                <option label="구/군 선택..." :value="null"/>
                                <option v-for="gugun in gugunList[index]" :key="gugun['gugunID']" :value="gugun['gugunID']">
                                    {{gugun['description']}}
                                </option>
                            </b-form-select>
                        </b-col>
                        <b-col cols="2" md="6" class="p-1">
                            <b-button class="mt-1" variant="danger" @click="removeCurrentRegion(index)"> - </b-button>
                        </b-col>
                    </b-row>
                </b-container>
                <b-button variant="primary" class="mt-sm-2" @click="addNewRegion"> + </b-button>
            </b-form-group>

            <b-form-group id="input-group-1" label-cols="3" label-cols-lg="1" label="회원 타입" label-for="typeSelect">
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
                />
            </b-form-group>

            <b-form-group id="pushFlagGroup" label-cols="3" label-cols-lg="1" label="알림 수신" label-for="pushFlag">
                <b-form-checkbox id="pushFlag" class="mt-1" v-model="form.pushFlag" name="check-button" switch size="lg"/>
            </b-form-group>

            <b-button type="submit" variant="success">
                <b-spinner small v-if="submitBtnSpinnerStat" variant="success"/>
                Submit
            </b-button>
        </b-form>
    </b-container>
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
                    account: null,
                    name: "",
                    phone: null,
                    type: "",
                    userRegion: [],
                    selected: [],
                    region: {
                        sidoId: null,
                        gugunId: null,
                        userId: null
                    },
                    pushFlag: null
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
                this.form = res.data.data;
                this.form.pushFlag = res.data.data["pushFlag"] === 1;
                let idx = 0;
                this.form.selected = [];
                this.form.userRegion.forEach(item => {
                    this.form.selected.push([item["sidoId"], item["gugunId"]]);
                    this.gugunListProvider(idx++);
                });
            },
            provider(id){
                this.spinnerStatus = true;
                let promise = this.$http.get(`${this.CONSTANTS.API_URL}/web/user/info/${id}`);
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
                this.$http.get( `${this.CONSTANTS.API_URL}/info/region/${this.form.selected[idx][0]}`)
                .then(res => {
                    this.$set(this.gugunList, idx, res.data.data);
                    return true;
                }).catch(error => {console.log(error)});
            },
            addNewRegion(){
                this.form.userRegion.push(this.Vue.util.extend({}, this.form.region));
                this.form.selected.push([null, null]);
            },
            removeCurrentRegion(index){
                const removeItem = (items, idx) => items.slice(0, idx).concat(items.slice(idx + 1, items.length));
                this.form.userRegion = removeItem(this.form.userRegion, index);
                this.form.selected = removeItem(this.form.selected, index);
            },
            onSubmit(evt){
                evt.preventDefault();
                this.submitBtnSpinnerStat = true;
                this.$http.post(`${this.CONSTANTS.API_URL}/dummy/user/update/info/${this.form.id}`, this.qs.stringify({
                    name: this.form.name,
                    account: this.form.account,
                    phone: this.form.phone,
                    selected: JSON.stringify(this.form.selected),
                    type: this.form.type,
                    pushFlag: this.form.pushFlag === true ? 1 : 0
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
