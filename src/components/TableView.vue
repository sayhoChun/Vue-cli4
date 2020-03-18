<template>
  <div class="hello w-75 mx-auto">
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

    <div>
      <b-table class="mt-3 mx-auto small"  striped hover
               :responsive="true"
               :items="this.regionList"
               :busy.sync="regionBusyFlag"
               :fields="fields"
               :primary-key="primaryKey"
               @row-clicked="regionClickHandler"
      >
        <template v-slot:table-busy>
          <div class="text-center text-danger my-2">
            <b-spinner class="align-middle"></b-spinner>
            <strong> Loading...</strong>
          </div>
        </template>
      </b-table>

<!--      <b-table class="mt-3 mx-auto small" striped hover-->
<!--               :responsive="true"-->
<!--               :items="this.sidoList"-->
<!--               :busy.sync="sidoBusyFlag"-->
<!--      >-->
<!--        <template v-slot:table-busy>-->
<!--          <div class="text-center text-danger my-2">-->
<!--            <b-spinner class="align-middle"></b-spinner>-->
<!--            <strong> Loading...</strong>-->
<!--          </div>-->
<!--        </template>-->
<!--      </b-table>-->
    </div>
  </div>
</template>

<script>
  import { mapState, mapGetters, mapMutations, mapActions} from "vuex";
  export default {
    name: 'HelloWorld',
    data () {
      return {
        regionBusyFlag: true,
        sidoBusyFlag: false,
        fields: [
          {
            key: "orderBy",
            sortable: true
          },
          {
            key: "description",
            sortable: true
          },
          {
            key: "abbreviation",
            sortable: true
          }
        ],
        primaryKey: "sidoID"
      }
    },
    created: function (){
      // console.log(this.$store)
    },
    mounted(){
      const promise = new Promise(((resolve, reject) => {
        if(this.$store.dispatch("loadRegion")){
          resolve();
        }else{
          reject(Error("connection Error"));
        }
      }));

      promise.then(() => {
        window.setTimeout(() => {
          this.toggleRegionBusy()
        }, 400)
      }, err => {
        console.log(err);
      });
    },
    methods: {
      ...mapMutations({
        increment: "increment",
        decrement: "decrement"
      }),
      ...mapActions({
        randomNumber: "generateRandomNumber"
      }),
      toggleRegionBusy(){
        this.regionBusyFlag = !this.regionBusyFlag
      },
      toggleSidoBusy(){
        this.sidoBusyFlag = !this.sidoBusyFlag
      },
      regionClickHandler(record){
        // this.toggleSidoBusy();
        // const promise = new Promise(((resolve, reject) => {
        //   if(this.$store.dispatch("loadSido", [record["sidoID"]])){
        //     resolve();
        //   }else{
        //     reject(Error("connection Error"));
        //   }
        // }));
        // promise.then(() => {
        //   window.setTimeout(() => {
        //     this.toggleSidoBusy();
        //   }, 400)
        // })

        this.$router.push("/region/" + record["sidoID"] + "/sido")
      }
    },
    computed: {
      ...mapState([
              "count",
              "regionList",
              "sidoList"
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
