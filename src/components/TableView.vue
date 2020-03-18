<template>
  <div class="w-75 mx-auto">
    <b-table v-if="isVisible" class="mt-3 mx-auto small"  striped hover
             :items="this.regionList"
             :busy.sync="isBusy"
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
    <router-view class="view"></router-view>
  </div>
</template>

<script>
  import { mapState } from "vuex";
  export default {
    name: 'HelloWorld',
    data () {
      return {
        isVisible: true,
        isBusy: true,
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
        }, 600)
      }, err => {
        console.log(err);
      });
    },
    methods: {
      toggleRegionBusy(){
        this.isBusy = !this.isBusy
      },
      regionClickHandler(record){
        this.isVisible = !this.isVisible;
        this.$store.commit("setUserRegion", record["sidoID"]);
        this.$router.push("/region/" + record["sidoID"]);
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
