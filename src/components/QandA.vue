<template>
  <div class="container">
    <div class="header">
      <span
        class="tab ai"
        :class="{
          'selected': selectedTab === 0
        }"
        @click="selectedTab = 0">
        智能回答
      </span>
      <!--<span-->
        <!--class="tab"-->
        <!--:class="{-->
          <!--'selected': selectedTab === 1-->
        <!--}"-->
        <!--@click="selectedTab = 1">-->
        <!--人工客服-->
      <!--</span>-->
    </div>

    <div class="chat-content" ref="chatContent">

      <div class="q-a" v-for="(item, index) in questionList" :key="index">
        <!--<div class="time">-->
          <!--<span>4:30PM</span>-->
        <!--</div>-->
        <div v-if="item.question!=null">
        <div class="question-box">
          <p class="question-content">
            {{item.question}}
          </p>
        </div>
        </div>

        <div v-if="item.answer!=null">
          <div class="answer">
            <div class="avatar"></div>
            <div class="answer-content">
              <div class="triangle"></div>
              <dl v-html="item.answer">
                {{ item.answer }}
              </dl>
            </div>
          </div>
          <div class="feedback">
            你对以上问答是否满意？
            <img :src="hasLiked ? likedIcon : likeIcon" class="like" @click="onLike">
            <img :src="hasDisliked ? likedIcon : likeIcon" class="dislike" @click="onDislike">
          </div>
        </div>
        <div class="advice" v-show="hasDisliked">
          <advice-mobile />
        </div>
    </div>

    <div class="input-box" @click="onClickInput" ref="inputBox">
      <input
        type="text"
        placeholder="简单输入，我来为你解答…"
        :value="input"
        @input="onChangeInput"
        ref="input"
        @keyup.enter="sendQuestion">

      <div class="send" @click="sendQuestion"></div>
      <span class="count">{{ count }}</span>
    </div>
  </div>
  </div>
</template>

