<template>
  <div id="mobile-app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
html, body {
  height: 100%;
}

#mobile-app {
  min-height: 100%;
  background-color: #f7f7f7;
}
</style>
