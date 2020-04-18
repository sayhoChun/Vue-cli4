<template>
  <b-container fluid="sm" id="app">
    <Header/>
    <img alt="Vue logo" src="./assets/logo.png" class="mt-5">
    <router-view class="view"></router-view>
  </b-container>
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
  }
</style>
