<template>
  <div id='login'>
    <h2>Login</h2>
    <form class='container'>
      <div class='form-group'>
      <label class='control-label' for='username'>Username</label>
        <input v-model='username' v-validate data-vv-rules='required' type='text' placeholder="User Name" class='form-control' />
      </div>
      <div class='form-group'>
      <label class='control-label' for='password'>Password</label>
        <input v-model='password' v-validate data-vv-rules='required' type='password' placeholder="Password" class='form-control' />
      </div>
      <div class="form-group">
        <button type="submit" class="btn btn-default" @click.prevent='onSubmit'>Login</button>
      </div>       
    </form>
    <div>
      <router-link to="/register">Not Join yet? Click to register!</router-link>
    </div>
    <div v-if='error'>
      <span>{{ errmsg }}</span>
    </div>
  </div>
</template>

<script type="text/javascript">
export default {
  name: 'login',
  data () {
    return {
      username: '',
      password: '',
      error: false,
      errmsg: ''
    }
  },
  methods: {
    onSubmit: function () {
      this.error = false
      if (this.username === '' || this.password === '') {
        // TODO: using validater midderware
        this.error = true
        this.errmsg = 'username and password missing'
        return
      }
      var creds = { username: this.username, password: this.password }
      this.$http.post('/api/auth/login', creds).then((response) => {
        console.log('login return:' + response.body)
        this.$store.dispatch('saveToken', response.body.token)
        this.$router.go(-1)
      }, (response) => {
        console.log('Error during login...')
        this.errmsg = response.body
        this.error = true
      })
    }
  }
}
</script>