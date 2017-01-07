<template>
  <div id='home'>
    Home loading...({{ time }})
  </div>
</template>

<script>
export default{
  name: 'home',
  data () {
    return {}
  },
  computed: {
    time () {
      return this.$store.state.totalTime
    }
  },
  method: { }
}
</script>