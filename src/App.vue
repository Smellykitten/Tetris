<template>
  <div class="wrapper">
    <p>俄罗斯方块</p>
    <div class="content">
      <div class="board">
        <table class="playBoard">
          <tr v-for="i in state.row" class="boardTr">
            <td v-for="j in state.col" class="boardTd"></td>
          </tr>
        </table>
      </div>
      <div class="right">
        <div class="pre">
          <span>下一方块</span>
          <table class="preView">
            <tr v-for="i in state.preRow" class="preTr">
              <td v-for="j in state.preCol" class="preTd"></td>
            </tr>
          </table>
        </div>
        <div class="score">
          <span>得分: {{state.score}}</span>
        </div>
        <div class="modeSection">
          <div><input type="radio" name="mode" @change="modifyDuartion" value="35" checked><span>简单</span></div>
          <div><input type="radio" name="mode" @change="modifyDuartion" value="20"><span>中等</span></div>
          <div><input type="radio" name="mode" @change="modifyDuartion" value="10"><span>困难</span></div>
        </div>
        <div class="startButton">
          <button @click="begin" class="btn">开始</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, reactive } from 'vue'
  import Block from './common/js/Block'
  import Map from './common/js/Map'

export default defineComponent({
  name: 'App',
  setup() {
    const state:any = reactive ({
      row: 20,
      col: 12,
      preRow: 4, // 下一方块的行
      preCol: 4, // 下一方块的列
      block: {}, // 下落的方块
      nextBlock: {}, // 下一个方块
      map: {}, // 地图类
      timer: 0, // 计时器
      score: 0, // 得分
      duration: 30, // 控制速度
      frame: 0, // 控制速度
      startButton: {}, // 开始按钮
      radios:[] // 记录3个radio
    })
    // 初始化
    const init = () => {
      state.block = new Block()
      state.nextBlock = new Block()
      state.map = new Map(state.row, state.col)
      bindEvent()
    }
    // 开始
    const begin = () => {
      state.radios = document.querySelectorAll('input')
      for (let i = 0; i < state.radios.length; i++) {
        state.radios[i].disabled = true
      }
      state.startButton = document.querySelector('.btn')
      state.startButton.disabled = true
      state.timer = setInterval(() => {
        state.frame++
        clear()
        renderBlock()
        renderNextBlock()
        renderMap()
        if (state.frame % state.duration === 0) { // 控制下落的速度
          let res = state.block.checkDown(state.map, state.timer)
          if (res !== 0) {
            if (res === 2) { // 游戏结束，收尾清除工作
              clearInterval(state.timer)
              alert('Ooops! You Fail')
              clear()
              state.map = new Map(state.row, state.col)
              for (let i = 0; i < state.radios.length; i++) {
                state.radios[i].disabled = ''
              }
              state.startButton.disabled = ''
            }else { // 游戏尚未结束
              state.score += res === 1 ? 0 : res
              state.block = state.nextBlock
              state.nextBlock = new Block()
            }
          }
        }
      }, 20)
    }
    // 监听按键事件
    const bindEvent = () => {
      document.addEventListener("keydown", function (event) {
        event.preventDefault()
        if (event.key === 'ArrowLeft'){ // 按左向左移动
          state.block.checkLeft(state.map)
        } else if (event.key === 'ArrowRight') { // 按右向右移动
          state.block.checkRight(state.map)
        } else if (event.key === ' ') { // 按空格直接下落
          // 一键到底
          state.block.checkToEnd(state.map)
        } else if (event.key === 'ArrowUp') { // 按上旋转
          state.block.blockRotate(state.map)
        }
      })
    }
    // 渲染下落方块
    const renderBlock = () => {
      let trs = document.querySelectorAll('.boardTr')
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          if (state.block.block[i][j] !== 0) {
            let tds = trs[i + state.block.row].querySelectorAll('td') // 为什么写类名会报错？
            tds[j + state.block.col].className = 'c1'
          }
        }
      }
    }
    // 渲染下一方块
    const renderNextBlock = () => {
      let trs = document.querySelectorAll('.preTr')
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          if (state.nextBlock.block[i][j] !== 0) {
            let tds = trs[i].querySelectorAll('td')
            tds[j].className = 'c1'
          }
        }
      }
    }
    // 渲染map
    const renderMap = () => {
      let trs = document.querySelectorAll('.boardTr')
      for (let i = 0; i < state.row; i++) {
        for (let j = 0; j < state.col; j++) {
          if (state.map.mapCode[i][j] !== 0) {
            let tds = trs[i].querySelectorAll('td')
            tds[j].className = 'c2'
          }
        }
      }
    }
    // 清除下落方块和下一方块的显示
    const clear = () => {
      let trs = document.querySelectorAll('.boardTr')
      for (let i = 0; i < state.row; i++) {
        for (let j = 0; j < state.col; j++) {
          let tds = trs[i].querySelectorAll('td')
          tds[j].className = ''
        }
      }
      let preTrs = document.querySelectorAll('.preTr')
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          let preTds = preTrs[i].querySelectorAll('td')
          preTds[j].className = ''
        }
      }
    }
    // 修改block下落速度
    const modifyDuartion = (e:any) => {
      state.duration = parseInt(e.target.value)
    }

    init()

    return {
      state,
      begin,
      modifyDuartion
    }
  }
});
</script>

<style>
  #app {
    margin-top: 20px;
  }
  * {
    margin: 0;
    padding: 0;
  }
  .wrapper {
    width: 80%;
    height: 100%;
    margin: 0 auto;
    background-color: #555;
    padding-bottom: 40px;
  }
  p {
    font-size: 30px;
    margin-bottom: 10px;
    text-align: center;
  }
  table {
    border-collapse: collapse;
    margin: 0 auto;
  }
  td {
    border: 1px solid #fff;
    background-color: lightgray;
  }
  .content {
    display: flex;
  }
  .board {
    flex-basis: 80%;
  }
  @media screen and (max-width: 700px){ /* 根据屏幕的大小尺寸控制游戏盘的大小 */
    .board .playBoard {
      width: 80%;
    }
  }
  @media screen and (min-width: 701px){
    .board .playBoard {
      width: 40%;
    }
  }
  .board .playBoard td {
    width: calc(100% / 12); /*宽和高随着屏幕尺寸的大小改变*/
    height: 0;
    padding-bottom: calc(100% / 12);
  }
  .right {
    flex-basis: 20%;
    border: 2px solid #fff;
    background-color: #555;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .pre {
    width: 60%;
    flex: 2 1;
  }
  .pre span {
    font-size: 2vw; /*控制字体的大小*/
  }
  .pre .preView {
    width: 100%;
  }
  .pre .preView td {
    width: calc(100% / 4);
    height: 0;
    padding-bottom: calc(100% / 4);
  }
  .score {
    flex: 1 1;
    font-size: 2vw
  }
  .modeSection {
    flex: 1 1;
    width: 80%;
    border: 1px solid #fff;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
  }
  .modeSection span {
    margin-left: 5px;
    font-size: 2vw;
  }
  .startButton {
    flex: 1 1;
    margin-top: 20%;
    width: 100%;
  }
  .startButton .btn {
    width: 50%;
    height: 30%;
    background-color: aquamarine;
    display: inline-block;
    border: none;
    border-radius: 10%;
    margin-left: 25%;
    font-size: 2vw;
  }



  .c1 {
    background-color: aquamarine;
  }
  .c2 {
    background-color: antiquewhite;
  }

</style>
