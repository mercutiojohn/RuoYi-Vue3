<template>
  <div
    :class="{ 'has-logo': showLogo }"
    :style="{
      backgroundColor:
        sideTheme === 'theme-dark'
          ? variables.menuBackground
          : variables.menuLightBackground,
    }"
  >
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar :class="sideTheme" wrap-class="scrollbar-wrapper">
      <n-menu :options="menuOptions" @update:value="handleUpdateValue" />
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="
          sideTheme === 'theme-dark'
            ? variables.menuBackground
            : variables.menuLightBackground
        "
        :text-color="
          sideTheme === 'theme-dark'
            ? variables.menuColor
            : variables.menuLightColor
        "
        :unique-opened="true"
        :active-text-color="theme"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item
          v-for="(route, index) in sidebarRouters"
          :key="route.path + index"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script setup>
import { NIcon, NMenu, useMessage } from "naive-ui";
import { RouterLink } from "vue-router";
import {
  Book24Regular as BookIcon,
  Person24Regular as PersonIcon,
  DrinkWine24Regular as WineIcon,
  Home24Regular as HomeIcon,
} from "@vicons/fluent";

import Logo from "./Logo";
import SidebarItem from "./SidebarItem";
import variables from "@/assets/styles/variables.module.scss";
import useAppStore from "@/store/modules/app";
import useSettingsStore from "@/store/modules/settings";
import usePermissionStore from "@/store/modules/permission";

const route = useRoute();
const appStore = useAppStore();
const settingsStore = useSettingsStore();
const permissionStore = usePermissionStore();

const sidebarRouters = computed(() => permissionStore.sidebarRouters);
console.log("hello", sidebarRouters.value);
const showLogo = computed(() => settingsStore.sidebarLogo);
const sideTheme = computed(() => settingsStore.sideTheme);
const theme = computed(() => settingsStore.theme);
const isCollapse = computed(() => !appStore.sidebar.opened);

// Naive
const message = useMessage();

function renderIcon(icon) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

function handleUpdateValue(key, item) {
  message.info("[onUpdate:value]: " + JSON.stringify(key));
  message.info("[onUpdate:value]: " + JSON.stringify(item));
}

const menuOptions = [
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            path: "/index",
          },
        },
        { default: () => "首页" }
      ),
    key: "go-back-home",
    icon: renderIcon(HomeIcon),
  },
  {
    key: "divider-1",
    type: "divider",
    props: {
      style: {
        marginLeft: "32px",
      },
    },
  },
];

function renderMenu(sidebarLayerRouters, menuLayerOptions, parentPath = "") {
  sidebarLayerRouters.forEach((item) => {
    if (item.hidden || !item.meta) return;
    let obj = {
      // label: item.meta.title,
      label: () => {
        if (!item.children) {
          if (!item.meta.link) {
            return h(
              RouterLink,
              {
                to: {
                  path: `${parentPath}${!!parentPath ? "/" : ""}${item.path}`,
                },
              },
              item.meta.title
              // { default: () => item.meta.title }
            );
          } else {
            return h(
              "a",
              {
                href: item.meta.link,
                target: "_blank",
                rel: "noopenner noreferrer",
              },
              item.meta.title
              // { default: () => item.meta.title }
            );
          }
        } else {
          return item.meta.title;
        }
      },
      key: item.name,
      icon: renderIcon(BookIcon), // TODO
    };
    if (!!item.children) {
      obj.children = [];
      renderMenu(item.children, obj.children, item.path);
    }
    menuLayerOptions.push(obj);
  });
}

renderMenu(sidebarRouters.value, menuOptions);

const activeMenu = computed(() => {
  const { meta, path } = route;
  // if set path, the sidebar will highlight the path you set
  if (meta.activeMenu) {
    return meta.activeMenu;
  }
  return path;
});
</script>
