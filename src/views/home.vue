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
              <el-tab-pane label="组织架构" name="组织架构">
                <div class="tree-container">
                  <el-tree
                    @check="handleCheckChange"
                    :data="orgTreeData"
                    show-checkbox
                    node-key="label"
                    :props="{
                      children: 'children',
                      label: 'label',
                    }"
                    :render-content="renderContent"
                  >
                  </el-tree>
                </div>
              </el-tab-pane>
              <el-tab-pane label="应急小组" name="应急小组">
                <div
                  class="emergency-team"
                  v-for="item of emergencyTeam"
                  :key="item.name"
                >
                  <div class="team-info">
                    <div class="team-name">{{ item.name }}</div>
                    <div class="team-button" @click="confirm(item.name)">
                      一键拉会
                    </div>
                  </div>

                  <div class="team-leader">
                    <div>组长：</div>
                    <div class="leader-name">{{ item.leader }}</div>
                    <div style="margin-left: 10px">电话：</div>
                    <div class="leader-tel">{{ item.tel }}</div>
                  </div>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
          <button
            style="margin-left: 10px"
            class="next-button"
            @click="confirm"
            v-if="activeTab === '组织架构'"
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
export default {
  data() {
    return {
      roomId: "",
      orgTreeData: [
        {
          label: "应急管理部",
          children: [
            {
              label: "陈浩",
              tel: "13588886738",
            },
            {
              label: "周骅",
              tel: "13989868674",
            },
            {
              label: "钱玮亮",
              tel: "13305711242",
            },
            {
              label: "韩冬",
              tel: "13588802506",
            },
            {
              label: "潘海散",
              tel: "13857125131",
            },
            {
              label: "王婷",
              tel: "18258186094",
            },
            {
              label: "张忠平",
              tel: "15858160510",
            },
            {
              label: "叶家浩",
              tel: "13029453301",
            },
            {
              label: "孙诚涛",
              tel: "17367073341",
            },
            {
              label: "席寒",
              tel: "19521556866",
            },
            {
              label: "施鹏飞",
              tel: "15968150327",
            },
            {
              label: "王智星",
              tel: "15168375622",
            },
            {
              label: "缪承谕",
              tel: "15957668088",
            },
            {
              label: "王津",
              tel: "15258886927",
            },
            {
              label: "祝沈军",
              tel: "18767169819",
            },
            {
              label: "崔向虎",
              tel: "18868890111",
            },
          ],
        },
        {
          label: "科技信息部",
          children: [
            {
              label: "刘洪江",
              tel: "13705816537",
            },
            {
              label: "张国剑",
              tel: "13905718977",
            },
            {
              label: "封敏奇",
              tel: "13588479572",
            },
            {
              label: "叶奕庆",
              tel: "18758028425",
            },
            {
              label: "纪睿",
              tel: "17767100456",
            },
            {
              label: "金晓燕",
              tel: "18358558955",
            },
            {
              label: "谭婧",
              tel: "13031166700",
            },
            {
              label: "缪承谕",
              tel: "15957668088",
            },
            {
              label: "王梦妍",
              tel: "13136199275",
            },
          ],
        },
      ],
      emergencyTeam: [
        {
          name: "小组一",
          leader: "xxxxx",
          tel: "123asdadasd",
        },
        {
          name: "小组二",
          leader: "xxxxx",
          tel: "123asdadasd",
        },
        {
          name: "小组三",
          leader: "xxxxx",
          tel: "123asdadasd",
        },
      ],
      activeTab: "组织架构",
      step: "1",
      checkedNodes: [],
    };
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
    confirm(teamName) {
      if (this.activeTab === "组织架构") {
        if (!this.checkedNodes.length) {
          this.$message({
            message: "请选择参会人员",
            type: "warning",
          });
        } else {
          this.roomId = this.randomRange(100000, 999999);
          this.$router.push("/meeting?roomId=" + this.roomId);
          // this.step = "2";
        }
      } else {
        this.roomId = this.randomRange(100000, 999999);
        this.$router.push("/meeting?roomId=" + this.roomId);
        // this.step = "2";
      }
    },
    renderContent(h, { node, data, store }) {
      return (
        <div style="display: flex;justify-content: space-between;width: 70%; color:#00d9ff;">
          <span>{node.label}</span>
          <span>{node.data.tel}</span>
        </div>
      );
    },
    handleCheckChange(e1, e2) {
      this.checkedNodes = e2.checkedNodes;
    },
    randomRange(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
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
      width: 300px;
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
      height: 350px;
      width: 300px;
      border: 1px solid rgb(19, 137, 158);
      .tree-container {
        border-radius: 4px;
        height: 300px;
        overflow-y: auto;
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
    }
    .emergency-team {
      color: rgb(0, 217, 255);
      padding: 10px;
      .team-info {
        display: flex;
        justify-content: space-between;
        .team-button {
          width: 70px;
          background-color: #298b9e;
          color: #fff;
          height: 30px;
          border-radius: 2px;
          outline: none;
          border: 1px solid #00d5ff;
          cursor: pointer;
          text-align: center;
          font-size: 12px;
          line-height: 30px;
        }
      }
      .team-leader {
        font-size: 13px;
        display: flex;
      }
    }
  }
}
</style>
