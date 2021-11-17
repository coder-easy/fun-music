<template>
  <div class="danmaku-wrap" ref="domRef" @animationend="handleAnimationEnd">
    <template v-if="domSize">
      <div
        class="danmaku"
        :data-idx="item.idx"
        :style="item.style"
        :key="item.idx"
        v-for="item of danmakuList"
      >
        {{ item.msg }}
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import {
  getRandomNum,
  calcDanmakuTop,
  getRandomColor,
  calcDanmakuTime,
} from "@/utils/index";
import useDomSize from "@/hooks/useDomSize";
import socket from "@/utils/socket";
import { NEW_DANMAKU } from "@/constants/event";

const { domRef, domSize } = useDomSize();

const fontSize = 20;

const danmakuList = ref([]);
// 弹幕列表

const handleDanmaku = (msg) => {
  const { height, width } = domSize.value;
  const msgWidth = fontSize * msg.length;
  const style = {
    "--width": msgWidth,
    "--top": calcDanmakuTop(height, 10),
    "--box-width": width,
    "--color": getRandomColor(),
    "--duration": calcDanmakuTime(width, msgWidth),
  };

  danmakuList.value.push({
    msg,
    idx: getRandomColor() + Date.now(),
    style,
  });
};

// 动画结束后从弹幕池里清除弹幕
const handleAnimationEnd = ({ target }) => {
  const { idx } = target.dataset;
  if (target.classList.contains("danmaku") && idx !== undefined) {
    const index = danmakuList.value.findIndex((i) => i.idx == idx);
    index && danmakuList.value.splice(index, 1);
  }
};

onMounted(() => {
  socket.on(NEW_DANMAKU, (e) => {
    handleDanmaku(e);
  });
});
</script>

<style scoped lang="scss">
.danmaku-wrap {
  height: calc(100% - 40px - 600px);
  border: 1px solid #ccc;
  border-radius: 20px;
  position: relative;
  overflow: hidden;

  @keyframes move {
    0% {
      right: calc(var(--width) * -1px);
    }

    100% {
      right: calc(var(--box-width) * 1px + var(--width) * 1px);
    }
  }

  .danmaku {
    position: absolute;
    right: calc(var(--width) * -1px);
    width: calc(var(--width) * 1px);
    top: calc(var(--top) * 1px);
    font-size: calc(v-bind(fontSize) * 1px);
    color: var(--color);
    animation: move calc(var(--duration) * 1s) linear forwards;
  }
}
</style>
