<template>
  <div class="wave-container">
    <div class="text">{{text}}</div>
    <svg
      class="waves"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      viewBox="0 24 150 28"
      preserveAspectRatio="none"
      shape-rendering="auto"
    >
      <defs>
        <path
          id="gentle-wave"
          d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
        ></path>
      </defs>
      <g class="parallax">
        <use
          xlink:href="#gentle-wave"
          x="48"
          y="-2"
          fill="rgba(125, 191, 185,0.3)"
        ></use>
        <use
          xlink:href="#gentle-wave"
          x="48"
          y="3"
          fill="rgba(125, 191, 185,0.5)"
        ></use>
        <use
          xlink:href="#gentle-wave"
          x="48"
          y="5"
          fill="rgba(125, 191, 185,0.7)"
        ></use>
        <use
          xlink:href="#gentle-wave"
          x="48"
          y="12"
          fill="rgba(125, 191, 185,1)"
        ></use>
      </g>
    </svg>
  </div>
</template>

<script>
export default {
  props: ['text']
};
</script>

<style scoped>
.wave-container {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: 4;
}

.text {
  position: absolute;
  left: 50%;
  top: 45%;
  transform: translate(-50%, -50%);
  color: #fff;
  font-size: 40px;
  font-weight: bold;
}

.waves {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 150px;
}

/* 选择所有子元素 */
.parallax > use {
  /* 将动画与元素绑定 cubic-bezier贝塞尔曲线 改变值可以控制速度 */
  animation: move-forever 5s cubic-bezier(0.55, 0.5, 0.45, 0.5) infinite;
}

/* 选择子元素中的第几个 */
.parallax > use:nth-child(1) {
  /* 规定在动画开始之前的延迟。 */
  animation-delay: -2s;
  /* 规定完成动画所花费的时间，以秒或毫秒计。 */
  animation-direction: 7s;
}

.parallax > use:nth-child(2) {
  animation-delay: -3s;
  animation-direction: 10s;
}

.parallax > use:nth-child(3) {
  animation-delay: -4s;
  animation-direction: 13s;
}

.parallax > use:nth-child(4) {
  animation-delay: -5s;
  animation-direction: 15s;
}

/* 动画 */
@keyframes move-forever {
  0% {
    transform: translate3d(-90px, 0, 0);
  }

  100% {
    transform: translate3d(85px, 0, 0);
  }
}
</style>
