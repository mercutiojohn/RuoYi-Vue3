<template>
  <n-button quaternary @click="toggle">
    <n-icon size="24">
      <maximize v-if="!isFullscreen"/>
      <minimize v-else/>
    </n-icon>
  </n-button>
</template>

<script setup>
import { useFullscreen } from '@vueuse/core'
import { 
  FullScreenMaximize24Regular as Maximize,
  FullScreenMinimize24Regular as Minimize
} from "@vicons/fluent";

const { isFullscreen, enter, exit, toggle } = useFullscreen();
</script>