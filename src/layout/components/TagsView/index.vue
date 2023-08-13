<template>
  <div id="tags-view-container" class="tags-view-container">
    <n-tabs
      v-model:value="currentTag"
      type="card"
      closable
      @close="closeSelectedTag"
      size="small"
    >
      <n-tab
        v-for="tag in visitedViews"
        :key="tag.path"
        :tab="tag"
        :name="tag.path"
        :closable="!isAffix(tag)"
        @click="navigate({ path: tag.path, query: tag.query, fullPath: tag.fullPath })"
        @contextmenu.prevent="openMenu(tag, $event)"
      >
      {{tag.title}}
      </n-tab>
    </n-tabs>
    <!-- <scroll-pane ref="scrollPaneRef" class="tags-view-wrapper" @scroll="handleScroll">
      <router-link
        v-for="tag in visitedViews"
        :key="tag.path"
        :data-path="tag.path"
        :class="isActive(tag) ? 'active' : ''"
        :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
        class="tags-view-item"
        :style="activeStyle(tag)"
        @click.middle="!isAffix(tag) ? closeSelectedTag(tag) : ''"
        @contextmenu.prevent="openMenu(tag, $event)"
      >
        {{ tag.title }}
        <span v-if="!isAffix(tag)" @click.prevent.stop="closeSelectedTag(tag)">
          <close class="el-icon-close" style="width: 1em; height: 1em;vertical-align: middle;" />
        </span>
      </router-link>
    </scroll-pane> -->
    <n-dropdown
      placement="bottom-start"
      trigger="manual"
      size="huge"
      :x="left"
      :y="top"
      :options="options"
      :show="visible"
      @select="handleSelect"
    />
    <!-- :on-clickoutside="onClickoutside" -->
  </div>
</template>

<script setup>
import { NIcon } from "naive-ui";
import ScrollPane from './ScrollPane'
import { getNormalPath } from '@/utils/ruoyi'
import useTagsViewStore from '@/store/modules/tagsView'
import useSettingsStore from '@/store/modules/settings'
import usePermissionStore from '@/store/modules/permission'
import {
  ArrowClockwise16Regular as Refresh,
  Dismiss16Regular as Close,
  DismissSquareMultiple16Regular as CloseMultiple,
  ArrowRight16Regular as Right,
  ArrowLeft16Regular as Left,
  DismissCircle16Regular as CloseCircle
} from "@vicons/fluent";

const visible = ref(false);
const top = ref(0);
const left = ref(0);
const selectedTag = ref({});
const affixTags = ref([]);
const scrollPaneRef = ref(null);
const currentTag = ref({});

const { proxy } = getCurrentInstance();
const route = useRoute();
const router = useRouter();

const visitedViews = computed(() => useTagsViewStore().visitedViews);
const routes = computed(() => usePermissionStore().routes);
const theme = computed(() => useSettingsStore().theme);

const renderIcon = (icon) => {
  return () => {
    return h(NIcon, null, {
      default: () => h(icon)
    })
  }
}

const options = computed(()=>[
  {
    label: "刷新页面",
    key: "refreshSelectedTag",
    icon: renderIcon(Refresh)
  },
  {
    type: "divider",
    key: "d1"
  },
  {
    label: "关闭当前",
    key: "closeSelectedTag",
    show: !isAffix(selectedTag.value),
    icon: renderIcon(Close)
  },
  {
    label: "关闭其他",
    key: "closeOthersTags",
    icon: renderIcon(CloseCircle)
  },
  {
    label: "关闭左侧",
    key: "closeLeftTags",
    show: !isFirstView(),
    icon: renderIcon(Left)
  },
  {
    label: "关闭右侧",
    key: "closeRightTags",
    show: !isLastView(),
    icon: renderIcon(Right)
  },
  {
    label: "全部关闭",
    key: "closeAllTags",
    icon: renderIcon(CloseMultiple)
  }
]);

function handleSelect(item) {
  switch (item) {
    case 'refreshSelectedTag':
      refreshSelectedTag(selectedTag.value);
      break;
    case 'closeSelectedTag':
      closeSelectedTag(selectedTag.value);
      break;
    case 'closeOthersTags':
      closeOthersTags();
      break;
    case 'closeLeftTags':
      closeLeftTags();
      break;
    case 'closeRightTags':
      closeRightTags();
      break;
    case 'closeAllTags':
      closeAllTags(selectedTag.value);
      break;
  }
}

watch(route, () => {
  addTags()
  updateCurrentTag()
  // moveToCurrentTag()
})
watch(visible, (value) => {
  if (value) {
    document.body.addEventListener('click', closeMenu)
  } else {
    document.body.removeEventListener('click', closeMenu)
  }
})
onMounted(() => {
  initTags()
  addTags()
  updateCurrentTag()
})

