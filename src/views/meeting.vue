<template>
  <div class="mul" ref="root">
    <div class="start" v-if="!connected">
      <template v-if="!$route.query.roomId">
        <input
          v-model="roomId"
          class="input"
          @keydown.enter="connect"
          placeholder="请输入会议号"
        />
        <button class="connectButton" @click="connect">创建/加入会议</button>
      </template>
      <button v-else class="connectButton" @click="connect">
        加入会议:{{ roomId }}
      </button>
    </div>
    <template v-else>
      <wave text="等待其他人加入中..." v-if="!objectLenth(allMembers)"></wave>
      <div class="main" v-else>
        <div class="focus-member member">
          <video
            preload="auto"
            autoplay="autoplay"
            x-webkit-airplay="true"
            playsinline="true"
            webkit-playsinline="true"
            x5-video-player-type="h5"
            x5-video-player-fullscreen="true"
            x5-video-orientation="portraint"
            ref="focus"
            id="focus"
            src=""
            muted
          ></video>
          <img
            src="../assets/video-close.png"
            class="no-camera-bg"
            v-show="!hasCameraStream"
          />
          <img
            src="../assets/mic.png"
            class="audio-icon"
            v-show="hasAudioStream"
          />
          <img
            src="../assets/mic-close.png"
            class="audio-icon"
            v-show="!hasAudioStream"
          />
        </div>
        <div class="member-list">
          <div class="member">
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
            <img
              src="../assets/video-close.png"
              class="no-camera-bg"
              v-show="!hasCameraStream"
            />
            <img
              src="../assets/mic.png"
              class="audio-icon"
              v-show="hasAudioStream"
            />
            <img
              src="../assets/mic-close.png"
              class="audio-icon"
              v-show="!hasAudioStream"
            />
          </div>
          <div
            class="member"
            v-for="member of memberList"
            :key="member.id"
            @click="focus(member)"
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
              @click="switchCamera()"
            />
            <img
              :src="
                micDisabled
                  ? require('@/assets/mic-close.png')
                  : require('@/assets/mic.png')
              "
              alt=""
              @click="switchMic()"
            />
          </div>
          <div class="exit" @click="hangup">结束</div>
        </div>
      </div>
    </template>
    <div class="home" @click="goHome()">首页</div>
  </div>
</template>

<script>
// import VConsole from "vconsole";
import { MultiplePeer } from "@ark-org/simple-peer-connector";
import wave from "./wave.vue";

let localStream;
let peer;

