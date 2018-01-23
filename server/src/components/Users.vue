<template>
  <div id='users'>
    <div class='loading' v-if='loading'>
      Users Loading...
    </div>
    <div v-if='users_list'>
      <table class='table table-striped'>
        <thead>
          <tr> 
            <th>#</th>
            <th>Name</th>
            <th>Role</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for='(user, key) in users_list'>
            <th scope="row">{{ key }}</th>
            <td>{{ user.username }}</td>
            <td>{{ user.role }}</td>
            <td>
              <router-link
                :to="{ name: 'editUser', params: { id: user._id }}"
                class="glyphicon glyphicon-edit">
              </router-link>
              <span class='glyphicon glyphicon-remove-circle' @click='removeUser(user._id)'></span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if='message.length>0'>
      Error: {{ message }}
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default{
  name: 'users',
  data () {
    return {
      loading: false,
      users_list: [],
      message: ''
    }
  },
  computed: {
    ...mapGetters([
      'token'
    ])
  },
  created: function () {
    if (this.$parent.authNeeded && !this.token) {
      console.log('Token empty, redirect to login page...')
      this.$router.push('login')
      return
    }
    this.$nextTick(function () {
      this.loadUsers()
    })
  },
  methods: {
    loadUsers () {
      this.users_list = null
      this.loading = true
      // set header globaly
      // Vue.http.headers.common['Authorization'] = 'Basic YXBpOnBhc3N3b3Jk';
      var headers = {headers: {'Authorization': 'Bearer ' + this.token}}
      this.$http.get('/api/users', headers).then((response) => {
        this.$set(this, 'users_list', response.body)
        this.loading = false
      }, (response) => {
        this.message = response.body
      })
    },
    removeUser (id) {
      console.log('remove:' + id)
      var options = {headers: {'Authorization': 'Bearer ' + this.token}}
      this.$http.delete('/api/users/' + id, options).then((response) => {
        console.log('User Deleted!')
        var i = 0
        for (i = 0; i < this.users_list.length; i++) {
          if (this.users_list[i]._id === id) {
            this.users_list.splice(i, 1)
            break
          }
        }
      }, (response) => {
        console.log('User Delete failed!')
      })
    }
  }
}
</script>