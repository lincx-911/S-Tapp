//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../single/single'
    })
  },
  bindChangeView: function() {
    wx.navigateTo({
      url: '../multiple/multiple'
    })
  },
  bindViewtur:function(){
    wx.navigateTo({
      url: '../tutorial/tutorial',
    })
  }
})
