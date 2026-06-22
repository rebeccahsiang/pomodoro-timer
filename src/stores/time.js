import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTimeStore = defineStore('time', () => {
  const TIME = import.meta.env.VITE_TIME
  const TIME_BREAK = import.meta.env.VITE_TIME_BREAK

  // 目前事項剩餘時間
  const timeleft = ref(TIME)
  // 是否是休息時間
  const isBreakTime = ref(false)
  // 動態休息時間記錄
  const currentBreakTime = ref(TIME_BREAK)

  return {
    TIME,
    TIME_BREAK,
    timeleft,
    isBreakTime,
    currentBreakTime,
  }
}, {
  persist: {
    key: 'pomodoro-time',
    pick: ['timeleft', 'isBreakTime', 'currentBreakTime'],
  },
})
