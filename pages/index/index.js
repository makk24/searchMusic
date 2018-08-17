//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    name:""
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  getData:function(){
    var that=this;

    if(that.data.name){
    wx.navigateTo({
      url: '/pages/list/list?name='+that.data.name
    })
    }else{
      wx.showModal({
        title: '提示',
        showCancel:false,
        content: '请先输入歌名',
      })
    }
  },
  getsongname:function(e){
    console.log(e)
    this.setData({
      name:e.detail.value
    })
  },
  getDatatest: function () {
    var that = this;
    
    if (true) {
      wx.request({
         url: 'https://api.imjad.cn/cloudmusic/?type=song&id=247160', //仅为示例，并非真实的资源
        success: function (res) {
          console.log(res)
          wx.playBackgroundAudio({
            dataUrl: res.data.data[0].url,
            name: "res.name",
            singer: "res.singer",
            coverImgUrl: "res.coverImgUrl",
            complete: function (res) {
              that.setData({
                playing: true
              })
            }
          })
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '请先输入歌名',
      })
    }
  },
  onShareAppMessage: function () {
    // return custom share data when user share.
  },
  bindgetuserinfo:function(e){
    var that=this;
    wx.login({
      success:function(e){
        console.log(e)
        that.setData({
          code:e.code
        })
      }
    })
    console.log(e)
  },
  getPhoneNumber: function (e) {
    console.log(e)
  },
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e)
    this.setData({
      formid:e.detail.formId
    })
  },
})
