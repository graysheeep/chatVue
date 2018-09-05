<template>
  <div class="container">
    <div class="header">
      <span
        class="tab ai"
        :class="{
          'selected': selectedTab === 0
        }"
        @click="selectedTab = 0">
        徐汇区行政服务中心人工智能系统
      </span>
      <!--这里暂时不用-->
      <!--<span-->
        <!--class="tab"-->
        <!--:class="{-->
          <!--'selected': selectedTab === 1-->
        <!--}"-->
        <!--@click="selectedTab = 1">-->
        <!--人工客服-->
      <!--</span>-->
    </div>

    <img src="../assets/expand.png" class="expand" :class="{ 'expanded': showHot }" @click="onExpand">

    <div class="chat-content" ref="chatContent">

      <div class="q-a" v-for="(item, index) in questionList" :key="index">
        <div v-if="item.question!=null">
        <div class="question-box">
          <p class="question-content">
            {{item.question}}
          </p>
        </div>
        </div>
        <div v-if="item.answer!=null">
        <div class="answer" >
          <div class="avatar"></div>
          <div class="answer-content">
            <div class="triangle" ></div>

            <!--<h1>您的问题是：<span>{{item.question}}</span></h1>-->
            <!--<h2>我们为您找到以下答案</h2>-->
            <dl v-html="item.answer">
              {{ item.answer }}
            </dl>
            <!--暂时不用-->
            <!--<ul>-->
              <!--<li>-->
                <!--普通话水平测试-->
                <!--<span class="tag tag1">办事服务</span>-->
              <!--</li>-->
              <!--<li>-->
                <!--水平衡测试报告方案-->
                <!--<span class="tag tag1">办事服务</span>-->
              <!--</li>-->
              <!--<li>-->
                <!--本市推进智能网联汽车道路测试宝马中国-->
                <!--<span class="tag tag2">公众服务</span>-->
              <!--</li>-->
              <!--<li>本市推进智能网联汽车路测试成长性…</li>-->
            <!--</ul>-->

            <!--<div class="more">更多信息 >></div>-->
          </div>
        </div>
          <div v-if="temp">
          <div class="feedback">
            你对以上问答是否满意？
            <img :src="hasLiked ? likedIcon : likeIcon" class="like" @click="onLike">
            <img :src="hasDisliked ? likedIcon : likeIcon" class="dislike" @click="onDislike">
          </div>
          </div>
        </div>
        <!--<div class="question-box">-->
          <!--<p class="question-content">-->
            <!--本市推进智能网联汽车道路测试宝马中国获颁路测试牌-->
          <!--</p>-->
        <!--</div>-->
      </div>

    </div>

    <div class="input-box">
      <input
        type="text"
        placeholder="请输入问题内容，我来为你解答…"
        :value="input"
        @input="onChangeInput"
        ref="input"
        @keyup.enter="sendQuestion">

      <div class="send" @click="sendQuestion"></div>
      <span class="count">{{ count }}</span>
    </div>

    <div class="advice" v-show="hasDisliked">
      <advice-box />
    </div>
  </div>
</template>
<script src="https://unpkg.com/axios/dist/axios.min.js"></script>

