<template>
  <div id='editAd'>
    Edit AD loading... edit mode? {{ this.$route.params.id }}
    <div v-if='ad'>
      <h1>{{ ad.company }}</h1>
    </div>
  </div>
</template>

<script>
export default{
  name: 'editAd',
  data () {
    var edit = false
    if (this.$route.params.id !== undefined) {
      edit = true
    }
    return {
      edit: edit,
      loading: false,
      ad: {}
    }
  },
  created () {
    this.loadAd()
    console.log('created...')
  },
  beforeMount () {
    console.log('beforeMount...')
  },
  computed: {
  },
  methods: {
    loadAd: function () {
      this.loading = true
      if (this.$route.params.id === undefined) {
        this.loading = false
        return
      }
      this.$http.get('/api/ads/' + this.$route.params.id).then((response) => {
        if (response.body != null) {
          this.$set(this, 'ad', response.body)
        }
        this.loading = false
      }, (response) => {
        this.error = true
      })
    }
  }
}
</script>