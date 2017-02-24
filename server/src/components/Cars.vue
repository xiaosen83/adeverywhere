<template>
  <div id='cars'>
    <div class='row'>
      <router-link
        :to="{ path: '/editCar', params: { action: 'new' }}"
        class="bt btn-primary">
        Create Car
      </router-link> 
    </div>
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
                :to="{ name: 'editCar', params: { id: car._id, action: 'edit' }}"
                class="glyphicon glyphicon-edit">
              </router-link>
              <span class='glyphicon glyphicon-remove-circle' @click='removeCar(car._id)'></span>
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
  name: 'cars',
  data () {
    return {
      loading: false,
      cars_list: [],
      message: ''
    }
  },
  computed: {
    ...mapGetters([
      'token'
    ])
  },
  created: function () {
    /*
    if (!this.token) {
      console.log('Token empty, redirect to login page...')
      this.$router.push('login')
      return
    }
    */
    this.$nextTick(function () {
      this.loadCars()
    })
  },
  methods: {
    loadCars () {
      this.cars_list = null
      this.loading = true
      // set header globaly
      // Vue.http.headers.common['Authorization'] = 'Basic YXBpOnBhc3N3b3Jk';
      var options = {headers: {'Authorization': 'Bearer ' + this.token}}
      this.$http.get('/api/cars', options).then((response) => {
        this.$set(this, 'cars_list', response.body)
        this.loading = false
      }, (response) => {
        this.message = response.body
      })
    },
    removeCar (id) {
      console.log('remove:' + id)
      var options = {headers: {'Authorization': 'Bearer ' + this.token}}
      this.$http.delete('/api/cars/' + id, options).then((response) => {
        console.log('Car Deleted!')
        var i = 0
        for (i = 0; i < this.cars_list.length; i++) {
          if (this.cars_list[i]._id === id) {
            this.cars_list.splice(i, 1)
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