<!--
 * @Date: 2022-04-19 13:50:35
 * @LastEditors: Lukesy
 * @LastEditTime: 2022-04-20 18:11:57
-->
<template>
  <div id="app">
    <div v-if="$route.meta.headReturn" class="header-nav">
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
export default {
  components: { AppProvider, HeaderNav },
}
</script>
<style>
.header-nav {
  width: 100%;
  height: 46px;
}
</style>
