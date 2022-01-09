<template>
  <h1>Register</h1>
  <form id="userscreateform" class="<<!--position-absolute start-50 justify-content-center--> w-50 mx-auto needs-validation" novalidate>
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
    </p>
    <button id="RegisterButton" type="button" class="btn btn-primary" @click = "save()">Register</button>
  </form>
</template>

<script>

import router from '@/router'

const { useRouter } = require('vue-router')

export default {
  name: 'Register',
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
        const endpoint = baseUrl + '/api/v1/signup'
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
            console.log(response)
            if (response.ok) {
              await router.push('/login')
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
    /* await fetch(endpoint, requestOptions)
          .then(response => response.json())
          .then(result => console.log(result))
          .catch(error => console.log('error', error))
        alert(this.username + ' created')

        await router.push('/login')
      } else {
        console.log('username and password can not be empty')
      }
    }, */
    validate () {
      const form = document.getElementById('userscreateform')
      form.classList.add('was-validated')
      return form.checkValidity()
    }
  }
}
</script>

<style scoped>

</style>