<script>
import eventBus from '../common/eventBus.js'
import AdviceBox from './AdviceBox'
import global_ from '../common/Global'
export default {

  data () {
    return {
      count: 89,
      input: '',
      selectedTab: 0,
      temp:true,
      // data: {
      // },
      questionList: [
        // {answer:'<a @click="setShi(\'a\')">A:选a</a>'}
      ],
      word:'',
      responseResoult: '',
      showHot: true,
      hasLiked: false,
      hasDisliked: false,
      likeIcon: require('../assets/like.png'),
      likedIcon: require('../assets/liked.png')
    }
  },
  components: {
    AdviceBox
  },
  // watch:{
  //   query(){
  //
  //   }
  // },
  mounted() {
    this.getEventDatas()
    window.setShi = (word)=>{
      console.log('查看是否替换'+word)
      eventBus.$emit('hotTopic',word)
    }
  },
  methods: {
    setShi(word){
      console.log("word"+word)
    },
    getEventDatas() {
      const that = this
      eventBus.$on('hotTopic',function (val) {
        that.word = val
        console.log(val)
        that.questionList.push({question:that.word})
        that.$http.post('https://can.xmduruo.com:4000/wechatroutine//webWord.do',{
          'word':val,
          'sessionId':global_.sessionId
        },{emulateJSON:true})
          .then((res) => {
            //  把返回值给到
            var result=res.data.data
            console.log(res.data.data)
            var reg = /[a-zA-z]+:\/\/[^\s]*/g;
            var url;
            while ((url = reg.exec(result)) != null) {
              result = result
                .replace(url,
                  "<a href='"+url+"' target='_blank'><font color='blue'>请点这里哦~</font></ a>");
            }//这里的reg就是上面的正则表达式
            result = result.replace(/\\r\\n/g, "<br/>");
            console.log(result.replace(/\\r\\n/g, "<br/>"))
            result = result.replace(/\\n/g, "<br/>");
            result = result.replace('void0',';')
            result = result.replace('\\\"','\'')
//          this.responseResoult = result
            let data = {
              answer: result
            }
            that.questionList.push(data)
            that.word=''
            // this.responseResoult = ''
            setTimeout(() => {
              that.$refs.chatContent.scrollTop = 99999
            }, 50)
          })
      })
    },
    onChangeInput(e) {
      this.input = e.target.value.slice(0, 89)
      this.$refs.input.value = e.target.value.slice(0, 89)
      this.count = 89 - this.input.length
    },
    onLike() {
      this.temp=false
      this.hasLiked = !this.hasLiked
      if (this.hasLiked) {
        this.hasDisliked = false
      }
    },

    onDislike() {
      this.temp=false
      this.hasDisliked = !this.hasDisliked
      if (this.hasDisliked) {
        this.hasLiked = false
      }
    },
    // setShi(value) {
    //   $("#newquestion").val(value);
    //   sendQuestion();
    // }
    sendQuestion(){
      this.getList()
    },
    onExpand() {
      this.showHot = !this.showHot
      window.eventBus.$emit('on-showhot', this.showHot)
    },
    getList: function () {
      if(this.input.length==0){
        return false;
      }
      this.questionList.push({question:this.input})
      this.word=this.input
      this.input = ''
      this.$http.post('https://can.xmduruo.com:4000/wechatroutine//webWord.do',{
        'word':this.word,
        'sessionId':global_.sessionId
      },{emulateJSON:true})
        .then((res) => {
          //  把返回值给到
          var result=res.data.data
          var reg = /[a-zA-z]+:\/\/[^\s]*/g;
          var url;
          while ((url = reg.exec(result)) != null) {
            result = result
              .replace(url,
                "<a href='"+url+"' target='_blank'><font color='blue'>请点这里哦~</font></ a>");
          }//这里的reg就是上面的正则表达式
          result = result.replace(/\\r\\n/g, '<br/>');
          result = result.replace(/\\n/g, '<br/>');
          result = result.replace('void0',';')
          result = result.replace('\\\"','\'')
            let data = {
              answer: result
            }
            this.questionList.push(data)
            this.word=''
            setTimeout(() => {
              this.$refs.chatContent.scrollTop = 99999
            }, 50)
        })
      // axios.post('https://can.xmduruo.com:4000/wechatroutine//byWord.do', word)
      //   .then(function (resonse) {
      //     this.responseResoult = resonse.data
      //   })
      //   .catch(function (error) {
      //     console.log(error);
      //   })
    },
  }
}
</script>

<style scoped>
.container {
  width: 100%;
  height: 100%;
  position: relative;
}

.header {
  height: 57px;/*no*/
  text-align: left;
  padding-left: 30px;
  box-sizing: border-box;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  background-color: #fff;
  box-shadow: 0 1px 0 0 #F5F5F5;
  z-index: 99;
}

.tab {
  display: inline-block;
  line-height: 57px;/*no*/
  color: #9A9A9F;
  font-size: 16px;/*no*/
  position: relative;
  cursor: pointer;
}

.selected {
  font-weight: bold;
  color: #1F1F1F;
}

.selected::after {
  content: '';
  position: absolute;
  height: 2px;
  width: 40px;
  border-radius: 99px;
  bottom: 0;
  background-color: #464F5E;
  right: 50%;
  transform: translateX(50%);
}

.tab.ai {
  margin-right: 23px;
}

.chat-content {
  padding-top: 44px;
  padding-bottom: 140px;/*no*/
  /*height: 613px;*/
  overflow-y: scroll;
  box-sizing: border-box;
  position: absolute;
  top: 0;
  bottom: 100px;/*no*/
  width: 100%;
  left: 0;
}

