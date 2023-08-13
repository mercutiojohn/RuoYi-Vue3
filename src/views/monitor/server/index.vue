<template>
  <n-layout embedded class="app-container">
    <el-row>
      <el-col :span="12" class="card-box">
        <n-card size="small">
          <template #header>
            <Cpu style="width: 1em; height: 1em; vertical-align: middle" />CPU
            <n-statistic
              label="核心数"
              :value="server.cpu.cpuNum"
              v-if="server.cpu"
            >
            </n-statistic>
          </template>
          <n-space vertical :size="10" v-if="server.cpu">
            <n-grid x-gap="20" y-gap="15" :cols="3">
              <n-gi>
                <n-statistic label="用户使用率">
                  {{ server.cpu.used }}%
                </n-statistic>
              </n-gi>
              <n-gi>
                <n-statistic label="系统使用率">
                  {{ server.cpu.sys }}%
                </n-statistic>
              </n-gi>
              <n-gi>
                <n-statistic label="当前空闲率">
                  {{ server.cpu.free }}%
                </n-statistic>
              </n-gi>
            </n-grid>
            <n-progress
              :status="100 - server.cpu.free > 80 ? 'warning' : 'info'"
              type="line"
              :percentage="100 - server.cpu.free"
              :show-indicator="false"
            />
          </n-space>
        </n-card>
      </el-col>

      <el-col :span="12" class="card-box">
        <n-card size="small">
          <template #header>
            <Tickets style="width: 1em; height: 1em; vertical-align: middle" />
            内存
          </template>
          <n-space vertical :size="10">
            <n-card size="small" title="物理内存" embedded :bordered="false" v-if="server.mem">
              <n-space vertical :size="10">
              <n-grid x-gap="20" y-gap="15" :cols="4">
                <n-gi>
                  <n-statistic label="总内存">
                    {{ server.mem.total }}GB
                  </n-statistic>
                </n-gi>
                <n-gi>
                  <n-statistic label="已用内存">
                    {{ server.mem.used }}GB
                  </n-statistic>
                </n-gi>
                <n-gi>
                  <n-statistic label="剩余内存">
                    {{ server.mem.free }}GB
                  </n-statistic>
                </n-gi>
                <n-gi>
                  <n-statistic label="使用率">
                    {{ server.mem.usage }}%
                  </n-statistic>
                </n-gi>
              </n-grid>
              <n-progress
                :status="server.mem.usage > 80 ? 'warning' : 'info'"
                type="line"
                :percentage="server.mem.usage"
                :show-indicator="false"
              />
              </n-space>
            </n-card>
            <n-card size="small" title="JVM" embedded :bordered="false" v-if="server.jvm">
              <n-space vertical :size="10">
              <n-grid x-gap="20" y-gap="15" :cols="4">
                <n-gi>
                  <n-statistic label="总内存">
                    {{ server.jvm.total }}MB
                  </n-statistic>
                </n-gi>
                <n-gi>
                  <n-statistic label="已用内存">
                    {{ server.jvm.used }}MB
                  </n-statistic>
                </n-gi>
                <n-gi>
                  <n-statistic label="剩余内存">
                    {{ server.jvm.free }}MB
                  </n-statistic>
                </n-gi>
                <n-gi>
                  <n-statistic label="使用率">
                    {{ server.jvm.usage }}%
                  </n-statistic>
                </n-gi>
              </n-grid>
              <n-progress
                :status="server.jvm.usage > 80 ? 'warning' : 'info'"
                type="line"
               
                :percentage="server.jvm.usage"
                :show-indicator="false"
              />
              </n-space>
            </n-card>
          </n-space>
        </n-card>
      </el-col>

      <el-col :span="24" class="card-box">
        <el-card>
          <template #header
            ><Monitor style="width: 1em; height: 1em; vertical-align: middle" />
            <span style="vertical-align: middle">服务器信息</span></template
          >
          <div class="el-table el-table--enable-row-hover el-table--medium">
            <table cellspacing="0" style="width: 100%">
              <tbody>
                <tr>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">服务器名称</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell" v-if="server.sys">
                      {{ server.sys.computerName }}
                    </div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">操作系统</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell" v-if="server.sys">
                      {{ server.sys.osName }}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">服务器IP</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell" v-if="server.sys">
                      {{ server.sys.computerIp }}
                    </div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">系统架构</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell" v-if="server.sys">
                      {{ server.sys.osArch }}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </el-card>
      </el-col>

      <el-col :span="24" class="card-box">
        <el-card>
          <template #header
            ><CoffeeCup
              style="width: 1em; height: 1em; vertical-align: middle"
            />
            <span style="vertical-align: middle">Java虚拟机信息</span></template
          >
          <div class="el-table el-table--enable-row-hover el-table--medium">
            <table cellspacing="0" style="width: 100%; table-layout: fixed">
              <tbody>
                <tr>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">Java名称</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell" v-if="server.jvm">
                      {{ server.jvm.name }}
                    </div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">Java版本</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell" v-if="server.jvm">
                      {{ server.jvm.version }}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">启动时间</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell" v-if="server.jvm">
                      {{ server.jvm.startTime }}
                    </div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">运行时长</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell" v-if="server.jvm">
                      {{ server.jvm.runTime }}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td colspan="1" class="el-table__cell is-leaf">
                    <div class="cell">安装路径</div>
                  </td>
                  <td colspan="3" class="el-table__cell is-leaf">
                    <div class="cell" v-if="server.jvm">
                      {{ server.jvm.home }}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td colspan="1" class="el-table__cell is-leaf">
                    <div class="cell">项目路径</div>
                  </td>
                  <td colspan="3" class="el-table__cell is-leaf">
                    <div class="cell" v-if="server.sys">
                      {{ server.sys.userDir }}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td colspan="1" class="el-table__cell is-leaf">
                    <div class="cell">运行参数</div>
                  </td>
                  <td colspan="3" class="el-table__cell is-leaf">
                    <div class="cell" v-if="server.jvm">
                      {{ server.jvm.inputArgs }}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </el-card>
      </el-col>

      <el-col :span="24" class="card-box">
        <el-card>
          <template #header
            ><MessageBox
              style="width: 1em; height: 1em; vertical-align: middle"
            />
            <span style="vertical-align: middle">磁盘状态</span></template
          >
          <div class="el-table el-table--enable-row-hover el-table--medium">
            <table cellspacing="0" style="width: 100%">
              <thead>
                <tr>
                  <th class="el-table__cell el-table__cell is-leaf">
                    <div class="cell">盘符路径</div>
                  </th>
                  <th class="el-table__cell is-leaf">
                    <div class="cell">文件系统</div>
                  </th>
                  <th class="el-table__cell is-leaf">
                    <div class="cell">盘符类型</div>
                  </th>
                  <th class="el-table__cell is-leaf">
                    <div class="cell">总大小</div>
                  </th>
                  <th class="el-table__cell is-leaf">
                    <div class="cell">可用大小</div>
                  </th>
                  <th class="el-table__cell is-leaf">
                    <div class="cell">已用大小</div>
                  </th>
                  <th class="el-table__cell is-leaf">
                    <div class="cell">已用百分比</div>
                  </th>
                </tr>
              </thead>
              <tbody v-if="server.sysFiles">
                <tr v-for="(sysFile, index) in server.sysFiles" :key="index">
                  <td class="el-table__cell is-leaf">
                    <div class="cell">{{ sysFile.dirName }}</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">{{ sysFile.sysTypeName }}</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">{{ sysFile.typeName }}</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">{{ sysFile.total }}</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">{{ sysFile.free }}</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">{{ sysFile.used }}</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div
                      class="cell"
                      :class="{ 'text-danger': sysFile.usage > 80 }"
                    >
                      {{ sysFile.usage }}%
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </n-layout>
</template>

<script setup>
import { getServer } from "@/api/monitor/server";

const server = ref([]);
const { proxy } = getCurrentInstance();

function getList() {
  proxy.$modal.loading("正在加载服务监控数据，请稍候！");
  getServer().then((response) => {
    server.value = response.data;
    proxy.$modal.closeLoading();
  });
}

getList();
</script>
