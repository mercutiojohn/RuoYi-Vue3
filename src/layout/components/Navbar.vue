<template>
  <div class="navbar">
    <!-- <hamburger id="hamburger-container" :is-active="appStore.sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" /> -->
    <n-page-header @back="toggleSideBar">
    <template #title>
      <breadcrumb id="breadcrumb-container" class="breadcrumb-container" v-if="!settingsStore.topNav" />
      <top-nav id="topmenu-container" class="topmenu-container" v-if="settingsStore.topNav" />
    </template>
    <!-- <template #header>
      <n-breadcrumb>
        <n-breadcrumb-item>播客</n-breadcrumb-item>
        <n-breadcrumb-item>精选</n-breadcrumb-item>
        <n-breadcrumb-item>超级精选</n-breadcrumb-item>
        <n-breadcrumb-item>Anyway.FM</n-breadcrumb-item>
      </n-breadcrumb>
    </template> -->
    <!-- <template #avatar>
      <n-avatar
        src="https://cdnimg103.lizhi.fm/user/2017/02/04/2583325032200238082_160x160.jpg"
      />
    </template> -->
    <template #extra>
      <n-space align="center">
        <template v-if="appStore.device !== 'mobile'">
          <header-search id="header-search" class="right-menu-item" />
          <n-tooltip trigger="hover">
            源码地址
            <template #trigger>
              <ruo-yi-git id="ruoyi-git" class="right-menu-item hover-effect" />
            </template>
          </n-tooltip>
          <n-tooltip trigger="hover">
            文档地址
            <template #trigger>
              <ruo-yi-doc id="ruoyi-doc" class="right-menu-item hover-effect" />
            </template>
          </n-tooltip>
          <n-tooltip trigger="hover">
            全屏
            <template #trigger>
              <screenfull id="screenfull" class="right-menu-item hover-effect" />
            </template>
          </n-tooltip>
          <n-tooltip trigger="hover">
            布局大小
            <template #trigger>
              <size-select id="size-select" class="right-menu-item hover-effect" />
            </template>
          </n-tooltip>
        </template>
        <div class="right-menu">
          <div class="avatar-container">
            <el-dropdown @command="handleCommand" class="right-menu-item hover-effect" trigger="click">
              <n-avatar
                size="medium"
                round
                :src="userStore.avatar"
              />
              <!-- <div class="avatar-wrapper">
                <img :src="userStore.avatar" class="user-avatar" />
                <el-icon><caret-bottom /></el-icon>
              </div> -->
              <template #dropdown>
                <el-dropdown-menu>
                  <router-link to="/user/profile">
                    <el-dropdown-item>个人中心</el-dropdown-item>
                  </router-link>
                  <el-dropdown-item command="setLayout">
                    <span>布局设置</span>
                  </el-dropdown-item>
                  <el-dropdown-item divided command="logout">
                    <span>退出登录</span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
        <!-- <n-dropdown :options="options" placement="bottom-start">
          <n-button :bordered="false" style="padding: 0 4px">
            ···
          </n-button>
        </n-dropdown> -->
      </n-space>
    </template>
  </n-page-header>
  </div>
</template>

<script setup>
import { ElMessageBox } from 'element-plus'
import Breadcrumb from '@/components/Breadcrumb'
import TopNav from '@/components/TopNav'
import Hamburger from '@/components/Hamburger'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import HeaderSearch from '@/components/HeaderSearch'
import RuoYiGit from '@/components/RuoYi/Git'
import RuoYiDoc from '@/components/RuoYi/Doc'
import useAppStore from '@/store/modules/app'
import useUserStore from '@/store/modules/user'
import useSettingsStore from '@/store/modules/settings'

const options = [
  {
    label: "催更",
    key: "1"
  },
  {
    label: "催更",
    key: "2"
  },
  {
    label: "催更",
    key: "3"
  }
]

const appStore = useAppStore()
const userStore = useUserStore()
const settingsStore = useSettingsStore()

function toggleSideBar() {
  appStore.toggleSideBar()
}

function handleCommand(command) {
  switch (command) {
    case "setLayout":
      setLayout();
      break;
    case "logout":
      logout();
      break;
    default:
      break;
  }
}

function logout() {
  ElMessageBox.confirm('确定注销并退出系统吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    userStore.logOut().then(() => {
      location.href = '/index';
    })
  }).catch(() => { });
}

const emits = defineEmits(['setLayout'])
function setLayout() {
  emits('setLayout');
}
</script>

<style lang='scss' scoped>
.navbar {
  padding: 0 10px;
  /* height: 50px; */
  /* overflow: hidden; */
  /* position: relative; */
  /* background: #fff; */
  /* box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08); */

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    /* float: left; */
  }

  .topmenu-container {
    /* position: absolute; */
    /* left: 50px; */
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

}
</style>
