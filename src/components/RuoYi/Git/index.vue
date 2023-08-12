<template>
  <n-button quaternary @click="goto">
    <n-icon size="24">
      <LogoGithub />
    </n-icon>
  </n-button>
</template>

<script setup>
import { 
  LogoGithub
} from "@vicons/ionicons5"
const url = ref('https://gitee.com/y_project/RuoYi-Vue');

function goto() {
  window.open(url.value)
}
</script>