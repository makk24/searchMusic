//index.js
//获取应用实例
const app = getApp()
const bgm = wx.getBackgroundAudioManager();
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
    bgm.onPlay(function () {
      that.setData({
        playing: true
      })
      app.globalData.playing["playing"] = true;
    })

    /**
     * 监听音乐暂停
     */
    bgm.onPause(function () {
      that.setData({
        playing: false,
        playingid: 0
      })
      app.globalData.playing["playing"] = false;
    })

    /**
     * 监听音乐停止
     */
    bgm.onStop(function () {
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
      istoday: false
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
          list: res.data.playlist.tracks || []
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
      title: '热门音乐，快来搜搜看~'
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
    bgm.pause()
  },
  /**
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
      bgm.title = res.name
      bgm.epname = res.name
      bgm.singer = res.singer
      bgm.coverImgUrl = res.coverImgUrl
      bgm.src = res.dataUrl
      bgm.play()
      that.setData({
        playBar: res.playBar,
        playing: true,
        playingid: res.playBar.id
      })
    } else {
      var item = that.data.data[event.currentTarget.dataset.id]
      that.gotoDetail({
        currentTarget: {
          dataset: {
            index: event.currentTarget.dataset.id,
            id: item.id,
            type: "song",
            name: item.name,
            songer: item.ar[0],
            img: item.al.picUrl
          }
        }
      });
    }
  },
  gotoDetail_sup: function (e) {
    let that = this;
    let isshow = wx.getStorageSync(app.config.config.isshow) || 0;
    if (isshow != new Date().getDate()) {
      wx.requestSubscribeMessage({
        tmplIds: ['dyHKUlEDOsCDzSQjQ_4fc3VfVcS0DpsqwPe64sI2llk'],
        success(res) {
          console.log(res)
          that.gotoDetail(e)
          wx.setStorageSync(app.config.config.isshow, new Date().getDate())
        },
        fail(res) {
          console.log(res)
          that.gotoDetail(e)
        }
      })
    }
    else {
      that.gotoDetail(e)
    }
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
          url: 'https://makunkun.cn/song/url?id=' + e.currentTarget.dataset.id, //仅为示例，并非真实的资源
          success: function (res) {
            console.log(res)

            bgm.title = e.currentTarget.dataset.name
            bgm.epname = e.currentTarget.dataset.name
            bgm.singer = e.currentTarget.dataset.songer
            bgm.coverImgUrl = e.currentTarget.dataset.img
            // 设置了 src 之后会自动播放
            bgm.src = res.data.data[0].url
            bgm.onPlay(function () {
              that.setData({
                playing: true,
                playingid: e.currentTarget.dataset.id,
                isshowplay: true,
                playBar: {
                  index: e.currentTarget.dataset.index,
                  coverImgUrl: e.currentTarget.dataset.img,
                  name: e.currentTarget.dataset.name,
                  id: e.currentTarget.dataset.id
                },
              })
              app.globalData.playing = {
                isshowplay: true,
                playBar: {
                  index: e.currentTarget.dataset.index,
                  coverImgUrl: e.currentTarget.dataset.img,
                  name: e.currentTarget.dataset.name,
                  id: e.currentTarget.dataset.id
                },
                dataUrl: res.data.data[0].url,
                name: e.currentTarget.dataset.name,
                singer: e.currentTarget.dataset.songer,
                coverImgUrl: e.currentTarget.dataset.img,
                index: e.currentTarget.dataset.index,
                playing: true
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