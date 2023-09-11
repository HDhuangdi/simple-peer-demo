<template>
  <div class="home">
    <div class="start">
      <template v-if="step == 1">
        <div
          style="
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          "
        >
          <div class="tabs-container">
            <el-tabs v-model="activeTab" type="card">
              <!-- <el-tab-pane label="组织架构" name="组织架构">
                <div class="tree-container">
                  <el-tree
                    @check="handleOrgCheckChange"
                    :data="orgTreeData"
                    show-checkbox
                    node-key="index"
                    :props="{
                      children: 'children',
                      label: 'label',
                    }"
                  >
                    <div
                      class="tree-node"
                      :class="node.data.isRoot ? 'large' : ''"
                      slot-scope="{ node, data }"
                    >
                      <span>
                        {{ node.label }}
                      </span>
                      <span v-if="node.data.tel">{{ node.data.tel }}</span>
                    </div>
                  </el-tree>
                </div>
              </el-tab-pane> -->
              <el-tab-pane label="应急组织" name="应急组织">
                <div class="tree-container">
                  <div class="cols">
                    <span>单位（部门）</span>
                    <span>姓名</span>
                    <span>职务</span>
                  </div>
                  <el-tree
                    :data="emergencyTeam"
                    node-key="index"
                    show-checkbox
                    @check="handleTeamCheckChange"
                    :props="{
                      children: 'children',
                      label: 'label',
                    }"
                  >
                    <div
                      class="tree-node"
                      :class="node.data.isRoot ? 'large' : ''"
                      slot-scope="{ node, data }"
                    >
                      <span>
                        {{ node.label }}
                      </span>
                      <span
                        v-if="node.data.isRoot"
                        class="team-button"
                        @click="onKey(node.data)"
                      >
                        一键拉会
                      </span>
                      <span v-if="node.data.name">
                        {{ node.data.name }}
                      </span>
                      <span v-if="node.data.title">
                        {{ node.data.title }}
                      </span>
                    </div>
                  </el-tree>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
          <button
            style="margin-left: 10px"
            class="next-button"
            @click="confirm"
          >
            下一步
          </button>
        </div>
      </template>
      <template v-else>
        <input
          v-model="roomId"
          class="input"
          @keydown.enter="connect"
          placeholder="请输入会议号"
        />
        <button class="connectButton" @click="connect">创建/加入会议</button>
      </template>
    </div>
  </div>
</template>

<script>
import { sendTextMessageBatchAPI, getTextMessageContentAPI } from "./api";
import { orgTreeData, emergencyTeam } from "./tree-data";

const isDev = process.env.NODE_ENV === 'development'

export default {
  data() {
    return {
      roomId: "",
      orgTreeData,
      emergencyTeam,
      activeTab: "应急组织",
      step: "1",
      orgCheckedNodes: [],
      teamCheckedNodes: [],
    };
  },
  mounted() {
    if (isDev) {
      this.orgTreeData.unshift({
        label: "测试部",
        isRoot: true,
        children: [
          {
            label: "黄迪",
            tel: "18892622405",
          },
          {
            label: "华杰",
            tel: "17639723455",
            label: "测试测试",
          },
        ],
      });
      this.emergencyTeam.unshift({
        label: "测试公司",
        isRoot: true,
        children: [
          {
            name: "黄迪",
            title: "责任人",
            tel: "18892622405",
            label: "测试测试",
          },
          {
            name: "华杰",
            title: "责任人",
            tel: "17639723455",
            label: "测试测试",
          },
        ],
      });
    }
  },
  methods: {
    connect() {
      if (!this.roomId) {
        this.$message({
          message: "请输入会议号",
          type: "warning",
        });
      } else {
        this.$router.push("/meeting?roomId=" + this.roomId);
      }
    },
    async confirm() {
      const res = await getTextMessageContentAPI();
      if (this.activeTab === "组织架构") {
        if (!this.orgCheckedNodes.length) {
          this.$message({
            message: "请选择参会人员",
            type: "warning",
          });
        } else {
          this.roomId = this.randomRange(100000, 999999);
          sendTextMessageBatchAPI({
            identifier: "HZCT20230809102329",
            content: this.getTextMessage(
              this.roomId,
              res.data.time,
              res.data.addr,
              res.data.content
            ),
            phoneList: this.orgCheckedNodes
              .filter((node) => !node.children)
              .map((item) => item.tel),
          });
          this.$router.push("/meeting?roomId=" + this.roomId);
        }
      } else {
        if (!this.teamCheckedNodes.length) {
          this.$message({
            message: "请选择参会人员",
            type: "warning",
          });
        } else {
          this.roomId = this.randomRange(100000, 999999);
          sendTextMessageBatchAPI({
            identifier: "HZCT20230809102329",
            content: this.getTextMessage(
              this.roomId,
              res.data.time,
              res.data.addr,
              res.data.content
            ),
            phoneList: this.teamCheckedNodes
              .filter((node) => !node.children)
              .map((item) => item.tel),
          });
          this.$router.push("/meeting?roomId=" + this.roomId);
        }
      }
    },
    getTextMessage(roomId, time, addr, content) {
      return `【杭州城投】杭州城投应急指挥系统提醒您，事件信息：${time}${addr}${content}，现邀请您加入应急视频会议，请点击下方链接及时查看：https://meeting.hzcjtz.com:8080/meeting/#/meeting?roomId=${roomId}，同时留意相关信息，谢谢！`;
    },
    async onKey(nodeData) {
      const res = await getTextMessageContentAPI();
      const phoneList = nodeData.children.map((e) => e.tel);
      this.roomId = this.randomRange(100000, 999999);
      sendTextMessageBatchAPI({
        identifier: "HZCT20230809102329",
        content: this.getTextMessage(
          this.roomId,
          res.data.time,
          res.data.addr,
          res.data.content
        ),
        phoneList,
      });
      this.$router.push("/meeting?roomId=" + this.roomId);
    },
    handleOrgCheckChange(e1, e2) {
      this.orgCheckedNodes = e2.checkedNodes;
    },
    handleTeamCheckChange(e1, e2) {
      this.teamCheckedNodes = e2.checkedNodes;
    },
    randomRange(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    },
    a(v) {
      console.log(v);
    },
  },
};
</script>

