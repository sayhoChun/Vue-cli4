<template>
    <b-container fluid="sm" class="mx-auto text-center">
        <img alt="Vue logo" src="../assets/logo.png" class="mt-5">
        <b-list-group>
            <b-list-group-item>
                count
                <b-badge variant="primary" pill>{{this.count}}</b-badge>
            </b-list-group-item>
            <b-list-group-item>x
                count^2
                <b-badge variant="primary" pill>{{this.powCount}}</b-badge>
            </b-list-group-item>
            <b-list-group-item>
                random
                <b-badge variant="primary" pill>{{this.random}}</b-badge>
            </b-list-group-item>
        </b-list-group>
        <b-button-group class="mt-3">
            <b-button variant="success" @click="this.increment">increment</b-button>
            <b-button variant="danger" @click="this.decrement">decrement</b-button>
            <b-button variant="info" @click="this.randomNumber">random</b-button>
        </b-button-group>

        <b-list-group id="mixin" class="text-center mt-3">
            <b-list-group-item variant="primary" id="sub" @click="onClick" @contextmenu.prevent="onRightClick">
                {{data}}
            </b-list-group-item>
        </b-list-group>

        <b-list-group class="text-center mt-3">
            <b-list-group-item to="/region" variant="dark">Region</b-list-group-item>
            <b-list-group-item :to="{name: 'sido', params: {id: '1'}}" variant="dark">Sido</b-list-group-item>
            <b-list-group-item v-if="this.userRegion" variant="warning">{{this.userRegion + "::" + this.userSido}}</b-list-group-item>
            <b-list-group-item :to="{name: 'userList'}" variant="success">UserList</b-list-group-item>
        </b-list-group>
    </b-container>
</template>

<script>
    import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
    import mixin from "../components/mixin/mixin";
    export default {
        mixins: [mixin],
        name: 'Home',
        components: {
            // TableView: TableView
        },
        created() {
        },
        data: function(){
            return {
                data: 10 + this.weight
            }
        },
        methods: {
            ...mapMutations({
                increment: "increment",
                decrement: "decrement"
            }),
            ...mapActions({
                randomNumber: "generateRandomNumber"
            }),
            onRightClick(){
                this.data--;
            }
        },
        computed: {
            ...mapState([
                "count",
            ]),
            ...mapGetters([
                "powCount",
                "random",
                "userRegion",
                "userSido"
            ])
        }
    }
</script>

<style scoped>
</style>
