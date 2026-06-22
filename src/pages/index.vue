<template>
  <v-container>
    <v-row>
      <v-col class="text-center d-flex justify-center" cols="12">
        <digit-number
          v-for="(text, idx) in timeleftText"
          :key="idx"
          color="white"
          :data="text"
        />
      </v-col>

      <v-col class="text-center" cols="12">
        <h1>{{ list.currentItem || '沒有事項' }}</h1>
      </v-col>

      <v-col class="text-center d-flex ga-5 justify-center" cols="12">
        <v-btn
          :disabled="status === STATUS.COUNTING || (list.currentItem.length === 0 && list.items.length === 0)"
          icon="mdi-play"
          @click="startTimer"
        />

        <v-btn
          :disabled="status !== STATUS.COUNTING"
          icon="mdi-pause"
          @click="pauseTimer"
        />

        <v-btn
          :disabled="list.currentItem.length === 0"
          icon="mdi-skip-next"
          @click="finish"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
  import { useWebNotification } from '@vueuse/core'
  import { computed, ref } from 'vue'
  import DigitNumber from '@/components/DigitNumber.vue'
  import { useListStore } from '@/stores/list'
  import { useSettingsStore } from '@/stores/settings'
  import { useTimeStore } from '@/stores/time'

  const list = useListStore()
  const time = useTimeStore()
  const settings = useSettingsStore()

  const timeleftText = computed(() => {
    const m = Math.floor(time.timeleft / 60).toString().padStart(2, '0')
    const s = (time.timeleft % 60).toString().padStart(2, '0')

    return `${m}:${s}`
  })

  const STATUS = {
    STOP: 0,
    COUNTING: 1,
    PAUSE: 2,
  }
  const status = ref(STATUS.STOP)
  let timer = 0

  const startTimer = () => {
    if (status.value === STATUS.STOP && list.currentItem === '') {
      if (time.isBreakTime) {
        list.currentItem = '休息一下'
        time.timeleft = time.currentBreakTime
      } else {
        const nextItem = list.items.shift()

        if (nextItem) {
          list.currentItem = nextItem.text
          time.timeleft = nextItem.time ?? time.TIME
          time.currentBreakTime = nextItem.breakTime ?? time.TIME_BREAK
        }
      }
    }

    status.value = STATUS.COUNTING

    timer = setInterval(() => {
      time.timeleft--
      if (time.timeleft <= 0) {
        finish()
      }
    }, 1000)
  }

  const finish = () => {
    clearInterval(timer)

    status.value = STATUS.STOP

    const audio = new Audio()
    audio.src = settings.selectedAlarm.file
    audio.play()

    const { show, isSupported, permissionGranted } = useWebNotification({
      title: '事項完成',
      body: list.currentItem,
      icon: new URL('@/assets/food.png', import.meta.url).href,
    })

    if (isSupported.value && permissionGranted.value) {
      show()
    }

    if (!time.isBreakTime) {
      list.finishedItems.push({
        id: list.id++,
        text: list.currentItem,
      })
    }

    list.currentItem = ''

    time.isBreakTime = list.items.length > 0 ? !time.isBreakTime : false

    if (time.isBreakTime) {
      time.timeleft = time.currentBreakTime
    } else if (list.items.length > 0) {
      time.timeleft = list.items[0].time ?? time.TIME
    } else {
      time.timeleft = time.TIME
    }

    if (time.isBreakTime === false && list.items.length > 0) {
      time.currentBreakTime = list.items[0].breakTime ?? time.TIME_BREAK
    }

    if (list.items.length > 0 || time.isBreakTime) {
      startTimer()
    }
  }

  const pauseTimer = () => {
    clearInterval(timer)
    status.value = STATUS.PAUSE
  }
</script>

<route lang="yaml">
meta:
  title: 首頁
</route>
