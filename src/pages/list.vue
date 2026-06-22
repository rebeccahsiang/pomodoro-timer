<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-center">未完成</h1>
      </v-col>

      <v-col cols="12">
        <v-row>
          <v-col cols="8">
            <v-text-field
              ref="newItemTextField"
              v-model="newItem"
              clearable
              hint="三個字以上才能新增"
              label="新增事項名稱"
              :rules="[rules.required(), rules.minLength(3)]"
              variant="outlined"
              @keydown.enter="addItem"
              @update:focused="onNewItemFocusUpdate"
            />
          </v-col>

          <v-col cols="4">
            <v-text-field
              v-model.number="newItemTime"
              append-icon="mdi-plus"
              label="專注時間 (分鐘)"
              min="1"
              type="number"
              variant="outlined"
              @click:append="addItem"
              @keydown.enter="addItem"
            />
          </v-col>
        </v-row>

        <v-table>
          <thead>
            <tr>
              <th>名稱</th>

              <th>操作</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(item, idx) in list.items" :key="item.id">
              <td>
                <v-text-field
                  v-show="item.edit"
                  ref="editItemTextField"
                  v-model="item.model"
                  autofocus
                  hide-details="auto"
                  :rules="[rules.required(), rules.minLength(3)]"
                  variant="outlined"
                  @keydown.enter="submitEditItem(item, idx)"
                />

                <template v-if="!item.edit">
                  <span>{{ item.text }}</span>

                  <v-chip
                    class="ml-2"
                    color="red-lighten-1"
                    size="small"
                    variant="flat"
                  >
                    專注: {{ ((item.time !== undefined ? item.time : 1500) / 60).toFixed(1).replace('.0', '') }}分
                  </v-chip>

                  <v-chip
                    class="ml-1"
                    color="amber-darken-1"
                    size="small"
                    variant="flat"
                  >
                    休息: {{ ((item.breakTime !== undefined ? item.breakTime : 300) / 60).toFixed(1).replace('.0', '') }}分
                  </v-chip>
                </template>
              </td>

              <td>
                <template v-if="item.edit">
                  <v-btn
                    icon="mdi-undo"
                    variant="text"
                    @click="cancelEditItem(item)"
                  />

                  <v-btn
                    icon="mdi-check"
                    variant="text"
                    @click="submitEditItem(item, idx)"
                  />
                </template>

                <template v-else>
                  <v-btn
                    icon="mdi-pencil"
                    variant="text"
                    @click="editItem(item)"
                  />

                  <v-btn
                    icon="mdi-delete"
                    variant="text"
                    @click="delItem(item.id)"
                  />
                </template>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-col>

      <v-col cols="12">
        <h1 class="text-center">已完成</h1>
      </v-col>

      <v-col cols="12">
        <v-table>
          <thead>
            <tr>
              <th>名稱</th>

              <th>操作</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="item in list.finishedItems" :key="item.id">
              <td>{{ item.text }}</td>

              <td>
                <v-btn
                  icon="mdi-delete"
                  variant="text"
                  @click="delFinishedItem(item.id)"
                />
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
  import { nextTick, ref, useTemplateRef } from 'vue'
  import { useRules } from 'vuetify/labs/rules'
  import { useListStore } from '@/stores/list'

  const list = useListStore()
  const rules = useRules()

  const newItem = ref('')
  const newItemTime = ref(25)
  const newItemTextField = useTemplateRef('newItemTextField')

  const addItem = () => {
    if (!newItemTextField.value.isValid) return

    const mins = Number.parseInt(newItemTime.value, 10) || 25

    if (mins > 50) {
      let remaining = mins
      let phase = 1

      while (remaining > 0) {
        const currentPhaseMinutes = Math.min(remaining, 50)
        const currentBreakMinutes = currentPhaseMinutes / 5

        list.items.push({
          id: list.id++,
          text: `${newItem.value} (階段${phase})`,
          time: currentPhaseMinutes * 60,
          breakTime: currentBreakMinutes * 60,
          edit: false,
          model: `${newItem.value} (階段${phase})`,
        })

        remaining -= currentPhaseMinutes
        phase++
      }
    } else {
      const breakMinutes = mins / 5

      list.items.push({
        id: list.id++,
        text: newItem.value,
        time: mins * 60,
        breakTime: breakMinutes * 60,
        edit: false,
        model: newItem.value,
      })
    }

    newItem.value = ''
    newItemTime.value = 25
    newItemTextField.value.resetValidation()
  }

  const onNewItemFocusUpdate = async focus => {
    if (!focus && !newItem.value) {
      await nextTick()
      newItemTextField.value.resetValidation()
    }
  }

  const delItem = id => {
    const idx = list.items.findIndex(item => item.id === id)
    list.items.splice(idx, 1)
  }

  const editItem = item => {
    item.edit = true
  }

  const cancelEditItem = item => {
    item.edit = false
    item.model = item.text
  }

  const editItemTextField = useTemplateRef('editItemTextField')

  const submitEditItem = (item, idx) => {
    if (!editItemTextField.value[idx].isValid) return
    item.edit = false
    item.text = item.model
  }

  const delFinishedItem = id => {
    const idx = list.finishedItems.findIndex(item => item.id === id)
    list.finishedItems.splice(idx, 1)
  }
</script>

<route lang="yaml">
meta:
  title: 事項
</route>
