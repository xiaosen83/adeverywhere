<template>
  <div id='register' class="uk-container-center uk-width-medium-1-3 uk-width-small-1-2">
    <h3 class="uk-text-center uk-margin-top">欢迎注册！</h3>
    <div class="uk-alert uk-alert-danger" v-if="message.length>0" v-text="message"></div>
    <form class="uk-form uk-form-stacked uk-panel uk-panel-box" v-on:submit.prevent="onSubmit">
        <div class="uk-alert uk-alert-danger" hidden="hidden"></div>
        <div class="uk-form-row">
            <label class="uk-form-label uk-hidden-small">用户名:</label>
            <div class="uk-form-controls uk-form-icon">
                <i class="uk-icon-envelope-o"></i>
                <input class="uk-form-large uk-form-width-large" type="text" placeholder="用户名" maxlength="50" v-model="username">
            </div>
        </div>
        <div class="uk-form-row">
            <label class="uk-form-label uk-hidden-small">输入密码:</label>
            <div class="uk-form-controls uk-form-icon">
                <i class="uk-icon-lock"></i>
                <input class="uk-form-large uk-form-width-large" type="password" placeholder="输入密码" maxlength="50" v-model="password">
            </div>
        </div>
        <div class="uk-form-row">
            <label class="uk-form-label uk-hidden-small">确认密码:</label>
            <div class="uk-form-controls uk-form-icon">
                <i class="uk-icon-lock"></i>
                <input class="uk-form-large uk-form-width-large" type="password" placeholder="输入密码" maxlength="50" v-model="password1">
            </div>
        </div>
        <div class="uk-form-row">
            <button type="submit" class="uk-width-1-1 uk-button uk-button-primary uk-button-large"><i class="uk-icon-sign-in"></i> 注册</button>
        </div>
    </form>
  </div>
</template>

<script>
  export default {
    name: 'register',
    data () {
      return {
        username: '',
        password: '',
        password1: '',
        message: ''
      }
    },
    methods: {
      onSubmit: function () {
        if (this.username === '' || this.password === '' || this.password !== this.password1) {
          this.message = 'Password empty or not match!'
          return
        }
        var creds = { username: this.username, password: this.password }
        this.$http.post('/api/auth/register', creds).then((response) => {
          console.log('login return:' + response.body)
          this.$store.dispatch('saveToken', response.body.token)
          this.$router.replace('/home')
        }, (response) => {
          console.log('Error during login...')
          this.message = response.body
        })
      }
    }
  }

</script>