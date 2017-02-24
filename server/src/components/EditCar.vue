<template>
  <div id='editCar'>
    <div class='row'>
      <span v-if='edit'>Edit</span>
      <span v-else>New</span>
      <span v-if='knowuser'>, User: {{ this.$route.params.userid }}</span> 
    </div>
    <form v-if='message.length == 0 && !loading'>
      <div v-if='!knowuser && !loading'>
        <label for="role">Select User</label>
        <select class='form-control' v-model='userid'>
          <option v-for='user in users_list' v-bind:value='user._id'>{{ user.username }}</option>
        </select>
      </div>
      <div class='form-group'>
        <label class='control-label' for='carTotal'>Plate Number</label>
        <input class='form-control' v-model='car.plate_number' id='plate_number' v-validate data-vv-rules='required' type='text' placeholder="Plate Number" />
      </div>
      <div class='form-group'>
        <label class='control-label' for='carTotal'>Model</label>
        <input class='form-control' v-model='car.model' id='model' v-validate data-vv-rules='required' type='text' placeholder="Model" />
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
            <th>AD_ID</th>
            <th>Status</th>
            <th>Position</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for='(ad, key) in car.ads'>
            <th scope="row">{{ key }}</th>
            <td>{{ ad.ad_id }}</td>
            <td>{{ ad.state }}</td>
            <td>{{ ad.position }}</td>
            <td>
              <span class='glyphicon glyphicon-remove-circle' @click='removeAd(ad.ad_id)'></span>
            </td>
          </tr>
        </tbody>
      </table>    
    </div>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
/* global FormData */
// debug purpose, disable AUTH
var AUTH = true
export default{
  name: 'editCar',
  data () {
    var edit = false
    var loading = true
    var knowuser = false
    // this.$route.params{id: userid: action:}
    console.log('params:' + JSON.stringify(this.$route.params))
    if (this.$route.params.action === 'edit') {
      edit = true
    } else {
      loading = false
    }
    if (this.$route.params.userid !== undefined) {
      knowuser = true
    }
    return {
      message: '',
      loading: loading,
      edit: edit,
      knowuser: knowuser,
      userid: '',
      car: {},
      users_list: {}
    }
  },
  computed: {
    ...mapGetters([
      'token'
    ])
  },
  created () {
    this.$nextTick(function () {
      if (this.edit) {
        this.loadCar()
      }
      this.loadUsers()
    })
  },
  methods: {
    loadCar: function () {
      console.log('load car...')
      if (this.$route.params.id === undefined) {
        this.loading = false
        this.message = 'No Car ID supplyed'
        return
      }
      /*
      if (!this.token) {
        // redirect to login
        console.log('redirect to login...')
        this.$router.push('/login')
        return
      }
      */
      var options = {headers: {'Authorization': 'Bearer ' + this.token}}
      this.$http.get('/api/cars/' + this.$route.params.id, options).then((response) => {
        if (response.body != null) {
          for (var key in response.body) {
            if (key === 'ads' && response.body.ads.length > 0) {
              this.car.ads = response.body.ads
            } else if (key === undefined) {
              continue
            } else {
              this.car[key] = response.body[key]
            }
          }
          console.log('Cars:' + JSON.stringify(this.car))
        }
        this.loading = false
      }, (response) => {
        this.message = 'Unable to get car, not login?'
        this.loading = false
      })
    },
    loadUsers: function () {
      console.log('load users...')
      if (AUTH !== false) {
        if (!this.token) {
          // redirect to login
          console.log('redirect to login...')
          this.$router.push('/login')
          return
        }
      }
      if (this.token && this.token.length > 0) {
        var options = {headers: {'Authorization': 'Bearer ' + this.token}}
        this.$http.get('/api/users', options).then((response) => {
          this.$set(this, 'users_list', response.body)
          console.log('users_list:' + JSON.stringify(this.users_list))
          this.loading = false
        }, (response) => {
          console.log('Load user failed...')
          this.message = response.body
          this.loading = false
        })
      }
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
      if (this.car.plate_number === undefined ||
        this.car.model === undefined ||
        (this.userid.length === 0 && this.$route.params.userid === undefined)) {
        console.log('Please fill all fields!')
        return
      }
      formData.append('plate_number', this.car.plate_number)
      formData.append('model', this.car.model)
      if (this.$route.params.userid !== undefined) {
        formData.append('user_id', this.userid)
      } else {
        formData.append('user_id', this.$route.params.userid)
      }

      // POST request
      var payload = { plate_number: this.car.plate_number, model: this.car.model, user_id: (this.$route.params.userid !== undefined) ? this.$route.params.userid : this.userid }
      var options = {headers: {'Authorization': 'Bearer ' + this.token}}
      this.$http.post('/api/cars', payload, options).then((response) => {
        console.log('Car updated!')
        this.$router.go(-1)
      }, (response) => {
        console.log('Car update failed:' + response.body)
      })
    },
    onCancel: function () {
      this.$router.go(-1)
    }
  }
}
</script>