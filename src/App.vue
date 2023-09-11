<template>
  <div id="app">
    <!-- <img src="./assets/logo.png" class="logo" alt=""> -->
    <router-view />
  </div>
</template>

<style lang="less">
html,
body,
#app {
  height: 100%;
  .logo {
    width: 80px;
    position: absolute;
    top: 20px;
    left: 20px;
  }
}
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
</style>
