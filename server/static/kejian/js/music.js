// 所有资源加载完毕后再执行代码
window.onload = function() {

    let oUlElement = document.querySelector('.oUl');
    let imgElements = [...oUlElement.querySelectorAll('img')];
    let btnElements = [...document.querySelectorAll('.btn')];
    let progress2Element = document.querySelector('.progress2');
    let stopBtn = document.querySelector('#stop_btn');

    // 初始化的每一张手机图片的位置，0-1之间的值，0 为最低位，1 为最高位
    let initRatio = [1, .4, 0, .4, .6, .4, 0];
    // 最低音的时候，图片 translateY 的值
    let bassVal = oUlElement.clientHeight * .8;
    // 随机颜色数组
    let colors = [
        '#ff5f5b',
        '#ffb66e',
        '#ffd96d',
        '#e8f898',
        '#8cf6f3',
        '#92aef0',
        '#b897e4'
    ];
    // 初始化颜色为空：
    let color = '#000';

    // 音乐列表：
    let musicList = [
        './resource/mo.mp3',
        './resource/Rihanna - Only Girl (In The World).mp3',
        './resource/Remix.mp3',
        './resource/Neptune Illusion Dennis Kuo .mp3'
    ];

    let audio = null;
    let audioContext = null;
    let sourceNode = null;
    let analyser = null;
    let image = null

    let currentBtn = null;

    imgElements.forEach( (img, index) => {
        let {x} = img.getBoundingClientRect();
        // 把每一张图片的中心点 x 求出来：
        img._centerPointer = {
            x: x + img.width / 2
        }
        
        // 对每一个图片进行 mTween 的初始化
        setTransform(img, 'translateY', getTranslateYByRatio(initRatio[index]));
    } );
    btnElements.forEach(btn => {
        setTransform(btn, 'scale', 1);
    })

    // animatePhone(initRatio);

    // 鼠标在下方手机上移动时的动画：
    oUlElement.onmousemove = function({clientX}) {

        let vals = imgElements.map( (img, index) => {
            return 1 - Math.abs( clientX - img._centerPointer.x ) / window.innerWidth;
        } );
        // console.log(vals);
        animatePhone(vals);

    }

    oUlElement.onmouseleave = function() {
        animatePhone(initRatio);
    }

    // 按钮
    btnElements.forEach( (btn, index) => {
        btn.onclick = function() {

            // 从颜色数组中随机取出来一个颜色值:
            color = colors[Math.floor(Math.random() * colors.length)];
            bgColor = colors[Math.floor(Math.random() * colors.length)];

            currentBtn && mTween.stop(currentBtn);

            btnElements.forEach(btn => btn.style = '');
            btn.style.backgroundColor = color;
            btn.style.border = '1px solid white'
            btn.style.color = 'white';
            document.body.style.backgroundColor = bgColor

            currentBtn = this;

            if (audio) {
                audio.pause();
                audio = null;
            }
            audio = new Audio();
            audio.addEventListener('canplay', play);
            audio.src = musicList[index];
        }
    } )

    stopBtn.onclick = function() {
        audio && audio.pause();
    }

    function play() {
        audio.play();

        // 创建一个用来处理音频的工作环境（上下文），我们可以通过它来进行音频读取、解码等，进行一些更底层的音频操作
        audioContext = new AudioContext();
        // console.log(audioContext);
        // 设置音频数据源
        sourceNode = audioContext.createMediaElementSource(audio);
        // console.log(sourceNode);

        // 获取音频时间和频率数据，以及实现数据可视化，connect 之前调用
        analyser = audioContext.createAnalyser();
        // connect 连接器，把声音数据连接到分析器，除了 createAnalyser，还有：BiquadFilterNode[提高音色]、ChannelSplitterNode[分割左右声道] 等对音频数据进行处理，然后通过 connect 把处理后的数据连接到扬声器进行播放
        sourceNode.connect(analyser);

        // connect 连接器，把声音数据连接到扬声器，如果不加这个将不会有声音，对声音的处理要放到播放器之前
        analyser.connect(audioContext.destination);

        // 得到的二进制音频数据，并解析
        parse();
    }

    function parse() {
        // console.log(analyser.frequencyBinCount);
        // analyser.frequencyBinCount : 二进制音频频率数据的数量（个数）
        // Uint8Array : 生成一个长度为 analyser.frequencyBinCount 的，用于处理二进制数据的数组
        let freqArray = new Uint8Array(analyser.frequencyBinCount); // 这时的 freqArray 是一个存满 0 的数组
        // 将当前频率数据复制到 freqArray 中
        analyser.getByteFrequencyData(freqArray); // 得到频谱

        let arr = [];
        // 频谱反应的是声音各频率（frequencyBinCount）上能量的分布
        // 设置step，进行取样
        var step = Math.round(freqArray.length / 7);

        for (let i=0; i<7; i++) {
            arr.push(freqArray[i * step] / bassVal);
        }

        // 根据分析后的频谱数据生成动画
        animatePhone(arr);

        if (!image) {
          // // 从 arr 样本中计算平均值
          let averageVal = arr.reduce((p, c) => p + c, 0) / arr.length + .5;
          animateBtn(averageVal);
        }

        // 进度条
        animateProcess();

        if (!audio.paused) {
            requestAnimationFrame(parse);
        }
    }


    // 手机上下移动的动画：
    function animatePhone(ratio) {
        imgElements.forEach( (img, index) => {
            // 原生 js 写：
            // img.style.transform = `translateY(${ getTranslateYByRatio(ratio[index]) }px)`

            // 使用 mTween 封装的动画库进行使用，避免动画生硬问题，使动画更加流畅：
            mTween.stop(img);
            mTween({
                el: img,
                duration: 200,
                attr: {
                    translateY: getTranslateYByRatio(ratio[index])
                }
            });

        } );
    }

    function animateBtn(scale) {
        mTween.stop(currentBtn);
        mTween({
            el: currentBtn,
            duration: 200,
            attr: {
                scale
            }
        });
    }

    function animateProcess() {
        if (audio) {
            progress2Element.style.background = color;
            progress2Element.style.width = audio.currentTime / audio.duration * 100 + '%';
        }
    }

    function getTranslateYByRatio(ratio) {
        return (1 - ratio) * bassVal;
    }

    const file = document.querySelector("input[type=file]")
    // file.onchange = () => {
    //   // 获取里面上传的内容 -> 返回的是一个伪数组
    //   let fileData = file.files[0];
      image = window.location.href.split('=')[1] || window.URL.createObjectURL(fileData);
    //   image = window.location.href.split('=')[1] || window.URL.createObjectURL(fileData);
    //   image = window.URL.createObjectURL(fileData);
    //   image = window.URL.createObjectURL(fileData)
    console.log(image);

      if(image) {
        if (audio) {
          audio.pause();
          audio = null;
        }
        audio = new Audio();
        audio.addEventListener('canplay', play);
        audio.src = image;
        color = color === null ? '#000' : color
        audio.addEventListener('ended', function () {
          image = ''
          file.value = ''
          progress2Element.style.width = '0'
        })
      }
    //   blob:null/3eac3c0d-d42f-4ffa-9d54-eec1961ebeab
    // };
}