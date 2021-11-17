<template>
  <div class="home">
    <img alt="Spongebob" src="../assets/test.gif">
    <img alt="Tictacktoe" src="../assets/tictacktoe.jpg">
    <HelloWorld msg="Hello World!"/>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'Home',
  components: {
    HelloWorld
  }
}
</script>
