// pages/tutorial/tutorial.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url_test:'https://mp.weixin.qq.com/s/RdXAAeeFXJmquczoxOQtHw',
    url:'https://page.om.qq.com/page/OKGdJA91-TOkXf7WTcQUn98g0?ADTAG=tgi.wx.share.message'
  },
  errBind:function () {
    wx.showToast({
      title: '加载失败',
      icon:'none',
      duration:2000
    })
  },
  bindViewChange:function (res) {
    var index = res.currentTarget.dataset.index
    wx.navigateTo({
      url: `./multipletutorial/multipletutorial?id=${index}`,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})