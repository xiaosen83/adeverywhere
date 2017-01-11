<template>
  <div id='ads'>
    <div class='loading' v-if='loading'>
      Ads Loading...
    </div>
    <div>
      <router-link
        :to="{ path: '/editAd'}"
        class="bt btn-primary">
        Create AD
      </router-link>    
    </div>
    <div v-if='ads_list'>
      <table class='table table-striped'>
        <thead>
          <tr> 
            <th>#</th>
            <th>Company</th>
            <th>Cars</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for='(ad, key) in ads_list'>
            <th scope="row">{{ key }}</th>
            <td>{{ ad.company }}</td>
            <td>{{ ad.car_total }}</td>
            <td>
              <router-link
                :to="{ name: 'editAd', params: { id: ad._id }}"
                class="glyphicon glyphicon-edit">
              </router-link>
              <span class='glyphicon glyphicon-remove-circle' @click='removeAd(ad._id)'></span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if='error'>
      Error...
    </div>
  </div>
</template>

<script>
export default{
  name: 'ads',
  data () {
    return {
      loading: false,
      ads_list: [],
      error: false
    }
  },
  created () {
    this.fetchData()
  },
  watch: {
    '$route': 'fetchData'
  },
  methods: {
    fetchData () {
      this.ads_list = null
      this.loading = true
      this.$http.get('/api/ads').then((response) => {
        this.$set(this, 'ads_list', response.body)
        this.loading = false
      }, (response) => {
        this.error = true
      })
    },
    removeAd (id) {
      console.log('remove:' + id)
      this.$http.delete('/api/ads/' + id).then((response) => {
        console.log('Ad Deleted!')
        var i = 0
        for (i = 0; i < this.ads_list.length; i++) {
          if (this.ads_list[i]._id === id) {
            this.ads_list.splice(i, 1)
            break
          }
        }
      }, (response) => {
        console.log('AD Delete failed!')
      })
    }
  }
}
</script>