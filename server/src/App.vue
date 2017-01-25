<template>
  <div id="app">
    <div id='navbar' class='center-block'>
      <nav class='navbar navbar-default'>
        <div class="row">
          <div class='navbar-header col-md-10'>
            <ul class='nav navbar-nav'>
              <li><router-link to="/home">Home</router-link></li>
              <li><router-link to="/ads">Advertise</router-link></li>
              <li><router-link to="/users">Users</router-link></li>
              <li><router-link to="/cars">Cars</router-link></li>
            </ul>      
          </div>
          <div class='col-md-2'>
            <userinfo></userinfo>
          </div>  
        </div>
      </nav>
    </div>
    <div class="container">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import UserInfo from './components/UserInfo.vue'
export default {
  name: 'app',
  components: {
    'userinfo': UserInfo
  }
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
