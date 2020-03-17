<template>
  <div class="hello">
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

    <b-table class="mt-3" striped hover :items="this.regionList"></b-table>
  </div>
</template>

<script>
  import { mapState, mapGetters, mapMutations, mapActions} from "vuex";
  export default {
    name: 'HelloWorld',
    data () {
      return {}
    },
    created: function (){
      console.log(this.$store)
    },
    mounted(){
      this.$store.dispatch("getRegion");
    },
    methods: {
      ...mapMutations({
        increment: "increment",
        decrement: "decrement"
      }),
      ...mapActions({
        randomNumber: "generateRandomNumber"
      }),
    },
    computed: {
      ...mapState([
              "count",
              "regionList"
      ]),
      ...mapGetters([
              "powCount",
              "random"
      ])
    }
  }
</script>

<style scoped>
</style>
