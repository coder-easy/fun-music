<template>
  <div class="list-wrap">
    <ul class="list-box" @click="handleClick">
      <slot></slot>
    </ul>
  </div>
</template>

<script setup>
import { LIST_CLICK } from "@/constants/event";

const emit = defineEmits([LIST_CLICK]);

const handleClick = ({ target }) => {
  const { idx } = target.dataset;
  if (idx === undefined) return;
  emit(LIST_CLICK, idx);
};
</script>

<style scoped lang="scss">
.list-wrap {
  border: 1px solid #ccc;
  border-radius: 20px;
  flex: 1;
  height: 100%;
  overflow: auto;
  position: relative;
  .list-box {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    padding: 0 20px;

    &,
    & li {
      list-style-type: none;
    }
  }
}
</style>
<style lang="scss">
.list-item {
  font-size: 14px;
  padding: 5px;
  border-radius: 5px;
  background-color: var(--bg);
  margin-bottom: 10px;
  cursor: pointer;
  transition: all ease 0.3s;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: var(--color);

  &:hover,
  &.selected {
    background-color: var(--hightlight-bg);
  }
}
</style>