function isActive(r) {
  return r.path === route.path
}
function activeStyle(tag) {
  if (!isActive(tag)) return {};
  return {
    "background-color": theme.value,
    "border-color": theme.value
  };
}
function isAffix(tag) {
  return tag.meta && tag.meta.affix
}
function isFirstView() {
  try {
    return selectedTag.value.fullPath === '/index' || selectedTag.value.fullPath === visitedViews.value[1].fullPath
  } catch (err) {
    return false
  }
}
function isLastView() {
  try {
    return selectedTag.value.fullPath === visitedViews.value[visitedViews.value.length - 1].fullPath
  } catch (err) {
    return false
  }
}
function filterAffixTags(routes, basePath = '') {
  let tags = []
  routes.forEach(route => {
    if (route.meta && route.meta.affix) {
      const tagPath = getNormalPath(basePath + '/' + route.path)
      tags.push({
        fullPath: tagPath,
        path: tagPath,
        name: route.name,
        meta: { ...route.meta }
      })
    }
    if (route.children) {
      const tempTags = filterAffixTags(route.children, route.path)
      if (tempTags.length >= 1) {
        tags = [...tags, ...tempTags]
      }
    }
  })
  return tags
}
function navigate(route) {
  router.push(route)
}
function initTags() {
  const res = filterAffixTags(routes.value);
  affixTags.value = res;
  for (const tag of res) {
    // Must have tag name
    if (tag.name) {
       useTagsViewStore().addVisitedView(tag)
    }
  }
}
function addTags() {
  const { name } = route
  if (name) {
    useTagsViewStore().addView(route)
    if (route.meta.link) {
      useTagsViewStore().addIframeView(route);
    }
  }
  return false
}
function moveToCurrentTag() {
  nextTick(() => {
    for (const r of visitedViews.value) {
      if (r.path === route.path) {
        scrollPaneRef.value.moveToTarget(r);
        // when query is different then update
        if (r.fullPath !== route.fullPath) {
          useTagsViewStore().updateVisitedView(route)
        }
      }
    }
  })
}
function updateCurrentTag() {
  currentTag.value = visitedViews.value.filter((item) => isActive(item))[0].path
}
function refreshSelectedTag(view) {
  proxy.$tab.refreshPage(view);
  if (route.meta.link) {
    useTagsViewStore().delIframeView(route);
  }
}
// function handleClose(name) {
//   const { value: panels } = panelsRef;
//   if (panels.length === 1) {
//     message.error("最后一个了");
//     return;
//   }
//   message.info("关掉 " + name);
//   const index = panels.findIndex((v) => name === v);
//   panels.splice(index, 1);
//   if (nameRef.value === name) {
//     nameRef.value = panels[index];
//   }
// }
function closeSelectedTag(view) {
  proxy.$tab.closePage(view).then(({ visitedViews }) => {
    if (isActive(view)) {
      toLastView(visitedViews, view)
    }
  })
}
function closeRightTags() {
  proxy.$tab.closeRightPage(selectedTag.value).then(visitedViews => {
    if (!visitedViews.find(i => i.fullPath === route.fullPath)) {
      toLastView(visitedViews)
    }
  })
}
function closeLeftTags() {
  proxy.$tab.closeLeftPage(selectedTag.value).then(visitedViews => {
    if (!visitedViews.find(i => i.fullPath === route.fullPath)) {
      toLastView(visitedViews)
    }
  })
}
function closeOthersTags() {
  router.push(selectedTag.value).catch(() => { });
  proxy.$tab.closeOtherPage(selectedTag.value).then(() => {
    moveToCurrentTag()
  })
}
function closeAllTags(view) {
  proxy.$tab.closeAllPage().then(({ visitedViews }) => {
    if (affixTags.value.some(tag => tag.path === route.path)) {
      return
    }
    toLastView(visitedViews, view)
  })
}
function toLastView(visitedViews, view) {
  const latestView = visitedViews.slice(-1)[0]
  if (latestView) {
    router.push(latestView.fullPath)
  } else {
    // now the default is to redirect to the home page if there is no tags-view,
    // you can adjust it according to your needs.
    if (view.name === 'Dashboard') {
      // to reload home page
      router.replace({ path: '/redirect' + view.fullPath })
    } else {
      router.push('/')
    }
  }
}
function openMenu(tag, e) {
  const menuMinWidth = 105
  // const offsetLeft = proxy.$el.getBoundingClientRect().left // container margin left
  const offsetLeft = e.clientX // container margin left
  const offsetWidth = proxy.$el.offsetWidth // container width
  const maxLeft = offsetWidth - menuMinWidth // left boundary
  const l = e.clientX - offsetLeft + 15 // 15: margin right

  if (l > maxLeft) {
    left.value = maxLeft
  } else {
    left.value = l
  }
  left.value = e.clientX
  top.value = e.clientY
  visible.value = true
  selectedTag.value = tag
}
function closeMenu() {
  visible.value = false
}
function handleScroll() {
  closeMenu()
}
</script>

<style lang='scss' scoped>
.tags-view-container {
  padding-left: 10px;
  .tags-view-wrapper {
    .tags-view-item {
      display: inline-block;
      position: relative;
      cursor: pointer;
      height: 26px;
      line-height: 26px;
      border: 1px solid #d8dce5;
      color: #495060;
      background: #fff;
      padding: 0 8px;
      font-size: 12px;
      margin-left: 5px;
      margin-top: 4px;
      &:first-of-type {
        margin-left: 15px;
      }
      &:last-of-type {
        margin-right: 15px;
      }
      &.active {
        background-color: #42b983;
        color: #fff;
        border-color: #42b983;
        &::before {
          content: "";
          background: #fff;
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          position: relative;
          margin-right: 2px;
        }
      }
    }
  }
}
</style>

<style lang="scss">
//reset element css of el-icon-close
.tags-view-wrapper {
  .tags-view-item {
    .el-icon-close {
      width: 16px;
      height: 16px;
      vertical-align: 2px;
      border-radius: 50%;
      text-align: center;
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      transform-origin: 100% 50%;
      &:before {
        transform: scale(0.6);
        display: inline-block;
        vertical-align: -3px;
      }
      &:hover {
        background-color: #b4bccc;
        color: #fff;
        width: 12px !important;
        height: 12px !important;
      }
    }
  }
}
</style>