<template>
  <div id='ads'>
    <div class='loading' v-if='loading'>
      Ads Loading...
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
            <td><span class='glyphicon glyphicon-edit'></span> <span class='glyphicon glyphicon-remove-circle'></span></td>
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
    }
  }
}
</script>