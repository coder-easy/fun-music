import { ref } from "vue";
import { USERNAME } from "@/constants/keys";
import socket from "@/utils/socket";
import { SEND_MUSIC } from "@/constants/event";

export default function useRecordMusic() {
    const isRecord = ref(false);
    // 正在录制

    const soundIdRecord = ref([]);
    // 琴键数据

    const handleStartRecord = () => {
        if (isRecord.value) return;
        isRecord.value = true;
        soundIdRecord.value = [];
    };
    // 开始记录输入的琴键数据

    const handlePlayPiano = (data) => {
        if (isRecord.value) {
            soundIdRecord.value.push(data);
        }
    };
    // 保存输入的琴键数据

    const handleStopRecord = () => {
        if (!isRecord.value) return;
        isRecord.value = false;
        soundIdRecord.value.length !== 0 &&
            socket.emit(SEND_MUSIC, {
                user: window[USERNAME],
                timestamp: Date.now(),
                data: soundIdRecord.value,
            });
    };
    // 停止记录输入的琴键数据并保存

    return {
        isRecord,
        soundIdRecord,
        handleStartRecord,
        handlePlayPiano,
        handleStopRecord
    };
}