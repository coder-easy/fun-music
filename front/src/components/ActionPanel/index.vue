<template>
  <div class="action-panel-wrap" @click="handleClick">
    <div
      class="btn"
      :class="{ disabled: !!item.disabled }"
      v-for="item of btnConfig"
      :key="item.text"
      :data-event="item.event"
      :style="{ '--bg': item.bg, '--color': item.color }"
    >
      {{ item.text }}
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import {
  START_RECORD,
  STOP_RECORD,
  PLAY_MUSIC,
  STOP_MUSIC,
} from "@/constants/event";

const props = defineProps({
  isRecord: Boolean,
  isPlay: Boolean,
});

const emit = defineEmits([START_RECORD, STOP_RECORD, PLAY_MUSIC, STOP_MUSIC]);

const btnConfig = computed(() => {
  return [
    {
      text: props.isRecord ? "正在录制" : "开始录制",
      bg: "#ffefe5",
      disabled: props.isRecord,
      event: START_RECORD,
    },
    {
      text: "结束录制",
      bg: "#dce3f1",
      disabled: !props.isRecord,
      event: STOP_RECORD,
    },
    {
      text: props.isPlay ? "正在播放音乐" : "播放选中音乐",
      bg: "#e9d7df",
      disabled: props.isPlay,
      event: PLAY_MUSIC,
    },
    {
      text: "结束播放",
      bg: "#2486b9",
      color: "#fff",
      disabled: !props.isPlay,
      event: STOP_MUSIC,
    },
  ];
});

const handleClick = ({ target }) => {
  const { event } = target.dataset;
  if (event === undefined) return;
  emit(event);
};
</script>

<style scoped lang="scss">
.action-panel-wrap {
  margin-right: 20px;
  width: 320px;

  .btn {
    margin: 0 auto 16px;
    width: 80%;
    height: 80px;
    background: var(--bg);
    border-radius: 40px;
    text-align: center;
    line-height: 80px;
    font-size: 32px;
    color: #000;
    cursor: pointer;
    color: var(--color);
    user-select: none;

    &.disabled {
      cursor: not-allowed;
    }
  }
}
</style>
