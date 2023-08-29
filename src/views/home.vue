<template>
  <div class="home">
    <div class="start">
      <template v-if="step == 1">
        <el-select v-model="value" multiple placeholder="请选择参会人员" style="width: 250px">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <button
          style="margin-left: 10px"
          class="connectButton"
          @click="confirm"
        >
          下一步
        </button>
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
      options: [
        {
          value: "选项1",
          label: "舒秀波-水务集团-安全综治岗 13951005318",
        },
        {
          value: "选项2",
          label: "周建奇-能源集团-生产运营管理岗 13758234725",
        },
      ],
      value: "",
      step: "1",
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
    confirm() {
      if (!this.value.length) {
        this.$message({
          message: "请选择参会人员",
          type: "warning",
        });
      } else {
        this.step = "2";
      }
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
    .el-select {
      input {
        background-color: rgb(20, 111, 131);
        border: 1px solid rgb(0, 216, 254);
        &::placeholder{
          color: #fff;
        }
      }
      .el-tag {
        background-color: rgb(54, 191, 215);
        color: #fff;
        border: 1px solid rgb(0, 216, 254);
      }
      .el-tag__close {
        color: #C0C4CC;
        background-color: #fff;
      }
    }
  }
}
.el-select-dropdown {
  background-color: rgb(20, 111, 131) !important;
  border: 1px solid rgb(0, 216, 254);
  .popper__arrow {
    border-bottom-color: rgb(0, 216, 254) !important;
  }
  .popper__arrow::after {
    border-bottom-color: rgb(0, 216, 254) !important;
  }
  .el-select-dropdown__item {
    color: #fff;
    &.hover,&.selected {
      background-color: rgb(0, 216, 254) !important;
      color: #fff !important;
    }
  }
}
</style>
