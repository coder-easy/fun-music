<template>
  <div
    class="play-wrapper"
    tabindex="-1"
    ref="wrapDom"
    @keydown="handleKeyDown"
    @keyup="handleKeyUp"
    @mousedown="handleMouseDown"
    @mouseup="handleMouseUp"
    @mouseout="handleMouseOut"
  >
    <div
      class="key"
      :class="[item.active ? 'active' : '', item.isBlack ? 'black' : 'white']"
      ref="whiteKeys"
      v-for="(item, index) of configs"
      :key="item.soundId"
      :style="item.isBlack ? `--idx: ${item.idx}` : ''"
    >
      <span
        v-for="(key, idx) of item.keys"
        :class="{
          tobottom: !item.isBlack && item.keys.length === 2 && idx === 0,
        }"
        :key="key"
      >
        {{ key }}
      </span>
      <div class="mask" :data-idx="index"></div>
      <!-- 琴键蒙层，屏蔽其他子元素的干扰。 -->
    </div>

    <div class="tips">您可以用鼠标或键盘开始您的表演~</div>
    <div class="tips2">将鼠标移动到此处点击后才可开始演奏嗷~</div>
  </div>
</template>

<script setup>
import keyConfig from "@/components/Piano/config";
import SOUNDS from "@/libs/sound";
import { ref, onMounted } from "vue";
import { PLAY_PIANO } from "@/constants/event";
import { SOUND_KEY } from "@/constants/keys";
import { playMusic } from "@/utils/index";

const configs = ref(keyConfig);
const keyMap = createKeyMap(configs.value);
const MOUSE_KEY = "mouse";
const wrapDom = ref(null);

onMounted(() => {
  wrapDom.value && wrapDom.value.focus();
});

const emit = defineEmits([PLAY_PIANO]);

function createKeyMap(configs) {
  // 映射按键到对应的配置项目

  const map = new Map();
  configs.forEach((item) => {
    item.keys.forEach((key) => {
      map.set(key, item);
    });
  });

  return map;
}

// 激活琴键并记录状态
function setKeyActive(item, key) {
  if (item.active) return;
  // 琴键处于激活状态时返回

  emit(PLAY_PIANO, {
    id: item.soundId,
    time: Date.now(),
  });
  playSound(item.soundId);
  // 播放声音

  item.active = true;
  item.emitKey = key;
  // 记录激活状态，和激活时使用的key
}

// 取消激活琴键并清除状态
function setKeyInActive(item, key) {
  if (!item.active) return;
  // 琴键没有处于激活状态时返回

  if (item.emitKey !== key) return;
  // 如果触发事件的键不是触发琴键时的键则返回

  item.active = false;
  item.emitKey = null;
  // 清除激活状态
}

// 鼠标按下事件
function handleMouseDown({ target }) {
  const { idx } = target.dataset;
  if (idx === undefined) return;
  const item = configs.value[idx];
  setKeyActive(item, MOUSE_KEY);
}

// 鼠标松开事件
function handleMouseUp({ target }) {
  const { idx } = target.dataset;
  if (idx === undefined) return;
  const item = configs.value[idx];
  setKeyInActive(item, MOUSE_KEY);
}

// 鼠标处于按下状态时离开琴键范围则清除激活状态
function handleMouseOut({ target }) {
  const { idx } = target.dataset;
  if (!target.classList.contains("mask") || idx === undefined) return;
  const item = configs.value[idx];
  setKeyInActive(item, MOUSE_KEY);
}

// 键盘按下事件
function handleKeyDown({ key }) {
  key = key.toLowerCase();
  if (!keyMap.has(key)) return;
  const item = keyMap.get(key);
  setKeyActive(item, key);
}

// 键盘松开事件
function handleKeyUp({ key }) {
  key = key.toLowerCase();
  if (!keyMap.has(key)) return;
  const item = keyMap.get(key);
  setKeyInActive(item, key);
}

// 播放音乐
function playSound(soundId) {
  const key = SOUND_KEY + soundId;
  if (SOUNDS[key]) {
    playMusic(SOUNDS[key]);
  }
}
</script>

<style scoped lang="scss">
.play-wrapper {
  width: 482px;
  height: 500px;
  position: relative;
  outline: none;
  user-select: none;
  border: 1px solid #ccc;
  margin-right: 20px;

  .tips,
  .tips2 {
    position: absolute;
    text-align: center;
    width: 100%;
  }

  .tips {
    bottom: 40px;
    font-size: 20px;
  }

  .tips2 {
    bottom: 20px;
    font-size: 12px;
  }

  .key {
    display: inline-flex;
    flex-flow: column nowrap;
    align-items: center;
    background-position: bottom left;
    background-repeat: repeat-x;
    vertical-align: top;
    cursor: pointer;
    position: relative;

    $whiteWidth: 60px;
    $blackWidth: 36px;
    $blackLeftSpace: calc(#{$whiteWidth} - calc(#{$blackWidth} / 2));
    &.white {
      width: $whiteWidth;
      height: 360px;
      color: #666;
      background-color: #eee;
      border: {
        top: 2px solid #999;
        bottom: 2px solid #999;
        left: 2px solid #999;
      }
      background-image: url("@/assets/images/key_back_white.png");
      &:nth-child(8) {
        border: {
          right: 2px solid #999;
        }

        .mask {
          right: -2px;
        }
      }

      .mask {
        left: -2px;
        right: 0;
      }
    }

    &.black {
      width: $blackWidth;
      height: 200px;
      color: #ccc;
      background-color: #666;
      border: 2px solid #666;
      background-image: url("@/assets/images/key_back_black.png");
      position: absolute;
      top: 0;
      left: calc(var(--idx) * #{$whiteWidth} + #{$blackLeftSpace});

      .mask {
        left: -2px;
        right: -2px;
      }
    }

    &.active {
      background-color: #9cf;
    }

    span {
      &.tobottom {
        margin-top: 1em;
      }
    }

    .mask {
      position: absolute;
      top: -2px;
      bottom: -2px;
    }
  }
}
</style>
