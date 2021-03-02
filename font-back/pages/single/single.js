// pages/input-direct/input-direct.js
Page({

  data: {
    collect_time:0,
    duration:0,
    space:0,
    data_req:[],
    input_time:0
  },
  bindViewTap: function() {
    wx.navigateTo({
      url: '../single/input-direct/input-direct'
    })
  },
  bindExcel: function() {
    wx.navigateTo({
      url: '../single/input-excel/input-excel'
    })
  },


})