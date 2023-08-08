<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <n-message-provider>
      <router-view />
      <n-global-style />
    </n-message-provider>
  </n-config-provider>
</template>

<script>
import useSettingsStore from "@/store/modules/settings";
import { handleThemeStyle } from "@/utils/theme";
import { NConfigProvider, NMessageProvider, NGlobalStyle } from "naive-ui";
import { defineComponent } from "vue";

const themeOverrides = {
  common: {
    primaryColor: "#000000",
  },
  Button: {
    textColor: "#000000",
  },
  Select: {
    peers: {
      InternalSelection: {
        textColor: "#000000",
      },
    },
  },
  // ...
};

export default defineComponent({
  components: {
    NConfigProvider,
    NMessageProvider,
    NGlobalStyle
  },
  setup() {
    onMounted(() => {
      nextTick(() => {
        // 初始化主题样式
        handleThemeStyle(useSettingsStore().theme);
      });
    });
    return {
      themeOverrides,
    };
  },
});
</script>
