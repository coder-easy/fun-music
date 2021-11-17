import { ref } from "vue";
import socket from "@/utils/socket";
import { NEW_MUSIC } from "@/constants/event";
import { getFormatTime, playMusicList } from "@/utils/index";

export default function usePlayMusic() {
    const selectMusic = ref(null);
    // 当前选中的音乐

    const allMusicData = ref([]);
    // 全部的音乐数据

    const isPlay = ref(false);
    // 正在播放音乐

    let lastSelectMusic = null;

    let playMusicFlag = null;

    const handleSelectMusic = (idx) => {
        const item = allMusicData.value.find((i) => i.idx == idx);
        if (lastSelectMusic) {
            lastSelectMusic.selected = false;
        }
        item.selected = true;
        selectMusic.value = lastSelectMusic = item;
    };
    // 选中音乐

    const handleStopMusic = () => {
        if (!isPlay.value) return;
        isPlay.value = false;
        if (playMusicFlag) {
            playMusicFlag.stop();
            playMusicFlag = null;
        }
    };
    // 停止播放选中的音乐

    const handlePlayMusic = () => {
        if (!isPlay.value && selectMusic.value?.data) {
            isPlay.value = true;
            playMusicFlag = playMusicList(selectMusic.value.data, handleStopMusic);
        }
    };
    // 播放选中的音乐

    socket.on(NEW_MUSIC, (args) => {
        const { timestamp, user, data } = args;
        allMusicData.value.unshift({
            idx: allMusicData.value.length,
            user,
            timestamp,
            data,
            selected: false,
            time: getFormatTime(timestamp),
        });
    });

    return {
        isPlay,
        allMusicData,

        handleSelectMusic,
        handleStopMusic,
        handlePlayMusic
    };
}