<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <n-message-provider>
      <router-view />
      <n-global-style /> <!-- TODO -->
    </n-message-provider>
  </n-config-provider>
</template>

<script>
import useSettingsStore from "@/store/modules/settings";
import { handleThemeStyle } from "@/utils/theme";
import { NConfigProvider, NMessageProvider, NGlobalStyle } from "naive-ui";
import { defineComponent } from "vue";

const theme = computed(() => settingsStore.theme);

const themeOverrides = {
  common: {
    primaryColor: '#409EFF',
  },
  Input: {
    borderRadius: "8px"
  },
  Button: {
    textColor: "#000000",
    borderRadiusTiny: "4px",
    borderRadiusSmall: "6px",
    borderRadiusMedium: "10px",
    borderRadiusLarge: "10px"
  },
  Select: {
    peers: {
      InternalSelection: {
        textColor: "#000000",
      },
    },
  },
  Menu: {
    borderRadius: '10px'
  },
  Tabs: {
    tabBorderRadius: '6px'
  },
  Dropdown: {
    borderRadius: "10px",
    // optionIconSizeLarge: "32px",
    // optionIconPrefixWidthLarge: '48px',
    optionIconSizeHuge: "24px",
    optionIconPrefixWidthHuge: '48px'
  }
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
