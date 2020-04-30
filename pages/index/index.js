//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    name: "",
    playing: false,
    isshowplay: false,
    list: []
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onShow() {
    var that = this;
    that.setData({
      playing: app.globalData.playing["playing"]
    })
    /**
       * 监听音乐播放
       */
    wx.onBackgroundAudioPlay(function () {
      that.setData({
        playing: true
      })
      app.globalData.playing["playing"] = true;
    })

    /**
     * 监听音乐暂停
     */
    wx.onBackgroundAudioPause(function () {
      that.setData({
        playing: false,
        playingid: 0
      })
      app.globalData.playing["playing"] = false;
    })

    /**
     * 监听音乐停止
     */
    wx.onBackgroundAudioStop(function () {
      that.setData({
        playing: false,
        playingid: 0
      })
      app.globalData.playing["playing"] = false;
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    }
    this.getList()

    this.setData({
      istoday: new Date().getDate() == 25
    })
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  getData: function () {
    var that = this;

    if (that.data.name) {
      wx.navigateTo({
        url: '/pages/list/list?name=' + that.data.name
      })
    } else {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '请先输入歌名',
      })
    }
  },
  getList: function () {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: 'https://makunkun.cn/playlist/myhot?id=3778678',
      success: function (res) {
        console.log(res)
        wx.hideLoading()
        that.setData({
          list: res.data.result.tracks || []
        })
      },
      fail(res) {
        console.log(res)
        wx.hideLoading()
      }
    })
  },
  getsongname: function (e) {
    console.log(e)
    this.setData({
      name: e.detail.value
    })
  },
  onShareAppMessage: function () {
    // return custom share data when user share.
    return {
      title:'热门音乐，快来搜搜看~'
    }
  },
  bindgetuserinfo: function (e) {
    var that = this;
    wx.login({
      success: function (e) {
        console.log(e)
        that.setData({
          code: e.code
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
      formid: e.detail.formId
    })
  },


  pause: function () {
    var that = this
    wx.pauseBackgroundAudio()
  },/**
   * 设置进度
   */
  listenerButtonSeek: function () {
    wx.seekBackgroundAudio({
      position: 30
    })
  },
  play: function (event) {
    var that = this
    var res = app.globalData.playing;
    if (res.index >= 0) {
      that.setData({
        playBar: res.playBar
      })
      wx.playBackgroundAudio({
        dataUrl: res.dataUrl,
        name: res.name,
        singer: res.singer,
        coverImgUrl: res.coverImgUrl,
        complete: function (res) {
          that.setData({
            playing: true,
            playingid: res.playBar.id
          })
        }
      })
    } else {
      var item = that.data.data[event.currentTarget.dataset.id]
      that.gotoDetail({ currentTarget: { dataset: { index: event.currentTarget.dataset.id, id: item.id, type: "song", name: item.name, songer: item.ar[0], img: item.al.picUrl } } });
    }
  },
  gotoDetail_sup: function (e) {
    let that=this;
    wx.requestSubscribeMessage({
      tmplIds: ['dyHKUlEDOsCDzSQjQ_4fc3VfVcS0DpsqwPe64sI2llk'],
      success(res) {
        console.log(res)
        that.gotoDetail(e)
      },
      fail(res) {
        console.log(res)
        that.gotoDetail(e)
      }
    })
  },
  gotoDetail: function (e) {
    console.log(e.currentTarget.dataset)
    var that = this;
    if (e.currentTarget.dataset.id) {
      if (e.currentTarget.dataset.type == "comments") {
        wx.navigateTo({
          url: '/pages/detail/detail?id=' + e.currentTarget.dataset.id + "&type=" + e.currentTarget.dataset.type + "&name=" + e.currentTarget.dataset.name
        })
      } else {
        wx.request({
          url: 'https://api.imjad.cn/cloudmusic/?type=song&id=' + e.currentTarget.dataset.id, //仅为示例，并非真实的资源
          success: function (res) {
            console.log(res)
            wx.playBackgroundAudio({
              dataUrl: res.data.data[0].url,
              name: e.currentTarget.dataset.name,
              singer: e.currentTarget.dataset.songer,
              coverImgUrl: e.currentTarget.dataset.img,
              complete: function (r) {
                that.setData({
                  playing: true,
                  playingid: e.currentTarget.dataset.id,
                  isshowplay: true,
                  playBar: { index: e.currentTarget.dataset.index, coverImgUrl: e.currentTarget.dataset.img, name: e.currentTarget.dataset.name, id: e.currentTarget.dataset.id },
                })
                app.globalData.playing = {
                  isshowplay: true,
                  playBar: { index: e.currentTarget.dataset.index, coverImgUrl: e.currentTarget.dataset.img, name: e.currentTarget.dataset.name, id: e.currentTarget.dataset.id },
                  dataUrl: res.data.data[0].url,
                  name: e.currentTarget.dataset.name,
                  singer: e.currentTarget.dataset.songer,
                  coverImgUrl: e.currentTarget.dataset.img, index: e.currentTarget.dataset.index, playing: true
                }
              }
            })
          }
        })
      }
    } else {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '请先输入歌名',
      })
    }
  },
})
