<template>
  <v-app class="dark-app">
    <!-- 導覽列：紅色底 + 全白文字與圖標 -->
    <v-app-bar
      class="px-4 text-white"
      color="red-darken-1"
      flat
    >
      <v-container class="d-flex align-center pa-0 text-white">
        <!-- 番茄圖示與標題 -->
        <v-icon class="tomato-icon mr-2 text-white" size="large">mdi-tomato</v-icon>

        <v-app-bar-title class="font-weight-black text-h6 text-white">
          番茄鐘
        </v-app-bar-title>

        <v-spacer />

        <!-- 電腦版導覽按鈕 -->
        <div class="d-none d-md-flex align-center gap-2">
          <v-btn
            class="text-white"
            prepend-icon="mdi-home-outline"
            rounded="xl"
            to="/"
            variant="text"
          >首頁</v-btn>

          <v-btn
            class="text-white"
            prepend-icon="mdi-format-list-bulleted"
            rounded="xl"
            to="/list"
            variant="text"
          >事項</v-btn>

          <v-btn
            class="text-white"
            prepend-icon="mdi-cog-outline"
            rounded="xl"
            to="/settings"
            variant="text"
          >設定</v-btn>
        </div>

        <!-- 主題切換按鈕 -->
        <v-btn
          class="ml-2 theme-toggle-btn text-white"
          :icon="theme.global.name.value === 'dark' ? 'mdi-weather-sunny' : 'mdi-weather-night'"
          variant="text"
          @click="toggleTheme"
        />

        <!-- 手機版漢堡按鈕 -->
        <v-app-bar-nav-icon class="d-flex d-md-none ml-2 text-white" @click="drawer = !drawer" />
      </v-container>
    </v-app-bar>

    <!-- 手機版側邊選單 -->
    <v-navigation-drawer v-model="drawer" class="bg-grey-darken-4 text-white" location="right" temporary>
      <v-list nav>
        <v-list-item class="text-white" prepend-icon="mdi-home-outline" title="首頁" to="/" />
        <v-list-item class="text-white" prepend-icon="mdi-format-list-bulleted" title="事項" to="/list" />
        <v-list-item class="text-white" prepend-icon="mdi-cog-outline" title="設定" to="/settings" />
      </v-list>
    </v-navigation-drawer>

    <!-- 身體背景：固定深色底 -->
    <v-main class="main-body text-white">
      <router-view v-slot="{ Component }">
        <transition mode="out-in" name="page-fade">
          <keep-alive include="index">
            <component :is="Component" />
          </keep-alive>
        </transition>
      </router-view>
    </v-main>

    <!-- 頁尾 -->
    <v-footer class="text-center justify-center text-caption py-3 border-t bg-grey-darken-4 text-grey-lighten-1" height="auto" style="border-color: rgba(255,255,255,0.1) !important;">
      <div class="footer-content">
        <span>© {{ new Date().getFullYear() }} Pomodoro Timer.</span>

        <a
          class="attribution-link ml-2 text-grey-lighten-1"
          href="https://www.flaticon.com/free-icons/pomodoro"
          target="_blank"
          title="pomodoro icons"
        >
          Icon by Atif Arshad
        </a>
      </div>
    </v-footer>
  </v-app>
</template>

<script setup>
  import { ref } from 'vue'
  import { useTheme } from 'vuetify'

  const drawer = ref(false)
  const theme = useTheme()

  const toggleTheme = () => {
    theme.global.name.value = theme.global.name.value === 'dark' ? 'light' : 'dark'
  }
</script>

<style scoped>
/* 身體固定深色背景與字體顏色 */
.main-body {
  background-color: #121212 !important;
  color: #ffffff !important;
  min-height: 100vh;
}

/* 番茄圖示微動畫 */
.tomato-icon {
  transition: transform 0.3s ease;
}
.tomato-icon:hover {
  transform: rotate(15deg) scale(1.1);
}

/* 按鈕之間的間距 */
.gap-2 {
  gap: 8px;
}

/* 頁面切換漸變動畫 */
.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.page-fade-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.page-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* 連結懸停效果 */
.attribution-link {
  text-decoration: none;
  border-bottom: 1px dashed currentColor;
  transition: color 0.2s ease;
}
.attribution-link:hover {
  color: #ff5252 !important;
}

/* 全域/深度覆寫計時器數字（SVG 的 active 元素）為亮白色與霓虹燈發光陰影效果 */
:deep(svg.圖層_1) .active {
  fill: #FFFFFF !important;
  filter: drop-shadow(0px 0px 10px #FF5252) drop-shadow(0px 0px 2px #FFEB3B); /* 紅色與黃色霓虹發光疊加 */
}

/* 主題切換按鈕微動畫 */
.theme-toggle-btn {
  transition: transform 0.3s ease;
}
.theme-toggle-btn:hover {
  transform: rotate(30deg);
}
</style>
