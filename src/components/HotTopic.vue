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
        @click="selectedQuestion = index">
        <h2 @click="emitToB(item.question)">{{ item.question }}</h2>
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
        question: '办理用工备案的范围是哪些？',
        answer: '招退工管理办法的范围是本市行政...'
      }, {
        question: '招工手续办理完毕后，劳动者人事档案应该怎么办？',
        answer: '招工手续办理完毕后，用人单位应...'
      }, {
        question: '单位如何办理“法人一证通”数字证书？',
        answer: '本市用人单位需要在招退工自助经...'
      }, {
        question: '酒类商品批发和酒类商品零售有何区别？',
        answer: '酒类商品批发指以转售酒类商品为...'
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
    emitToB (val) {
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
