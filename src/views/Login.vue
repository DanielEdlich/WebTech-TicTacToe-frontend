<template>
<h1>Login</h1>
  <form id="users-create-form" class="<<!--position-absolute start-50 justify-content-center--> w-50 mx-auto needs-validation" novalidate>
    <div class="mb-3">
      <label for="InputUsername" class="form-label">Username</label>
      <input v-model="username" type="text" class="form-control" id="InputUsername" required>
      <div class="invalid-feedback">
        Please provide the username.
      </div>
    </div>
    <div class="mb-3">
      <label for="InputPassword" class="form-label">Password</label>
      <input v-model="password" type="password" class="form-control" id="InputPassword" required>
      <div class="invalid-feedback">
        Please provide the password.
      </div>
    </div>
    <div v-if="error" class="alert alert-danger" role="alert">
      {{error}}
    </div>
    <p>
      <button type="button" class="btn btn-link btn-sm" @click="() => this.$router.push('/register')">Register</button>
    </p>
    <button type="button" class="btn btn-primary" @click = "save()">Login</button>
  </form>

<!--  <input v-model="username" type="text">-->
<!--  <button type="button" @click = "save()">Create</button>-->
</template>

<script>
import router from '@/router'
import store from '@/store'

const { useRouter } = require('vue-router')

export default {
  name: 'Login',
  router: useRouter(),
  data () {
    return {
      username: '',
      password: '',
      error: ''
    }
  },
  methods: {
    async save () {
      if (this.validate()) {
        const baseUrl = process.env.VUE_APP_BACKEND_BASE_URL
        const endpoint = baseUrl + '/api/v1/login'
        const data = {
          name: this.username,
          password: this.password
        }
        const requestOptions = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credential: 'include',
          body: JSON.stringify(data)
        }
        await fetch(endpoint, requestOptions)

          .then(async response => {
            // console.log(response)
            if (response.ok) {
              const result = await response.json()
              store.commit('setUser', result)
              // alert(this.username + ' logged in')
              await router.push('/')
            } else if (response.status === 400) {
              response = await response.json()
              if (response.errors) {
                response.errors.forEach(error => {
                  this.error += error.defaultMessage + '\n'
                })
              } else {
                this.error = response.message
              }
            } else {
              this.error = 'Unknown error occurred'
            }
          })
          .catch(error => {
            console.log('error', error)
            this.error = error.defaultMessage
          })
      } else {
        console.log('username and password can not be empty')
      }
    },
    validate () {
      const form = document.getElementById('users-create-form')
      form.classList.add('was-validated')
      return form.checkValidity()
    }
  }
}
</script>

<style scoped>

</style>
