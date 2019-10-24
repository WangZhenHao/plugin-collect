<template>
    <view>
        <view class="key-board-input">
            <view @click="onClickInput">
                <input
                    class="key-baoard__numeric"
                    readonly="readonly"
                    :style="personalizeStyle"
                    type="text"
                    :placeholder="placeholder"
                    :disabled="disabled"
                    v-model="inputValue"
                    @focus="onFocus"
                    @blur="isShowCursor = true"
                />
            </view>
            <!-- #ifdef APP-PLUS || H5 -->
            <view class="key-board__cursor" v-if="isFocus"></view>
            <!-- #endif  -->
            <!-- #ifndef APP-PLUS || H5 -->
            <view
                class="key-board__cursor"
                v-if="isFocus && isShowCursor"
            ></view>
            <!-- #endif -->
        </view>
        <view class="key-board text-center" :style="showKeyboardStyle">
            <view class="key-code-block clearfix line-height">
                <text class="key-code" @click="onPress('1')">1</text>
                <text class="key-code" @click="onPress('2')">2</text>
                <text class="key-code" @click="onPress('3')">3</text>
                <text class="key-code" @click="onPress('4')">4</text>
                <text class="key-code" @click="onPress('5')">5</text>
                <text class="key-code" @click="onPress('6')">6</text>
                <text class="key-code" @click="onPress('7')">7</text>
                <text class="key-code" @click="onPress('8')">8</text>
                <text class="key-code" @click="onPress('9')">9</text>
                <text
                    class="key-code iconfont icon-jianpan"
                    @click="isFocus = false"
                ></text>
                <text class="key-code" @click="onPress('0')">0</text>
                <text
                    class="key-code iconfont icon-dot"
                    @click="onPress('.')"
                ></text>
            </view>
            <view class="options">
                <view
                    class="delete iconfont icon-backspace line-height"
                    @click="onDelPress"
                ></view>
                <view class="comfirm" @click="onEnterPress">{{
                    entertext
                }}</view>
            </view>
        </view>
    </view>
</template>

<script>
  export default {
      model: {
          prop: 'inputValue',
          event: 'change',
      },
      props: {
          inputType: {
              type: String,
              default: 'text',
          },
          autofocus: {
              type: Boolean,
              default: false,
          },
          disabled: {
              type: [Boolean, String],
              default: false,
          },
          maxlength: {
              type: Number,
          },
          placeholder: {
              type: String,
              default: 'please input',
          },
          personalizeStyle: {
              type: String,
              default: '',
          },
          value: {
              type: String,
              default: '',
          },
          // change the label of keyboard enter key, use iconfont for icon.
          entertext: {
              type: String,
              default: '确认',
          },
          decimals: {
              type: Number,
              default: 2,
          },
      },
      data() {
          return {
              inputValue: this.value,
              isFocus: this.autofocus,
              isShowCursor: true,
          };
      },
      computed: {
          //   控制弹出虚拟键盘
          showKeyboardStyle() {
              return `transform: translateY(${this.isFocus ? 0 : 250}px)`;
          },
      },
      watch: {
          inputValue(newValue) {
              if (newValue.split('.')[0].length >= this.maxlength) {
                  this.inputValue = newValue.substr(0, this.maxlength);
              }
              this.$emit('change', this.inputValue);
          },
          value(newValue) {
              if (newValue.split('.')[0].length >= this.maxlength) {
                  this.inputValue = newValue.substr(0, this.maxlength);
              }else {
                   this.inputValue = newValue;
              }
          },
      },
      methods: {
          onClickInput() {
            if(!this.disabled){
                this.isFocus = true;
            }
          },
          onPress(number) {
              if (!this.inputValue.length) {
                  if (number.indexOf('.') > -1) {
                      return;
                  }
              }
              //   控制小数点
              if (this.inputValue.indexOf('.') > -1) {
                  if (number.indexOf('.') > -1) {
                      return;
                  }
                  // 计算限制小数位数
                  if (
                      this.inputValue.length -
                          1 -
                          this.inputValue.lastIndexOf('.') >=
                      this.decimals
                  ) {
                      return;
                  }
              }
              this.inputValue += number;
              this.$emit('press', number);
          },
          onEnterPress() {
              this.isFocus = false;
              this.$emit('enterPress', Number(this.inputValue));
          },
          onDelPress() {
              this.inputValue = this.inputValue.slice(0, -1);
          },
          onFocus() {
              this.isShowCursor = false;
          },
      },
  };