export default {
  components: {
    wave,
  },
  data() {
    return {
      roomId: this.$route.query.roomId,
      hasCameraStream: true,
      hasAudioStream: true,
      connected: false,
      pending: true,
      allMembers: [],
      cameraDisabled: false,
      micDisabled: false,
      remoteVideoVisible: true,
      focusMember: {},
    };
  },
  watch: {
    async cameraDisabled(v) {
      if (!peer) return;
      peer.switchStream(!v, !this.micDisabled);
    },
    async micDisabled(v) {
      if (!peer) return;
      peer.switchStream(!this.cameraDisabled, !v);
    },
  },
  mounted() {
    // const vConsole = new VConsole();
    if (this.roomId) {
      this.connect();
    }
  },
  methods: {
    goHome() {
      this.$router.push("/");
    },
    createPeer() {
      peer = new MultiplePeer({
        iceServers: [
          {
            url: "turn:43.143.102.114:3478",
            credential: "123456",
            username: "demo",
          },
        ],
        // server: "wss://zhglmobile.hzwgc.com",
        server: "wss://www.hzwateritzx.com:9876",
        // server: "ws://192.168.71.125:8088",
        onStream: this.onStream.bind(this),
        onNoStreamJoin: this.onNoStreamJoin.bind(this),
        onRemove: this.onRemove.bind(this),
        onDisconnected: this.onDisconnected.bind(this),
      });
    },
    objectLenth(obj) {
      return Object.keys(obj).length;
    },
    // 检测摄像头、麦克风都有的情况
    async getMedia(video, audio) {
      const obj = {};
      let stream;
      if (video && audio) {
        // 在用户开启摄像头、麦克风权限时，首先尝试摄像头、麦克风都有的情况
        obj.video = {
          facingMode: this.camera ? { exact: "environment" } : "user",
        };
        obj.audio = true;
        try {
          stream = await navigator.mediaDevices.getUserMedia(obj);
        } catch (e) {
          // 说明该设备只有麦克风流、摄像头流的其中一个，首先尝试是否有麦克风流
          stream = await this.getOnlyMicStream(true);
        }
      } else if (audio) {
        // 用户只开启了麦克风权限，只需查找是否有麦克风流
        stream = await this.getOnlyMicStream(false);
      } else if (video) {
        // 用户只开启了摄像头权限，只需查找是否有摄像头流
        stream = await this.getOnlyCameraStream();
      }
      return stream;
    },
    // 检测是否有麦克风
    async getOnlyMicStream(shouldGetCameraStream) {
      let stream;
      const obj = { audio: true };
      console.log(shouldGetCameraStream);
      if (shouldGetCameraStream) {
        // 需要继续查找是否有摄像头流
        try {
          stream = await navigator.mediaDevices.getUserMedia(obj);
          console.warn("检测到只有麦克风的情况");
          this.cameraDisabled = true;
          this.hasCameraStream = false;
        } catch (e) {
          // 说明没有麦克风流，需要继续查找是否有摄像头流
          this.hasAudioStream = false;
          this.micDisabled = true;
          stream = await this.getOnlyCameraStream();
        }
      } else {
        // 无需查找摄像头流，直接返回麦克风流，若没有麦克风，则此API会抛出错误，被this.connect捕获
        stream = await navigator.mediaDevices.getUserMedia(obj);
      }
      return stream;
    },
    // 检测是否有摄像头
    async getOnlyCameraStream() {
      let stream;
      const obj = {
        video: {
          facingMode: this.camera ? { exact: "environment" } : "user",
        },
      };
      // 直接返回摄像头流，若没有摄像头，则此API会抛出错误，被this.connect捕获
      stream = await navigator.mediaDevices.getUserMedia(obj);
      console.warn("检测到只有摄像头的情况");
      return stream;
    },
    async connect() {
      this.createPeer();
      try {
        localStream = await this.getMedia(
          !this.cameraDisabled,
          !this.micDisabled
        );
      } catch (e) {
        console.error(e);
        console.warn("无视频流");
        this.cameraDisabled = true;
        this.micDisabled = true;
        this.hasCameraStream = false;
        this.hasAudioStream = false;
      }

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
    async onNoStreamJoin(member, allMembers) {
      this.allMembers = { ...allMembers };
      await this.$nextTick();
      if (!this.$refs.local.srcObject) {
        this.$refs.local.srcObject = localStream;
      }
    },
    onRemove(member, allMembers) {
      this.allMembers = { ...allMembers };
    },
    onDisconnected(allMembers) {
      this.allMembers = { ...allMembers };
    },
    switchCamera() {
      if (!this.hasCameraStream) return;
      this.cameraDisabled = !this.cameraDisabled;
    },
    switchMic() {
      if (!this.hasAudioStream) return;
      this.micDisabled = !this.micDisabled;
    },
    hangup() {
      if (peer) peer.hangup();
      peer = null;
      this.connected = false;
      this.goHome();
    },
    focus(member) {
      this.$refs.focus.srcObject =
        this.$refs[`remote${member.id}`][0].srcObject;
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
  /deep/ .wave-container {
    .text {
      font-size: 20px;
    }
  }
  .main {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
  .start {
    width: 100%;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    justify-content: center;
    .input {
      width: 160px;
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
      box-sizing: content-box;
      padding: 0 20px;
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
  .focus-member {
    width: calc(100% - 200px);
    height: calc(100% - 80px) !important;
    cursor: default !important;
    .audio-icon {
      width: 30px !important;
    }
  }
  .member-list {
    height: calc(100% - 80px);
    width: 200px;
    overflow-y: auto;
    background-color: #092d38;
  }
  .member {
    width: 100%;
    height: 160px;
    background: #153843;
    border: 1px solid #1a707e;
    padding: 12px;
    position: relative;
    cursor: pointer;
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
  .home {
    height: 50px;
    width: 50px;
    position: absolute;
    bottom: 155px;
    left: 27px;
    border-radius: 50%;
    background-color: #0d778d;
    color: #fff;
    line-height: 50px;
    text-align: center;
    cursor: pointer;
    z-index: 999;
  }
}
</style>
