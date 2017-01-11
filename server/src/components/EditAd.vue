<template>
  <div id='editAd'>
    <div v-if='!loading'>
      <form class='container'>
        <div class='row'>
          <span v-if='edit'>Edit</span>
          <span v-else>Create</span> 
        </div>
        <div class='row'>
          <div class='col-md-6'>
            <div class='form-group'>
              <label class='control-label' for='company'>Company</label>
              <input v-model='ad.company' id='company' v-validate data-vv-rules='required' type='text' placeholder="Company Name" class='form-control' />
              <span v-show="errors.has('company')">{{ errors.first('company') }}</span>
            </div>
            <div class='form-group'>
              <label class='control-label' for='carTotal'>Car Total</label>
              <input class='form-control' v-model='ad.car_total' id='carTotal' v-validate data-vv-rules='required|decimal' type='text' placeholder="Cars Total needed" />
              <span v-show="errors.has('carNumber')">{{ errors.first('carNumber') }}</span>
            </div> 
            <div class="form-group">
                <label class="control-label" for='startDate'>Date</label>
                <datepicker v-model="ad.start_date" name="startDate"></datepicker>
            </div>
            <div class="form-group">
                <label class="control-label" for='endDate'>Date</label>
                <datepicker v-model="ad.end_date" name="endDate"></datepicker>
            </div>
            <div class="form-group">
              <button type="submit" class="btn btn-default" @click.prevent='onSubmit'>Submit</button>
              <button type="button" class="btn btn-primary" @click='onCancel'>Cancel</button>
            </div> 
          </div>
          <div class='col-md-6'>
            <div>
              <div class='col-md-8'>
                <label class='control-label' for='logo'>Logo</label>
                <input class='form-control' type='file' name='logo' id='logo' v-on:change='onFileChange' />
              </div>
              <img class='img_small' :src='imgLogo' alt='logo image'/>
            </div>
            <div>
              <label class='control-label' for='model'>Model</label>
              <input class='form-control' type='file' name='model' id='model' v-on:change='onFileChange' />
              <img class='img_large' :src='imgModel' alt='Model image'/>
            </div>          
          </div>
        </div>                      
      </form>
    </div>
    <div v-else>
      Loading AD ({{ this.$route.params.id }}) ...
    </div>
  </div>
</template>

<script>
import Datepicker from 'vuejs-datepicker'

/* global FileReader, FormData */

export default{
  name: 'editAd',
  data () {
    var edit = false
    var loading = true
    if (this.$route.params.id !== undefined) {
      edit = true
    } else {
      loading = false
    }
    return {
      edit: edit,
      loading: loading,
      ad: {},
      logosrc: '',
      modelsrc: ''
    }
  },
  computed: {
    imgLogo () {
      if (this.logosrc !== '') {
        return this.logosrc
      } else if (this.ad.logo !== undefined) {
        return '/images/logos/' + this.ad.logo
      }
    },
    imgModel () {
      if (this.modelsrc !== '') {
        return this.modelsrc
      } else if (this.ad.model !== undefined) {
        return '/images/models/' + this.ad.model
      }
    }
  },
  components: {
    Datepicker
  },
  created () {
    this.loadAd()
    console.log('created...')
  },
  beforeMount () {
    console.log('beforeMount...')
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
    },
    onFileChange: function (e) {
      var files = e.target.files || e.dataTransfer.files
      if (!files.length) {
        return
      }
      var reader = new FileReader()
      var vm = this
      var elname = e.srcElement.name
      reader.onload = (e) => {
        if (elname === 'logo') {
          vm.logosrc = e.target.result
        } else if (elname === 'model') {
          vm.modelsrc = e.target.result
        }
      }
      reader.readAsDataURL(files[0])
    },
    onSubmit: function () {
      var formData = new FormData()
      formData.append('company', this.ad.company)
      formData.append('car_type', 1)
      formData.append('car_total', this.ad.car_total)
      formData.append('start_date', this.ad.start_date)
      formData.append('end_date', this.ad.end_date)
      if (document.getElementById('logo').files.length > 0) {
        formData.append('logo', document.getElementById('logo').files[0])
      }
      if (document.getElementById('model').files.length > 0) {
        formData.append('model', document.getElementById('model').files[0])
      }
      this.$http.post('/api/ads', formData).then((response) => {
        console.log('AD create succeed!')
      }, (response) => {
        // error handle
        console.log('AD create failed!')
        this.error = true
      }, {headers: {
        'Content-Type': 'multipart/form-data'
      }})
    },
    onCancel: function () {
      this.$router.go(-1)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.img_small {
  background-color: gray;
  height: 128px;
  width: 128px;
}
.img_large {
  background-color: gray;
  height: 300px;
  width: 100%;
}
</style>