</script>

<style lang="scss" scoped>
  @font-face {
      font-family: 'iconfont';
      src: url('//at.alicdn.com/t/font_709005_2fq0kn635st.eot?t=1529051510806'); /* IE9*/
      src: url('//at.alicdn.com/t/font_709005_2fq0kn635st.eot?t=1529051510806#iefix')
              format('embedded-opentype'),
          /* IE6-IE8 */
              url('data:application/x-font-woff;charset=utf-8;base64,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')
              format('woff'),
          url('//at.alicdn.com/t/font_709005_2fq0kn635st.ttf?t=1529051510806')
              format('truetype'),
          /* chrome, firefox, opera, Safari, Android, iOS 4.2+*/
              url('//at.alicdn.com/t/font_709005_2fq0kn635st.svg?t=1529051510806#iconfont')
              format('svg'); /* iOS 4.1- */
  }

  .iconfont {
      font-family: 'iconfont' !important;
      font-size: 16px;
      font-style: normal;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
  }

  .icon-back:before {
      content: '\e697';
  }

  .icon-more:before {
      content: '\e6a7';
  }

  .icon-dot:before {
      content: '\e600';
  }

  .icon-backspace:before {
      content: '\e61a';
  }

  .icon-jianpan:before {
      content: '\e65a';
  }

  .clearfix:after {
      content: '';
      display: block;
      clear: both;
  }
  .text-center {
      text-align: center;
  }
  .line-height {
      line-height: 60px;
  }
  .key-board {
      position: fixed;
      display: flex;
      width: 100%;
      height: 240px;
      bottom: 0;
      left: 0;
      z-index: 9;
      transition: transform 0.2s;
      background: #fff;
      box-shadow: 0 -2px 4px 0 #cfd4da;
  }
  .key-board.blur {
      transform: translateY(250px);
  }
  .key-board.focus {
      transform: translateY(0);
  }
  .key-board * {
      box-sizing: border-box;
  }
  .key-board > .key-code-block {
      flex: 1;
      color: $font-color-main-tint;
  }
  .key-board > .key-code-block > .key-code {
      float: left;
      font-size: $font-lgm;
      height: 25%;
      width: 33.33%;
      border-top: 1px solid #eee;
      border-right: 1px solid #eee;
  }
  .key-board > .options {
      width: 25%;
      height: 100%;
  }
  .key-board > .options > .delete {
      height: 25%;
      font-size: $font-lgm;
      color: $font-color-main-tint;
      border-top: 1px solid #eee;
  }
  .key-board > .options > .comfirm {
      height: 75%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      color: #fff;
      background: linear-gradient(to top, #ff8f40, #ffbd40);
      font-size: 18px;
  }
  .key-board-cursor.active:after {
      content: '|';
      animation: showHideCursor 1s steps(1) infinite;
  }
  @keyframes showHideCursor {
      50% {
          visibility: hidden;
      }
  }
  .key-board-input {
      position: relative;
  }
  .key-baoard__numeric {
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      padding: 0 4px;
      outline: 0;
      &:disabled {
          background: transparent;
      }
  }
  .key-board__cursor {
      pointer-events: none;
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0;
      width: 1px;
      height: 100%;
      background: $border-color-money;
      animation: showHideCursor 1s steps(1) infinite;
  }
</style>