<script>
import AdviceMobile from './AdviceMobile'
import global_ from '../common/Global'
export default {
  data () {
    return {
      count: 89,
      input: '',
      selectedTab: 0,
      questionList: [
      ],
      word: '',
      hasLiked: false,
      hasDisliked: false,
      likeIcon: require('../assets/like.png'),
      likedIcon: require('../assets/liked.png')
    }
  },
  components: {
    AdviceMobile
  },
  mounted () {
    window.setShi = (word) => {
      this.word = word
      console.log('查看是否替换' + word)
      this.questionList.push({question: this.word})
      this.$http.post('https://can.xmduruo.com:4000/wechatroutine//webWord.do', {
        'word': this.word,
        'sessionId': global_.sessionId
      }, {emulateJSON: true})
        .then((res) => {
          //  把返回值给到
          var result = res.data.data
          console.log(res.data.data)
          var reg = /[a-zA-z]+:\/\/[^\s]*.pdf/g
          var reg1 = /[a-zA-z]+:\/\/[^\s]*/g
          var url
          // 替换pdf预览
          while ((url = reg.exec(result)) != null) {
            console.log('222' + url)
            result = result
              .replace(url,
                "<a href='" + url + "' target='_blank'><font color='blue'>请点这里哦~</font></a>")
          }

          var reg3 = /[\u4e00-\u9fa5]{1}/g
          var url2
          while ((url2 = reg1.exec(result)) != null) {
            if (reg3.exec(url2) != null) {
              console.log('223' + url2)
            } else {
              console.log('123' + url2)
              result = result
                .replace(url2,
                  "<a href='" + url2 + "' target='_blank'><font color='blue'>请点这里哦~</font></a>")
            }
          }
          // 这里的reg就是上面的正则表达式
          result = result.replace(/\\r\\n/g, '<br/>')
          console.log(result.replace(/\\r\\n/g, '<br/>'))
          result = result.replace(/\\n/g, '<br/>')
          result = result.replace(/void0/g, ';')
          result = result.replace(/\\"\s/g, '"')
          result = result.replace(/\\"/g, '"')
          let data = {
            answer: result
          }
          this.questionList.push(data)
          this.word = ''
          this.input = ''
          // this.responseResoult = ''
          setTimeout(() => {
            this.$refs.chatContent.scrollTop = 99999
          }, 50)
        })
    }
  },
  methods: {
    onChangeInput (e) {
      this.input = e.target.value.slice(0, 89)
      this.$refs.input.value = e.target.value.slice(0, 89)
      this.count = 89 - this.input.length
    },

    sendQuestion () {
      this.getList()
    },

    onClickInput () {
      setTimeout(() => {
        this.$refs.inputBox.scrollIntoViewIfNeeded()
      }, 300)
    },

    onLike () {
      this.hasLiked = !this.hasLiked
      if (this.hasLiked) {
        this.hasDisliked = false
      }
    },

    onDislike () {
      this.hasDisliked = !this.hasDisliked
      if (this.hasDisliked) {
        this.hasLiked = false
      }
    },
    getList: function () {
      if (this.input.length === 0) {
        return false
      }
      this.word = this.input
      this.input = ''
      this.questionList.push({question: this.word})
      this.$http.post('https://can.xmduruo.com:4000/wechatroutine//webWord.do', {
        'word': this.word,
        'sessionId': global_.sessionId
      }, {emulateJSON: true})
        .then((res) => {
          //  把返回值给到
          var result = res.data.data
          console.log(res.data.data)
          var reg = /[a-zA-z]+:\/\/[^\s]*.pdf/g
          var reg1 = /[a-zA-z]+:\/\/[^\s]*/g
          var url
          // 替换pdf预览
          while ((url = reg.exec(result)) != null) {
            console.log('222' + url)
            result = result
              .replace(url,
                "<a href='" + url + "' target='_blank'><font color='blue'>请点这里哦~</font></a>")
          }

          var reg3 = /[\u4e00-\u9fa5]{1}/g
          var url2
          while ((url2 = reg1.exec(result)) != null) {
            if (reg3.exec(url2) != null) {
              console.log('223' + url2)
            } else {
              console.log('123' + url2)
              result = result
                .replace(url2,
                  "<a href='" + url2 + "' target='_blank'><font color='blue'>请点这里哦~</font></a>")
            }
          }
          // 这里的reg就是上面的正则表达式
          result = result.replace(/\\r\\n/g, '<br/>')
          console.log(result.replace(/\\r\\n/g, '<br/>'))
          result = result.replace(/\\n/g, '<br/>')
          result = result.replace(/void0/g, ';')
          result = result.replace(/\\"\s/g, '"')
          result = result.replace(/\\"/g, '"')
          let data = {
            answer: result
          }
          this.questionList.push(data)
          this.word = ''
          this.input = ''
          // this.responseResoult = ''
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
    }

  }
}
</script>

<style scoped>
.header {
  height: 52px;/*no*/
  text-align: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-image: linear-gradient(-128deg, #62D983 0%, #41BF76 100%);
  z-index: 99;
}

.tab {
  display: inline-block;
  line-height: 52px;/*no*/
  color: #f2f2f2;
  font-size: 16px;/*no*/
  position: relative;
}

.selected {
  font-weight: bold;
}

.selected::after {
  content: '';
  position: absolute;
  height: 3px;
  width: 24px;
  border-radius: 99px;
  bottom: 2px;
  background-color: #fff;
  right: 50%;
  transform: translateX(50%);
}

.tab.ai {
  margin-right: 23px;
}

.chat-content {
  padding-top: 44px;
  padding-bottom: 150px;
  position: fixed;
  width: 100%;
  top: 0;
  bottom: 90px;
  overflow: scroll;
}

.avatar {
  width: 33px;
  height: 33px;
  border-radius: 33px;
  background-color: #41BF76;
  background-image: url('../assets/bot.png');
  background-size: 20px;
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
  margin-top: 13px;
  margin-right: 28px;
  margin-left: 50px;
}

.question-content {
  display: inline-block;
  background-color: #41BF76;
  padding: 12px 18px;
  color: #fff;
  font-size: 14px;/*no*/
  border-radius: 10px;
}

.answer {
  position: relative;
  margin-top: 20px;
}

.more {
  text-align: right;
  color: #59CF8B;
  font-size: 14px;/*no*/
}

.answer-content {
  display: inline-block;
  background-color: #fff;
  padding: 13px 19px 11px 25px;
  box-shadow: 0 0 6px 0 rgba(0,0,0,0.10);
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
  margin-left: 58px;
  margin-right: 28px;
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
  font-size: 16px;/*no*/
}

.answer-content h1 span {
  color: #41BF76;
}

.answer-content h2 {
  color: #252526;
  font-size: 16px;/*no*/
  margin-top: 21px;
}

.answer-content li {
  margin: 9px 0;
  font-size: 16px;/*no*/
  line-height: 20px;/*no*/
  color: #252526;
}

.answer-content .tag {
  font-size: 14px;/*no*/
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
  margin-top: 17px;
  color: #9a9a9f;
  font-size: 12px;/*no*/
  line-height: 17px;/*no*/
  text-align: center;
  padding-left: 80px;
}

.advice {
  margin-top: 17px;
}

.dislike {
  transform: rotate(180deg);
}

.feedback img {
  width: 18px;
  margin-left: 21px;
}

.input-box {
  position: fixed;
  bottom: 15px;
  left: 12px;
  right: 12px;
  /*height: 58px;*/
  border-radius: 99px;
  background-color: #fff;
  border: 1px solid #D6D6D6;
  box-shadow: 0 0 6px 0 rgba(0,0,0,0.10);
  padding: 9px 19px;
  display: flex;
  align-items: center;
}

.input-box input {
  flex: 1;
  padding-right: 10px;
  font-size: 14px;/*no*/
  border: none;
  outline: none;
}

.input-box input::-webkit-input-placeholder {
  color: #D2D2D6;
}

.send {
  width: 39px;
  height: 39px;
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
  bottom: 8px;
  right: 74px;
}

</style>
