import { createApp } from 'vue'
import App from './App.vue'
import "@/utils/socket";
import { USERNAME } from "@/constants/keys";

function getUserName() {
    let username = localStorage.getItem(USERNAME);
    if (username) {
        return window[USERNAME] = username;
    }
    let result = window.prompt("请输入一个酷炫狂霸拽炸天的昵称~~~~");
    result = result.trim();
    if (!result) {
        return getUserName();
    } else {
        window[USERNAME] = result;
        localStorage.setItem(USERNAME, result);
    }

}

getUserName();

createApp(App).mount('#app')
