<template>
  <b-container fluid="xs" class="mx-auto">
    <b-table v-if="isVisible" class="mt-3 mx-auto small" id="regionTable"  striped hover
             :items="this.provider"
             :busy.sync="isBusy"
             :no-provider-sorting="true"
             :sort-by.sync="sortBy"
             :sort-desc.sync="sortDesc"
             :fields="fields"
             :primary-key="primaryKey"
             @row-clicked="regionClickHandler"
    >
      <template v-slot:table-busy>
        <div class="text-center text-primary my-2">
          <b-spinner class="align-middle"></b-spinner>
          <strong> Loading...</strong>
        </div>
      </template>
    </b-table>
    <router-view class="view"></router-view>
  </b-container>
</template>

<script>
  import { mapState, mapGetters } from "vuex";

  export default {
    name: 'HelloWorld',
    data () {
      return {
        isVisible: true,
        isBusy: false,
        fields: [
          {key: "orderBy", sortable: true},
          {key: "description", sortable: true},
          {key: "abbreviation", sortable: true}
        ],
        sortBy: "orderBy",
        sortDesc: false,
        primaryKey: "sidoID"
      }
    },
    created: function (){
      window.onpopstate = ((event) => {
        console.log(this.$route, window.history, "location: " + document.location + ", state: " + JSON.stringify(event.state));
        this.isVisible = true
      });
    },
    mounted(){

    },
    updated(){
    },
    methods: {
      provider(){
        // this.isBusy = true;
        // let promise = new Promise(((resolve, reject) => {
        //   let dispatch = this.$store.dispatch("loadRegion");
        //   console.log(dispatch);
        //   if(dispatch) resolve();
        //   else reject(Error("connection Error"));
        // }));
        // return promise.then(() => {
        //   console.log(this.$store.getters.regionList);
        //   this.toggleRegionBusy();
        //   return this.$store.getters.regionList;
        // });

        this.toggleRegionBusy();
        let promise = this.$http.get(`${this.CONSTANTS.API_URL}/info/region`);
        return promise.then((data) => {
          console.log(data.data.data);
          this.toggleRegionBusy();
          return data.data.data;
        }).catch(error => {
          console.log(error);
          return []
        })
      },
      toggleRegionBusy(){
        this.isBusy = !this.isBusy
      },
      toggleVisible(){
        this.isVisible = !this.isVisible
      },
      regionClickHandler(record){
        this.toggleVisible();
        this.$store.commit("setUserRegion", record["sidoID"]);
        this.$router.push(`/region/${record["sidoID"]}`);
      }
    },
    computed: {
      ...mapState([
              "regionList"
      ]),
      ...mapGetters([
        // "regionList"
      ]),
    }
  }
</script>

<style scoped>
</style>
