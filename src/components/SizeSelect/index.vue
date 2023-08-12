<template>
  <div>
    <n-dropdown trigger="hover" :options="sizeOptions" @select="handleSetSize">
      <n-button quaternary>
        <n-icon size="24">
          <TextFontSize />
        </n-icon>
      </n-button>
    </n-dropdown>
  </div>
</template>

<script setup>
import useAppStore from "@/store/modules/app";

import { 
  TextFontSize24Regular as TextFontSize
} from "@vicons/fluent";

const appStore = useAppStore();
const size = computed(() => appStore.size);
const route = useRoute();
const router = useRouter();
const { proxy } = getCurrentInstance();
const sizeOptions = ref([
  { label: "较大", key: "large" },
  { label: "默认", key: "default" },
  { label: "稍小", key: "small" },
]);

function handleSetSize(size) {
  proxy.$modal.loading("正在设置布局大小，请稍候...");
  appStore.setSize(size);
  setTimeout("window.location.reload()", 1000);
}
</script>