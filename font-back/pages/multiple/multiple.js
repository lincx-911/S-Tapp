// pages/multiple/multiple.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  bindViewTap: function() {
    wx.navigateTo({
      url: '../multiple/input-direct/input-direct'
    })
  },
  bindExcel: function() {
    wx.navigateTo({
      url: '../multiple/input-excel/input-excel'
    })
  },
})