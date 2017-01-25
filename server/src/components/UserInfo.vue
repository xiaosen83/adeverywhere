<template>
  <div id='userinfo'>
    <div v-if='username.length>0'>
      <span>User: {{ username }}</span>
      <span @click='logout'>Logout</span>
    </div>
    <div v-else>
      <router-link to="/login">Login</router-link>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'userinfo',
  data: function () {
    return { }
  },
  computed: {
    ...mapGetters([
      'username',
      'token'
    ])
  },
  methods: {
    logout: function () {
      var options = {headers: {'Authorization': 'Bearer ' + this.token}}
      var body = {}
      this.$http.post('/api/auth/logout', body, options).then((response) => {
        console.log('logout return:' + response.body)
        this.$store.dispatch('saveToken', null)
        console.log(this.$router.path)
        this.$router.go(this.$router.path)
      }, (response) => {
        console.log('Error during logout...:' + response.body)
        this.message = response.body
      })
    }
  }
}
</script>