<style lang="less">
.home {
  height: 100%;
  background: #172330;
  .start {
    width: 100%;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    justify-content: center;
    align-items: center;
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
    .next-button {
      width: 600px;
      background-color: #298b9e;
      color: #fff;
      height: 40px;
      border-radius: 5px;
      outline: none;
      border: 2px solid #00d5ff;
      cursor: pointer;
      margin-left: 0 !important;
      margin-top: 20px;
    }
    .tabs-container {
      height: 500px;
      width: 600px;
      border: 1px solid rgb(19, 137, 158);
      .tree-container {
        border-radius: 4px;
        height: 450px;
        overflow-y: auto;
        padding: 10px;
        &::-webkit-scrollbar {
          width: 6px;
        }
        /* 滚动槽 */
        &::-webkit-scrollbar-track {
          background-color: transparent;
        }
        /* 滚动条滑块 */
        &::-webkit-scrollbar-thumb {
          border-radius: 10px;
          background-color: rgb(19, 137, 158);
        }
        .cols {
          padding: 5px 0 5px 64px;
          color: #00d5ff;
          font-size: 18px;
          span {
            display: inline-block;
          }
          span:nth-child(1) {
            width: 300px;
          }
          span:nth-child(2) {
            width: 70px;
          }
          span:nth-child(3) {
          }
          span:nth-child(4) {
            width: 100px;
          }
        }
      }
    }

    .el-tabs {
      .el-tabs__header {
        margin: 0 !important;
        border-bottom: 1px solid rgb(19, 137, 158);
        .el-tabs__nav {
          border: 1px solid transparent;
          width: 100%;
          display: flex;
          .el-tabs__item {
            border-left: 1px solid rgb(19, 137, 158);
            color: rgb(0, 217, 255);
            background-color: #153643;
            flex: 1;
            text-align: center;
            &.is-active {
              border-bottom-color: rgb(0, 217, 255);
              border-bottom-width: 4px;
              color: #fff;
            }
          }
        }
      }
    }
    .el-tree {
      background: transparent;
      .el-tree-node:focus {
        & > .el-tree-node__content {
          background-color: #153643;
        }
      }
      .el-tree-node__content:hover {
        background-color: #153643;
      }
      .el-checkbox {
        .el-checkbox__inner {
          background-color: transparent;
          border: 1px solid rgb(19, 137, 158);
        }
      }
      .tree-node {
        width: 70%;
        color: #00d9ff;
        &.large {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
        }
        &:not(.large) {
          font-size: 14px;
        }
        span {
          display: inline-block;
        }
        span:nth-child(1) {
          width: 300px;
        }
        span:nth-child(2) {
          width: 70px;
        }
        span:nth-child(3) {
        }
        span:nth-child(4) {
          width: 100px;
        }
      }
      .team-button {
        width: 70px !important;
        background-color: #298b9e;
        color: #fff;
        height: 25px;
        border-radius: 2px;
        outline: none;
        border: 1px solid #00d5ff;
        cursor: pointer;
        text-align: center;
        font-size: 12px;
        line-height: 25px;
      }
    }
  }
}
</style>
