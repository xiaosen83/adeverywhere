<template>
  <div id='editUser'>
    <div>
      <h1>User: {{ user.username }}</h1>
    </div>
    <form v-if='message.length == 0 && !loading'>
      <div id='basicInfo'>
        <div class="form-group">
          <label for="role">Role</label>
          <select class='form-control' id="role" v-model='user.role'>
            <option value='admin'>admin</option>
            <option value='driver'>driver</option>
            <option value='client'>client</option>
            <option value='vendor'>vendor</option>
          </select>
        </div>
        <div class="form-group">
          <label class='control-label' for='head_icon'>Head</label>
          <input class='form-control' type='file' name='head_icon' id='head_icon' />
        </div>
        <div class="form-group">
          <label for="name">Real name</label>
          <input type="text" v-model='user.basic_info.name' class="form-control" id="name" placeholder="Name">
        </div>        
        <div class="form-group">
          <label for="sex">Sex</label>
          <label class="radio-inline">
            <input type="radio" v-model="user.basic_info.sex" id="sexmale" value="1">Male
          </label>
          <label class="radio-inline">
            <input type="radio" v-model="user.basic_info.sex" id="sexfemale" value="2">Female
          </label>          
        </div>
        <div class="form-group">
          <label for="email">Email address</label>
          <input type="email" v-model='user.basic_info.email' class="form-control" id="email" placeholder="Email">
        </div>
        <div class="form-group">
          <label for="phone">Phone Number</label>
          <input type="text" v-model='user.basic_info.phone' class="form-control" id="phone" placeholder="Phone">
        </div>                
      </div>
      <div id='certInfo'>
        <div class="form-group">
          <label for="identity">Identity</label>
          <input type="text" v-model='user.cert_info.identity' class="form-control" id="identity" placeholder="Identity">
        </div>
        <div class="form-group">
          <label class='control-label' for='id_image'>ID Image</label>
          <input class='form-control' type='file' name='id_image' id='id_image' />
        </div>
      </div>
      <div id='cars'>
      </div>
      <div class="form-group">
        <button type="submit" class="btn btn-default" @click.prevent='onSubmit'>Submit</button>
        <button type="button" class="btn btn-primary" @click='onCancel'>Cancel</button>
      </div>    
    </form>
    <div>
      <table class='table table-striped'>
        <thead>
          <tr> 
            <th>#</th>
            <th>plate_number</th>
            <th>model</th>
            <th>AD status</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for='(car, key) in cars_list'>
            <th scope="row">{{ key }}</th>
            <td>{{ car.plate_number }}</td>
            <td>{{ car.model }}</td>
            <td>{{ car.ads.length>0? car.ads.length:0 }}</td>
            <td>
              <router-link
                :to="{ name: 'editCar', params: { id: car._id }}"
                class="glyphicon glyphicon-edit">
              </router-link>
              <span class='glyphicon glyphicon-remove-circle' @click='removeUser(car._id)'></span>
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
/* global FormData */
export default{
  name: 'editUser',
  data () {
    return {
      user: {
        username: '',
        role: 'admin',
        basic_info: {
          name: '',
          sex: 1,
          city: '',
          address: '',
          phone: '',
          email: '',
          head_icon: ''
        },
        cert_info: {
          identity: '',
          id_image: ''
        }
      },
      cars: [],
      loading: true,
      message: ''
    }
  },
  computed: {
    ...mapGetters([
      'token'
    ])
  },
  created () {
    this.$nextTick(function () {
      this.loadUser()
    })
  },
  watch: {
    '$route': 'loadUser'
  },
  methods: {
    loadUser: function () {
      console.log('load user...')
      if (this.$route.params.id === undefined) {
        this.loading = false
        this.message = 'No User ID supplyed'
        return
      }
      if (!this.token) {
        // redirect to login
        console.log('redirect to login...')
        this.$router.push('/login')
        return
      }
      var options = {headers: {'Authorization': 'Bearer ' + this.token}}
      this.$http.get('/api/users/' + this.$route.params.id, options).then((response) => {
        if (response.body != null) {
          for (var key in response.body) {
            if (key === 'basic_info') {
              for (var key1 in response.body.basic_info) {
                this.user.basic_info[key1] = response.body.basic_info[key1]
              }
            } else if (key === 'cert_info') {
              for (key1 in response.body.cert_info) {
                this.user.cert_info[key1] = response.body.cert_info[key1]
              }
            } else if (key === 'car_ids' || key === undefined) {
              continue
            } else {
              this.user[key] = response.body[key]
            }
          }
          console.log(JSON.stringify(this.user))
        }
        this.loading = false
      }, (response) => {
        this.message = 'Unable to get user, not login?'
        this.loading = false
      })
      // Load Users cars
      this.$http.get('/api/users/' + this.$route.params.id + '/cars', options).then((response) => {
        if (response.body != null) {
          this.$set(this, 'cars_list', response.body)
          console.log(JSON.stringify(this.cars_list))
        }
      }, (response) => {
        this.message = 'Unable to get user\'s car, not login?'
      })
    },
    onSubmit: function () {
      var formData = new FormData()
      for (var key in this.user) {
        if (key === 'basic_info' || key === 'cert_info') {
          formData.append(key, JSON.stringify(this.user[key]))
        } else {
          formData.append(key, this.user[key])
        }
      }
      if (document.getElementById('head_icon').files.length > 0) {
        formData.append('head_icon', document.getElementById('head_icon').files[0])
      }
      if (document.getElementById('id_image').files.length > 0) {
        formData.append('id_image', document.getElementById('id_image').files[0])
      }
      // formData.delete('_id')
      // PUT request
      var options = {headers: {'Authorization': 'Bearer ' + this.token}}
      this.$http.put('/api/users/' + this.$route.params.id, formData, options).then((response) => {
        console.log('User updated!')
        this.$router.go(-1)
      }, (response) => {
        console.log('User update failed:' + response.body)
      })
    },
    onCancel: function () {
      return
    }
  }
}
</script>