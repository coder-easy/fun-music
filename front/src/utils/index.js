import SOUNDS from "@/libs/sound";
import { SOUND_KEY } from "@/constants/keys";

export function getFormatTime(_timestamp) {

    if (_timestamp) {
        const timestamp = (typeof _timestamp === "number") ? _timestamp : Number(_timestamp);
        return convert(new Date(timestamp));
    }

    return convert(new Date());

    function convert(time) {
        const year = time.getFullYear();
        const now_month = time.getMonth() + 1;
        const month = now_month < 10 ? "0" + now_month : now_month;
        const now_date = time.getDate();
        const date = now_date < 10 ? "0" + now_date : now_date;
        const now_hours = time.getHours();
        const hours = now_hours < 10 ? "0" + now_hours : now_hours;
        const now_minute = time.getMinutes();
        const minute = now_minute < 10 ? "0" + now_minute : now_minute;
        const now_sec = time.getSeconds();
        const sec = now_sec < 10 ? "0" + now_sec : now_sec;

        return `${year}-${month}/${date} ${hours}:${minute}:${sec}`;
    }
}

export function getRandomNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export function getRandomColor() {
    return '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
}

export function calcDanmakuTop(boxHeight, fontSize) {
    fontSize += 6;
    const count = parseInt((boxHeight - 20) / fontSize);
    const index = getRandomNum(0, count - 1);

    return index * fontSize + 10;
}

// 根据容器宽度和消息长度计算动画时间，怎么算给忘了，气死气死气死，让你不好好学数学
export function calcDanmakuTime(boxWidth, msgWidth) {
    if (msgWidth < 100) {
        return 10;
    } else if (msgWidth < 200) {
        return 9;
    } else if (msgWidth < 300) {
        return 7;
    } else if (msgWidth < 400) {
        return 6;
    } else {
        return 5;
    }
}

export function throttle(fn, delay = 200) {
    let flag = null;
    return (...args) => {
        const time = Date.now();
        if (!flag || flag && time - delay > flag) {
            flag = time;
            fn(...args);
        }
    }
}

export function playMusic(music) {
    const audio = new Audio(music);
    audio.play();
}

export function playMusicList(music, cb) {


    const formatMusic = [];

    for (let i = 1; i < music.length; i++) {
        if (i === 1) {
            formatMusic.push({
                id: SOUND_KEY + music[0].id,
                time: 0
            });
        }

        formatMusic.push({
            id: SOUND_KEY + music[i].id,
            time: music[i].time - music[i - 1].time
        });
    }

    let playFlag = null;

    let promise = new Promise((resolve, reject) => {
        let index = 0;
        let lastPlayTime = null;

        const x = (id) => {
            index++;
            playMusic(SOUNDS[id]);
            lastPlayTime = Date.now();
        }

        const task = () => {
            if (playFlag) return;
            if (index === 0) {
                x(formatMusic[index].id);
                window.requestAnimationFrame(task);
            } else if (index < formatMusic.length) {
                const { id, time } = formatMusic[index];
                if (Date.now() - time > lastPlayTime) {
                    x(id);
                }
                window.requestAnimationFrame(task);
            } else {
                cb && cb();
            }
        };

        task();
    });

    promise.stop = () => {
        playFlag = true;
    };

    return promise;
}