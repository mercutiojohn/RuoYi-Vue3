<template>
  <n-layout-sider
    collapse-mode="width"
    :collapsed-width="64"
    :width="240"
    :native-scrollbar="false"
    :collapsed="isCollapse"
    show-trigger="bar"
    :trigger-style="{
      opacity: hovered ? 1 : 0,
      transition: 'opacity .2s ease, right .2s ease'
    }"
    :collapsed-trigger-style="{
      opacity: hovered ? 1 : 0,
      transition: 'opacity .2s ease, right .2s ease'
    }"
    @collapse="toggleSideBar"
    @expand="toggleSideBar"
    @mouseenter="hovered = true"
    @mouseleave="hideTrigger"
    :style="{
      padding: 0,
      backgroundColor:
        sideTheme === 'theme-dark'
          ? variables.menuBackground
          : variables.menuLightBackground,
    }"
    :content-style="{
      padding: 0
    }"
    bordered
  >
  <div
    :class="{ 'has-logo': showLogo }"
  >
    <logo v-if="showLogo" :collapse="isCollapse" />
    <n-menu 
        :options="menuOptions" 
        @update:value="handleUpdateValue"
        :collapsed="isCollapse"
        :collapsed-width="64"
        :root-indent="24"
        :indent="24"
        v-model:value="activeMenu"
      />
    <!-- <el-scrollbar :class="sideTheme" wrap-class="scrollbar-wrapper"> -->
      <!-- <el-menu
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
    </el-scrollbar> -->
  </div>
  </n-layout-sider>
</template>

<script setup>
import { NIcon, NMenu, useMessage } from "naive-ui";
import { RouterLink } from "vue-router";
import SvgIcon from '@/components/SvgIcon'

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

const hovered = ref(false)

function hideTrigger() {
  setTimeout(()=>{
    hovered.value = false
  },7000)
}

const message = useMessage()

function toggleSideBar() {
  appStore.toggleSideBar()
}

function renderIcon(icon) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

function renderSvgIcon(icon) {
  return () => h(SvgIcon, {
    'icon-class': icon
  }, { default: () => h(icon) });
}

function handleUpdateValue(key, item) {
  // message.info("[onUpdate:value]: " + JSON.stringify(key));
  // message.info("[onUpdate:value]: " + JSON.stringify(item));
}

const home = sidebarRouters.value.filter((item) => item.path === '' && item.redirect === '/index')[0].children[0]
console.log('hello', home)
const menuOptions = [
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            path: home.path,
          },
        },
        { default: () => home.meta?.title }
      ),
    key: home.path,
    icon: renderIcon(HomeIcon),
  },
  {
    key: "divider-1",
    type: "divider",
    props: {
      style: {
        // marginLeft: "32px",
      },
    },
  },
];

function renderMenu(sidebarLayerRouters, menuLayerOptions, parentPath = "") {
  sidebarLayerRouters.forEach((item) => {
    if (item.path === '') return;
    let obj = {
      key: `${parentPath}${!!parentPath ? "/" : ""}${item.path}`,
      icon: renderSvgIcon(item.meta?.icon),
      show: !item.hidden
    }
    // if (item.meta) {
      obj.label = () => {
        if (!item.children) {
          if (!item.meta?.link) {
            return h(
              RouterLink,
              {
                to: {
                  path: `${parentPath}${!!parentPath ? "/" : ""}${item.path}`,
                },
              },
              // item.meta?.title
              { default: () => item.meta?.title }
            );
          } else {
            return h(
              "a",
              {
                href: item.meta?.link,
                target: "_blank",
                rel: "noopenner noreferrer",
              },
              // item.meta?.title
              { default: () => item.meta?.title }
            );
          }
        } else {
          return item.meta?.title
        }
      }
    // }
    if (!!item.children) {
      obj.children = []
      renderMenu(item.children, obj.children, item.path)
    }
    menuLayerOptions.push(obj)
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
