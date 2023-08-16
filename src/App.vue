<template>
  <n-config-provider :theme-overrides="themeOverrides" :locale="zhCN" :date-locale="dateZhCN" :theme="useDark ? darkTheme : undefined">
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
import { zhCN, dateZhCN } from 'naive-ui'
import { darkTheme } from 'naive-ui'

const theme = computed(() => settingsStore.theme);

const useDark = false;

const themeOverrides = {
  common: {
    primaryColor: '#409EFF',
    borderRadius: "8px"
  },
  Input: {
    borderRadius: "8px"
  },
  Card: {
    borderRadius: "10px"
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
      zhCN,
      dateZhCN,
      darkTheme
    };
  },
});
</script>
