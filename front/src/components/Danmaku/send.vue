<template>
  <div class="danmaku-send-wrap">
    <input
      v-model="danmaku"
      @keyup="handleKeyUp"
      placeholder="请输入你想发送的弹幕吧~"
    />
    <div class="btn" @click="handleEmitMsg">发送</div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { SEND_DANMAKU } from "@/constants/event";
import socket from "@/utils/socket";

const danmaku = ref("");

const handleEmitMsg = () => {
  const msg = danmaku.value.trim();
  if (msg !== "") {
    danmaku.value = "";
    socket.emit(SEND_DANMAKU, msg);
  }
};

const handleKeyUp = ({ key }) => {
  if (key === "Enter") {
    handleEmitMsg();
  }
};
</script>

<style scoped lang="scss">
.danmaku-send-wrap {
  display: flex;
  border: 1px solid #ccc;
  border-radius: 20px;
  padding: 5px 8px;
  margin-bottom: 16px;

  input {
    border: none;
    outline: none;
    height: 25px;
    font-size: 16px;
    flex: 1;
    margin-right: 10px;
  }

  .btn {
    color: rgb(24, 144, 255);
    height: 100%;
    width: 40px;
    text-align: center;
    cursor: pointer;
    user-select: none;
  }
}
</style>

