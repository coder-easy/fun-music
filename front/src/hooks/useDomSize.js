import { ref, onMounted, onUnmounted } from "vue";
import { throttle } from "@/utils/index";

export default function useDomSize() {
    const domRef = ref(null);
    const domSize = ref(null);

    const getDomSize = () => {
        domSize.value = domRef.value.getBoundingClientRect();
    };

    onMounted(getDomSize);

    const handleResize = throttle(getDomSize);

    window.addEventListener("resize", handleResize);

    onUnmounted(() => {
        window.removeEventListener("resize", handleResize);
    });


    return {
        domRef,
        domSize
    };
}