.expand {
  position: absolute;
  right: 20px;/*no*/
  top: 50%;
  transform: translateY(-50%);
  width: 20px;/*no*/
  cursor: pointer;
  z-index: 99;
}

.expanded {
  transform: translateY(-50%) rotate(180deg);
}

.avatar {
  width: 33px;/*no*/
  height: 33px;/*no*/
  border-radius: 33px;
  background-color: #41BF76;
  background-image: url('../assets/bot.png');
  background-size: 20px;/*no*/
  background-position: center;
  background-repeat: no-repeat;
  margin-left: 16px;
  position: absolute;
}

.time {
  text-align: center;
  margin-top: 16px;
}

.time span {
  display: inline-block;
  color: #fff;
  font-size: 12px;/*no*/
  padding: 3px 7px;
  background: #E3E3E3;
  border-radius: 100px;
}

.question-box {
  text-align: right;
  margin-top: 24px;/*no*/
  margin-right: 28px;
  margin-left: 50px;
}

.question-content {
  display: inline-block;
  background-color: #41BF76;
  padding: 19px;/*no*/
  color: #fff;
  font-size: 14px;/*no*/
  border-radius: 10px;/*no*/
}

.answer {
  position: relative;
  margin-top: 28px;/*no*/
}

.more {
  text-align: left;
  color: #59CF8B;
  font-size: 12px;/*no*/
}

.answer-content {
  display: inline-block;
  background-color: #fff;
  padding: 13px 19px 11px 25px;
  box-shadow: 0 0 6px 0 rgba(0,0,0,0.10);
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
  margin-left: 70px;/*no*/
  margin-right: 76px;/*no*/
  position: relative;
}

.answer-content::before {
  content: '';
  position: absolute;
  left: -8px;
  top: 0;
  width: 0;
  height: 0;
  border-top: 20px solid #fff;
  border-left: 20px solid transparent;
  border-right: 20px solid transparent;
  border-bottom: 20px solid transparent;
}

.answer-content h1 {
  color: #252526;
  font-size: 12px;/*no*/
}

.answer-content h1 span {
  color: #41BF76;
}

.answer-content h2 {
  color: #252526;
  font-size: 12px;/*no*/
  margin-top: 21px;
}

.answer-content li {
  margin: 8px 0;/*no*/
  font-size: 12px;/*no*/
  line-height: 20px;/*no*/
  color: #252526;
}

.answer-content .tag {
  font-size: 11px;/*no*/
  line-height: 20px;/*no*/
  display: inline-block;
  padding: 0 8px;
  border-radius: 3px;
  color: #fff;
}

.tag1 {
  background-color: #FCB474;
}

.tag2 {
  background-color: #97C0FC;
}

.feedback {
  margin-top: 17px;/*no*/
  color: #9a9a9f;
  font-size: 12px;/*no*/
  line-height: 17px;/*no*/
  text-align: left;
  padding-left: 80px;
}

.feedback img {
  width: 22px;/*no*/
  margin-left: 21px;
  cursor: pointer;
}

.dislike {
  transform: rotate(180deg);
}

.input-box {
  position: absolute;
  bottom: 15px;
  left: 12px;
  right: 18px;
  /*height: 58px;*/
  border-radius: 99px;
  background-color: #fff;
  border: 1px solid #D6D6D6;
  box-shadow: 0 0 6px 0 rgba(0,0,0,0.10);
  padding: 9px 19px;/*no*/
  display: flex;
  align-items: center;
  z-index: 999;
}

.input-box input {
  flex: 1;
  padding-right: 30px;
  font-size: 14px;/*no*/
  outline: none;
  border: none;
}

.input-box input::-webkit-input-placeholder {
  color: #D2D2D6;
}

.send {
  width: 39px;/*no*/
  height: 39px;/*no*/
  border-radius: 99px;
  background-color: #41BF76;
  background-image: url('../assets/ss.png');
  background-size: 50%;
  background-repeat: no-repeat;
  background-position: center;
}

.count {
  display: inline-block;
  position: absolute;
  font-size: 12px;/*no*/
  color: #9a9a9f;
  bottom: 50%;
  transform: translateY(50%);
  right: 54px;
}

</style>
