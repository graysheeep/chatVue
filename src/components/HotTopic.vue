<template>
  <div class="container">
    <div class="header">
      热门回答
      <img src="../assets/fire.png" alt="">
    </div>

    <ul class="list">
      <li
        v-for="(item, index) in questionList"
        :class="{
          'selected': selectedQuestion === index
        }"
        :key="index"
        @click="emitToB(item.question,index)">
        <h2 >{{ item.question }}</h2>
        <p>{{ item.answer }}</p>
      </li>
    </ul>
  </div>
</template>

<script>
import eventBus from '../common/eventBus.js'
export default {
  data () {
    return {
      questionList: [{
        question: '办理劳务派遣许可证的条件',
        answer: '经营劳务派遣业务应当具备下列...'
      }, {
        question: '数字证书丢失了怎么办',
        answer: '请携带好有效证件（证件需求参...'
      }, {
        question: '怎么查询退工登记备案的结果',
        answer: '窗口办理退工登记备案的去徐汇...'
      }, {
        question: '临时占用城市道路许可审批结果是什么',
        answer: '《上海市路政管理行政许可证》哦~ '
      }, {
        question: '营业性演出视听资料内容包括哪些？',
        answer: '歌曲类节目应当提交歌词文本及...'
      }, {
        question: '办理三证合一需要什么手续？',
        answer: '所谓“三证合一”，就是将企业依次按…'
      }],
      selectedQuestion: -1
    }
  },
  methods: {
    emitToB (val, index) {
      this.selectedQuestion = index
      eventBus.$emit('hotTopic', val)
    }
  }
}
</script>

<style scoped>
  .container {
    position: absolute;
    right: 0;
    width: 256px;/*no*/
    height: 100%;
    top: 0;
    background-color: #F5FFF9;
    box-shadow: -2px 0 9px 0 rgba(0, 0, 0, 0.08);
  }

  .header {
    height: 57px;/*no*/
    line-height: 57px;/*no*/
    padding-left: 33px;/*no*/
    color: #555966;
    font-size: 14px;/*no*/
    border-bottom: 1px solid #E4F2EA;/*no*/
    display: flex;
    align-items: center;
  }

  .header img {
    width: 12px;/*no*/
    height: 16px;/*no*/
    margin-left: 7px;/*no*/
  }

  li {
    padding: 12px 15px;/*no*/
    background-color: #fff;
    margin: 10px;/*no*/
    border-radius: 4px;/*no*/
    border: 1px solid #F0F0F0;/*no*/
    cursor: pointer;
  }

  li.selected {
    background-color: #41BF76;
  }

  li.selected h2 {
    color: #fff;
  }

  li.selected p {
    color: #FFFFFF;
    opacity: 0.8;
  }

  .list h2 {
    color: #555966;
    font-size: 12px;/*no*/
  }

  .list p {
    color: #898794;
    font-size: 12px;/*no*/
    margin-top: 7px;/*no*/
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
