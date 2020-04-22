<template>
    <div>
        <b-navbar type="dark" variant="dark" fixed="top">
            <b-navbar-brand href="/">Home</b-navbar-brand>

            <b-collapse id="nav-collapse" is-nav>
                <b-navbar-nav>
                    <b-nav-item href="/region">Region</b-nav-item>
                    <b-nav-item href="/userList">UserList</b-nav-item>
                    <b-nav-item href="/chatList">ChatList</b-nav-item>
                </b-navbar-nav>

                <!-- Right aligned nav items -->
                <b-navbar-nav class="ml-auto">
                    <b-nav-item v-if="!this.token.id" @click="showModal = !showModal">Sign In</b-nav-item>

                    <b-nav-item-dropdown v-if="this.token.id" right>
                        <template v-slot:button-content>
                                <b-icon-person-fill/>
                                {{$store.state.token.name}}
                        </template>
                        <b-dropdown-item @click="signOut">Sign Out</b-dropdown-item>
                    </b-nav-item-dropdown>
                </b-navbar-nav>
            </b-collapse>
        </b-navbar>

        <b-modal id="signInModal" ref="modal" title="Sign In" v-model="showModal" @show="resetModal" @hidden="resetModal" @ok="handleOk" hide-footer>
            <form ref="form" @submit.stop.prevent="handleSubmit">
                <b-form-group label="account" label-for="account-input" invalid-feedback="account is required">
                    <b-form-input id="account-input" v-model="account" @keydown.native.enter="handleEnter" ref="signInAccount" autofocus required/>
                </b-form-group>
                <b-form-group label="password" label-for="password-input" invalid-feedback="password is required">
                    <b-form-input type="password" id="password-input" v-model="password" @keydown.native.enter="handleEnter" required/>
                </b-form-group>
                <div class="mt-5 float-right">
                    <b-button @click="showModal = !showModal">cancel</b-button>
                    <b-button class="ml-2" @click="handleOk" variant="primary" ref="loginBtn">
                        <b-spinner class="mr-1" small v-if="signInSpinnerStatus"></b-spinner>
                        <span v-if="signInSpinnerStatus">Loading...</span>
                        <span v-if="!signInSpinnerStatus">login</span>
                    </b-button>
                </div>
            </form>

        </b-modal>
    </div>
</template>

<script>
    import {mapActions, mapState, mapGetters} from 'vuex';

    export default {
        name: "Header",
        data() {
            return {
                signInSpinnerStatus: false,
                showModal: false,
                account: null,
                password: null,
            }
        },
        created() {

        },
        mounted() {
            this.$store.dispatch("checkLogin");
        },
        updated() {

        },
        methods: {
            ...mapActions(["login"]),
            resetModal(){
                this.account = null;
                this.password = null;
            },
            handleOk(bvModalEvt){
                bvModalEvt.preventDefault();
                this.handleSubmit(this.account, this.password);
            },
            handleEnter(){
                this.$refs.loginBtn.click();
            },
            handleSubmit(account, password){
                this.signInSpinnerStatus = true;
                this.$store.dispatch("login", {account: account, password: password})
                    .then(res => {
                        this.signInSpinnerStatus = false;
                        if(res){
                            this.showModal = false;
                            const toast = this.$swal.mixin({
                                toast: true,
                                position: 'top-right',
                                showConfirmButton: false,
                                timer: 2000,
                                timerProgressBar: true,
                                onOpen: (toast) => {
                                    toast.addEventListener('mouseenter', this.$swal.stopTimer);
                                    toast.addEventListener('mouseleave', this.$swal.resumeTimer);
                                }
                            });
                            toast.fire({icon: "success", title: "로그인되었습니다."});
                        }
                        else {
                            const toast = this.$swal.mixin({toast: true, position: 'center', showConfirmButton: false, timer: 1000});
                            toast.fire({icon: "error", title: "일치하는 정보가 없습니다."});
                        }
                    })
                    .catch(err => console.error(err));
            },
            signOut(){
                this.$store.dispatch("logout")
                    .then(() => {
                        this.$swal({
                            text: "로그아웃 되었습니다.",
                            icon: "info"
                        }).then(() => {
                            const path = "/home";
                            console.log(this.$route.path);
                            if(this.$route.path !== path) this.$router.push(path);
                        });
                    });
            }
        },
        computed: {
            ...mapState([
                "token"
            ]),
            ...mapGetters([
                "getToken"
            ])
        }
    }
</script>

<style scoped>

</style>
