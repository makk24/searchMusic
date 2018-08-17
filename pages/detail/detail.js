// pages/detail/detail.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    playBar: app.globalData.playing.playBar
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(app.globalData.playing)
    that.setData({
      playBar: app.globalData.playing.playBar
    })
    console.log(that.data.playBar)

    if (options.id) {
      wx.setNavigationBarTitle({
        title: options.name||"热门评论",
      })
      that.getData(options.id,options.type)
    } else {
      wx.showModal({
        title: '提示',
        content: '参数错误'
      })
      wx.navigateBack({
        delta: 1
      })
    }
    that.setData({
      isshowplay: app.globalData.playing["isshowplay"],
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
        playing: false
      })
      app.globalData.playing["playing"] = false;
    })

    /**
     * 监听音乐停止
     */
    wx.onBackgroundAudioStop(function () {
      that.setData({
        playing: false
      })
      app.globalData.playing["playing"] = false;
    })

  },
  getData: function (id,typename) {
    var that = this;
    wx.request({
      url: "https://api.imjad.cn/cloudmusic/",
      data: { type: typename, id: id },
      success: function (res) {
        console.log(res)
        that.setData({
          data: res.data.hotComments
        })
      }
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
            playing: true
          })
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '歌曲不存在',
      })
      // var item = that.data.data[event.currentTarget.dataset.id]
      // that.gotoDetail({ currentTarget: { dataset: { index: event.currentTarget.dataset.id, id: item.id, type: "song", name: item.name, songer: item.ar[0], img: item.al.picUrl } } });
    }
  },
  onShareAppMessage: function () {
    // return custom share data when user share.
  },
})