<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
    <div id="mixin">
      <div id="sub" @click="onClick" @contextmenu.prevent="test">{{data}}</div>
    </div>
  </div>
</template>

<script>
  import mixin from "./components/mixin/mixin";
  import HelloWorld from './components/HelloWorld.vue'

export default {
  mixins: [mixin],
  name: 'App',
  components: {
    HelloWorld
  },
  created() {
    console.log('component');
    console.log(this.data)
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
  #mixin{
    display: table;
    text-align: center;
  }
  #sub {
    display: table-cell;
    text-align: center;
    vertical-align: middle;
    width: 100px;
    height: 100px;
    background-color: skyblue;
  }
</style>
