// pages/list/list.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    playing: false,
    isshowplay:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      istoday: new Date().getDate()==25
    })
    if (options.name) {
      that.getData(options.name)
    } else {
      wx.showModal({
        title: '提示',
        content: '参数错误'
      })
      wx.navigateBack({
        delta: 1
      })
    }
    

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that=this;
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
  getData: function (name) {
    var that = this;
    wx.request({
      url: "https://makunkun.cn/search",
      data: { keywords: name },
      success: function (res) {
        console.log(res)
        that.setData({
          data: res.data.result.songs
        })
      }
    })
  },
  gotoDetail_sup: function (e) {
    let that = this;
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
                  isshowplay:true,
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
      var item = that.data.data[event.currentTarget.dataset.id]
      that.gotoDetail({ currentTarget: { dataset: { index: event.currentTarget.dataset.id, id: item.id, type: "song", name: item.name, songer: item.ar[0], img: item.al.picUrl } } });
    }
  },
  onShareAppMessage: function () {
    // return custom share data when user share.
  },
})