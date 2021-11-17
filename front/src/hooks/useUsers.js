import { ref } from "vue";
import {
    USER_UPLINE,
    USER_OFFLINE,
} from "@/constants/event";
import { getFormatTime } from "@/utils/index";
import socket from "@/utils/socket";

export default function useUsers() {
    const userList = ref([]);
    // 玩家上下线消息

    socket.on(USER_UPLINE, (args) => {
        userList.value.unshift({
            idx: userList.value.length,
            type: 0,
            user: args.user,
            timestamp: args.uptime,
            time: getFormatTime(args.uptime),
        });
    });

    socket.on(USER_OFFLINE, (args) => {
        userList.value.unshift({
            idx: userList.value.length,
            type: 1,
            user: args.user,
            timestamp: args.offtime,
            time: getFormatTime(args.offtime),
        });
    });

    return {
        userList
    };
}