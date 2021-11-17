<template>
  <div class="wrapper">
    <Danmaku />
    <div class="bottom-wrap">
      <Piano @[PLAY_PIANO]="handlePlayPiano" />
      <ActionPanel
        :isRecord="isRecord"
        :isPlay="isPlay"
        @[START_RECORD]="handleStartRecord"
        @[STOP_RECORD]="handleStopRecord"
        @[PLAY_MUSIC]="handlePlayMusic"
        @[STOP_MUSIC]="handleStopMusic"
      />
      <div class="right-wrap">
        <DanmakuSend />
        <div class="card-wrap">
          <List
            @[LIST_CLICK]="handleSelectMusic"
            style="--bg: #e6f7ff; --hightlight-bg: #91d5ff"
          >
            <li
              class="list-item"
              :class="{ selected: item.selected }"
              :data-idx="item.idx"
              v-for="item of allMusicData"
              :key="item.idx"
            >
              [{{ item.time }}] {{ item.user }}创建的音乐
            </li>
          </List>
          <!-- music list -->

          <List
            class="user-list"
            style="--bg: #66a9c9; --hightlight-bg: #1781b5; --color: #fff"
          >
            <li class="list-item" v-for="item of userList" :key="item.idx">
              [{{ item.time }}] {{ item.user
              }}{{ item.type ? "离开" : "进入" }}房间
            </li>
          </List>
          <!-- user list -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Piano from "@/components/Piano/index.vue";
import Danmaku from "@/components/Danmaku/index.vue";
import DanmakuSend from "@/components/Danmaku/send.vue";
import ActionPanel from "@/components/ActionPanel/index.vue";
import List from "@/components/List/index.vue";
import {
  START_RECORD,
  STOP_RECORD,
  PLAY_MUSIC,
  STOP_MUSIC,
  PLAY_PIANO,
  SEND_DANMAKU,
  LIST_CLICK,
  USER_UPLINE,
  USER_OFFLINE,
} from "@/constants/event";
import useRecordMusic from "@/hooks/useRecordMusic";
import usePlayMusic from "@/hooks/usePlayMusic";
import useUsers from "@/hooks/useUsers";

const {
  isRecord,
  soundIdRecord,
  handleStartRecord,
  handlePlayPiano,
  handleStopRecord,
} = useRecordMusic();

const {
  isPlay,
  allMusicData,
  handleSelectMusic,
  handleStopMusic,
  handlePlayMusic,
} = usePlayMusic();

const { userList } = useUsers();
</script>

<style lang="scss">
html {
  scroll-behavior: smooth;
}

html,
body {
  height: 100%;
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

ul {
  padding: 0;
}

::-webkit-scrollbar {
  display: none;
}

div {
  box-sizing: inherit;
}

body {
  font-family: "Source Sans Pro", Avenir, "Helvetica Neue", Helvetica, Arial,
    sans-serif;

  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  height: 100%;
}

.wrapper {
  width: 100%;
  height: 100%;

  min-width: 1200px;
  min-height: 800px;
  padding: 20px;
}

.bottom-wrap {
  padding-top: 20px;
  height: 560px;
  display: flex;
}

.right-wrap {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.card-wrap {
  flex: 1;
  display: flex;
  flex-direction: row;

  @media screen and (max-width: 1500px) {
    flex-direction: column;
  }

  .user-list {
    $size: 14px;
    margin-left: $size;
    @media screen and (max-width: 1500px) {
      margin: {
        left: 0px;
        top: $size;
      }
    }
  }
}
</style>
