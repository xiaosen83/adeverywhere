<template>
  <div id="app">
    <div id='navbar' class='center-block'>
      <nav class='navbar navbar-default'>
        <div class='navbar-header'>
          <ul class='nav navbar-nav'>
            <li><router-link to="/home">Home</router-link></li>
            <li><router-link to="/ads">Advertise</router-link></li>
            <li><router-link to="/users">Users</router-link></li>
            <li><router-link to="/cars">Cars</router-link></li>
          </ul>        
        </div>
      </nav>
    </div>

    <div class="container">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
