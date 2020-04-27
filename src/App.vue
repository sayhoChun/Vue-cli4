<template>
  <div id="app">
    <Header/>
    <router-view class="view"></router-view>
  </div>
</template>

<script>
  import Header from "./components/mixin/Header";

export default {
  name: 'App',
  components: {
    Header
  },
  created() {
  },
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
    overflow-x: hidden;
    position: relative;
    touch-action: manipulation;
  }
</style>
