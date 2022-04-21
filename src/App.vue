<!--
 * @Date: 2022-04-19 13:50:35
 * @LastEditors: Lukesy
 * @LastEditTime: 2022-04-21 13:42:36
-->
<template>
  <div id="app">
    <div v-if="$route.meta.headReturn && !system" class="header-nav">
      <HeaderNav :title="$route.meta.title" />
    </div>
    <AppProvider>
      <router-view />
    </AppProvider>
  </div>
</template>

<script>
import AppProvider from '@/components/AppProvider'
import HeaderNav from '@/components/headerNav'
import { getDevicePlatform } from '@/utils'
export default {
  components: { AppProvider, HeaderNav },
  data() {
    return {
      system: false,
    }
  },
  created() {
    this.system = getDevicePlatform().isInWeChatApp || getDevicePlatform().isInMiniProgram
  },
}
</script>
<style>
.header-nav {
  width: 100%;
  height: 46px;
}
</style>
