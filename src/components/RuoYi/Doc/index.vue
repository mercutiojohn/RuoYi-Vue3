<template>
  <n-button quaternary @click="goto">
    <n-icon size="24">
      <QuestionCircle />
    </n-icon>
  </n-button>
</template>

<script setup>
import { 
  QuestionCircle24Regular as QuestionCircle
} from "@vicons/fluent";
const url = ref('http://doc.ruoyi.vip/ruoyi-vue');

function goto() {
  window.open(url.value)
}
</script>