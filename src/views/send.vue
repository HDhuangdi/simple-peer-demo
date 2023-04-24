<template>
  <div class="send">
    <template v-if="!connecting">
      <button id="contectButton" type="button" @click="connect" v-if="!connected">立即拨打</button>
      <img
        @click="toggle"
        id="toggleButton"
        :src="require('@/assets/toggle.png')"
        alt=""
        v-if="connected"
      />
      <img
        @click="hangup"
        id="hangupButton"
        :src="require('@/assets/hangup.png')"
        alt=""
        v-if="connected"
      />
      <video
        preload="auto"
        autoplay="autoplay"
        x-webkit-airplay="true"
        playsinline="true"
        webkit-playsinline="true"
        x5-video-player-type="h5"
        x5-video-player-fullscreen="true"
        x5-video-orientation="portraint"
        ref="local"
        id="local"
        src=""
        width="500"
        height="500"
        muted
      ></video>
      <video
        preload="auto"
        autoplay="autoplay"
        x-webkit-airplay="true"
        playsinline="true"
        webkit-playsinline="true"
        x5-video-player-type="h5"
        x5-video-player-fullscreen="true"
        x5-video-orientation="portraint"
        ref="remote"
        id="remote"
        src=""
        width="500"
        height="500"
      ></video>
    </template>
    <wave text="接通中..." v-else></wave>
  </div>
</template>

<script>
import { SendPeer } from "@ark-org/simple-peer-connector";
import wave from "./wave.vue";

export default {
  components: {
    wave,
  },
  data: () => ({
    peer: null,
    connecting: false,
    connected: false
  }),
  mounted() {
    this.peer = new SendPeer({
      iceServers: [
        {
          url: "turn:43.143.102.114:3478",
          credential: "123456",
          username: "demo",
        },
      ],
      server: "wss://xxxxxxxxx:4000",
      onConnected: this.onConnected.bind(this),
      onHangup: this.onHangup.bind(this),
    });
  },
  methods: {
    async getMedia() {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      return stream;
    },
    async connect() {
      this.connecting = true;
      const stream = await this.getMedia();
      this.peer.connect(stream);
    },
    async onConnected(remoteStream, localStream) {
      this.connecting = false;
      this.connected = true
      await this.$nextTick()
      this.$refs.remote.srcObject = remoteStream;
      this.$refs.local.srcObject = localStream;
      console.log("onConnected");
    },
    toggle() {},
    hangup() {
      this.peer.hangup();
    },
    onHangup() {
      this.connected = false;
      this.$refs.remote.srcObject = null;
      this.$refs.local.srcObject = null;
    },
  },
};
</script>

<style lang="less" scoped>
.send {
  height: 100%;
  background-color: rgb(33, 25, 36);
  #local {
    width: 100%;
    height: 100%;
    position: absolute;
    right: 0%;
    top: 0%;
    z-index: 2;
  }

  #contectButton {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    padding: 20px 30px;
    border: 0;
    outline: none;
    cursor: pointer;
    color: #fff;
    background-color: #409eff;
    z-index: 3;
    font-size: 17px;
  }

  #hangupButton {
    position: absolute;
    bottom: 10%;
    left: 50%;
    transform: translate(-50%, 0);
    width: 60px;
    cursor: pointer;
    z-index: 3;
  }

  #toggleButton {
    width: 40px;
    position: absolute;
    bottom: 11.5%;
    left: 70%;
    transform: translate(-50%, 0);
    cursor: pointer;
    z-index: 3;
  }
}
</style>
