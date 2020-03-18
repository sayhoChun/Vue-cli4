<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
<!--    <TableView msg="Welcome to Your Vue.js App"/>-->

    <router-view class="view"></router-view>

    <b-list-group id="mixin" class="text-center mt-3">
      <b-list-group-item id="sub" @click="onClick" @contextmenu.prevent="test">
        {{data}}
      </b-list-group-item>
    </b-list-group>
  </div>
</template>

<script>
  import mixin from "./components/mixin/mixin";
  // import TableView from './components/TableView.vue'

export default {
  mixins: [mixin],
  name: 'App',
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
    onRightClick(){
      this.data--;
    },
    test(){
      this.data -= 2;
    }
  }
}
</script>

<style>
  #app {
    font-family: NanumSquare, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
  #sub {
    background-color: skyblue;
  }
</style>
