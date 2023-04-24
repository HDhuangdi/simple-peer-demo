<template>
  <div class="mul" ref="root">
    <div class="start" v-if="!connected">
      <input
        v-model="roomId"
        v-if="!$route.query.roomId"
        class="input"
        @keydown.enter="connect"
        placeholder="请输入会议号"
      />
      <button class="connectButton" @click="connect">创建/加入会议</button>
    </div>
    <template v-else>
      <wave text="等待其他人加入中..." v-if="!objectLenth(allMembers)"></wave>
      <div class="main" v-else>
        <div class="local-video-container">
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
            muted
          ></video>
        </div>
        <div class="remotes">
          <div
            class="remote-video-container"
            v-for="member of memberList"
            :key="member.id"
          >
            <video
              v-if="remoteVideoVisible"
              preload="auto"
              autoplay="autoplay"
              x-webkit-airplay="true"
              playsinline="true"
              webkit-playsinline="true"
              x5-video-player-type="h5"
              x5-video-player-fullscreen="true"
              x5-video-orientation="portraint"
              class="remote-video"
              :ref="`remote${member.id}`"
              v-show="member.hasCameraStream"
              src=""
            ></video>
            <img
              src="../assets/video-close.png"
              class="no-camera-bg"
              v-show="!member.hasCameraStream"
            />
            <img
              src="../assets/mic.png"
              class="audio-icon"
              v-show="member.hasAudioStream"
            />
            <img
              src="../assets/mic-close.png"
              class="audio-icon"
              v-show="!member.hasAudioStream"
            />
          </div>
        </div>
        <div class="bottom-control">
          <div class="controls">
            <img
              :src="
                cameraDisabled
                  ? require('@/assets/video-close.png')
                  : require('@/assets/video.png')
              "
              alt=""
              @click="cameraDisabled = !cameraDisabled"
            />
            <img
              :src="
                micDisabled
                  ? require('@/assets/mic-close.png')
                  : require('@/assets/mic.png')
              "
              alt=""
              @click="micDisabled = !micDisabled"
            />
          </div>
          <div class="exit" @click="hangup">结束</div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { MultiplePeer } from "@ark-org/simple-peer-connector";
import wave from "./wave.vue";

let localStream;
let peer;

export default {
  components: {
    wave,
  },
  data() {
    const roomId = this.$route.query.roomId;
    return {
      roomId,
      connected: false,
      pending: true,
      allMembers: [],
      cameraDisabled: false,
      micDisabled: false,
      remoteVideoVisible: true,
    };
  },
  watch: {
    async cameraDisabled(v) {
      if (!peer) return;
      peer.switchStream(!v, !this.micDisabled)
    },
    async micDisabled(v) {
      if (!peer) return;
      peer.switchStream(!this.cameraDisabled, !v)
    },
  },
  mounted() {},
  methods: {
    createPeer() {
      peer = new MultiplePeer({
        iceServers: [
          {
            url: "turn:43.143.102.114:3478",
            credential: "123456",
            username: "demo",
          },
        ],
        server: "wss://www.hzwaterit.com",
        onStream: this.onStream.bind(this),
        onRemove: this.onRemove.bind(this),
        onDisconnected: this.onDisconnected.bind(this),
      });
    },
    objectLenth(obj) {
      return Object.keys(obj).length;
    },
    async getMedia(video, audio) {
      let obj = {};
      if (video) {
        obj.video = {
          facingMode: this.camera ? { exact: "environment" } : "user",
        };
      }
      if (audio) {
        obj.audio = true;
      }

      const stream = await navigator.mediaDevices.getUserMedia(obj);
      return stream;
    },
    async connect() {
      this.createPeer();
      localStream = await this.getMedia(
        !this.cameraDisabled,
        !this.micDisabled
      );
      peer.connect(
        this.roomId,
        !this.cameraDisabled,
        !this.micDisabled,
        localStream
      );
      this.connected = true;
    },
    async onStream(member, remoteStream, localStream, allMembers) {
      this.allMembers = { ...allMembers };
      await this.$nextTick();
      if (!this.$refs.local.srcObject) {
        this.$refs.local.srcObject = localStream;
      }
      this.$refs[`remote${member.id}`][0].srcObject = remoteStream;
    },
    onRemove(member, allMembers) {
      console.log(111);
      this.allMembers = { ...allMembers };
    },
    onDisconnected(allMembers) {
      this.allMembers = { ...allMembers };
    },
    hangup() {
      if (peer) peer.hangup();
      peer = null;
      this.connected = false;
    },
  },
  computed: {
    memberList() {
      const list = [];
      for (const memberId in this.allMembers) {
        list.push(this.allMembers[memberId]);
      }
      return list;
    },
  },
};
</script>

<style lang="less" scoped>
.mul {
  height: 100%;
  background: #172330;
  .main {
    height: 100%;
    width: 100%;
  }
  .start {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    .input {
      width: 187px;
      height: 42px;
      border: 0;
      outline: none;
      background-image: url(../assets/input-bg.png);
      background-size: 100% 100%;
      background-color: transparent;
      padding-left: 17px;
      font-size: 16px;
      font-family: MicrosoftYaHei;
      color: #ffffff;
    }
    .connectButton {
      width: 137px;
      height: 42px;
      border: 0;
      outline: none;
      cursor: pointer;
      color: #fff;
      background-color: transparent;
      background-image: url(../assets/button-bg.png);
      background-size: 100% 100%;
      z-index: 3;
      font-size: 17px;
    }
  }

  button {
    border: 0;
    outline: none;
    cursor: pointer;
  }
  .bottom-control {
    position: absolute;
    width: 100%;
    height: 80px;
    bottom: 1px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #0a4a5c;
    .controls {
      display: flex;
      align-items: center;
      img {
        width: 30px;
        cursor: pointer;
        margin-left: 50px;
      }
    }
    .exit {
      width: 112px;
      height: 40px;
      background: #ca584a;
      border-radius: 4px;
      text-align: center;
      line-height: 40px;
      margin-right: 50px;
      cursor: pointer;
      color: #fff;
    }
  }

  .local-video-container {
    position: relative;
    background-image: url(../assets/local-bg.png);
    background-size: 100%;
    width: 135px;
    height: 152px;
    position: absolute;
    right: 0;
    top: 20px;
    z-index: 2;
    video {
      position: absolute;
      width: 104px;
      height: 104px;
      left: 24px;
      top: 24px;
    }
  }
  .remotes {
    width: 100%;
    height: calc(100% - 80px);
    overflow-y: auto;
    display: flex;
    align-items: center;
    padding: 30px 0;
    justify-content: center;
    flex-wrap: wrap;
    .remote-video-container {
      width: 30%;
      height: 299px;
      background: #153843;
      border: 1px solid #1a707e;
      padding: 12px;
      position: relative;
      video {
        width: 100%;
        height: 100%;
      }
      .no-camera-bg {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 15%;
      }
      .audio-icon {
        position: absolute;
        bottom: 5px;
        width: 15px;
        left: 5px;
      }
    }
  }
}
</style>
