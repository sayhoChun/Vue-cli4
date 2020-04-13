<template>
    <div>
        <b-navbar type="dark" variant="dark" fixed="top">
            <b-navbar-brand href="/">Home</b-navbar-brand>

            <b-collapse id="nav-collapse" is-nav>
                <b-navbar-nav>
                    <b-nav-item href="/region">Region</b-nav-item>
                    <b-nav-item href="/userList">UserList</b-nav-item>
                </b-navbar-nav>

                <!-- Right aligned nav items -->
                <b-navbar-nav class="ml-auto">
                    <b-nav-item v-if="!this.token.id" v-b-modal.modal-prevent-closing>Sign In</b-nav-item>

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


        <b-modal id="modal-prevent-closing" ref="modal" title="Sign In"
                @show="resetModal" @hidden="resetModal" @ok="handleOk"
        >
            <form ref="form" @submit.stop.prevent="handleSubmit">
                <b-form-group label="account" label-for="account-input" invalid-feedback="account is required">
                    <b-form-input id="account-input" v-model="account" required/>
                </b-form-group>
                <b-form-group label="password" label-for="password-input" invalid-feedback="password is required">
                    <b-form-input id="password-input" v-model="password" required/>
                </b-form-group>
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
                account: null,
                password: null,
            }
        },
        created() {

        },
        mounted() {
            console.log("mounted");
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
            handleSubmit(account, password){
                this.$store.dispatch("login", {
                    account: account,
                    password: password
                })
                .then(() => {
                    this.$nextTick(() => {
                        this.$bvModal.hide('modal-prevent-closing')
                    })
                })
                .catch(err => console.error(err));
            },
            signOut(){
                this.$store.dispatch("logout")
                .then(() => this.$router.push("/"));
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
