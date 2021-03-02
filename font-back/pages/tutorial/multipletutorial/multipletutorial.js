// pages/tutorial/multipletutorial/multipletutorial.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    html:'',
    html_list:['<p><br/></p><p style="text-align:center"></p><h1 class="title" align="left" style="box-sizing: border-box; margin: 0px; padding: 0px; border: 0px; font-size: 22px; vertical-align: baseline; background: rgb(255, 255, 255); line-height: 30px; color: rgb(51, 51, 51); word-break: break-all; font-family: PingFangSC, &quot;Helvetica Neue&quot;, Helvetica, &quot;Nimbus Sans L&quot;, Arial, &quot;Liberation Sans&quot;, &quot;Hiragino Sans GB&quot;, &quot;Source Han Sans CN Normal&quot;, &quot;Microsoft YaHei&quot;, &quot;Wenquanyi Micro Hei&quot;, &quot;WenQuanYi Zen Hei&quot;, &quot;ST Heiti&quot;, SimHei, &quot;WenQuanYi Zen Hei Sharp&quot;, sans-serif; white-space: normal; text-align: center;">改进型S-T教学分析法对图分析举例——学生行为分析</h1><p style="text-align:center"><span style="color: rgb(34, 34, 34); font-family: PingFangSC, &quot;Helvetica Neue&quot;, Helvetica, &quot;Nimbus Sans L&quot;, Arial, &quot;Liberation Sans&quot;, &quot;Hiragino Sans GB&quot;, &quot;Source Han Sans CN Normal&quot;, &quot;Microsoft YaHei&quot;, &quot;Wenquanyi Micro Hei&quot;, &quot;WenQuanYi Zen Hei&quot;, &quot;ST Heiti&quot;, SimHei, &quot;WenQuanYi Zen Hei Sharp&quot;, sans-serif; font-size: 17px; text-align: justify; background-color: rgb(255, 255, 255);"></span><br/></p><p style="text-align:center"><span style="color: rgb(34, 34, 34); font-family: PingFangSC, &quot;Helvetica Neue&quot;, Helvetica, &quot;Nimbus Sans L&quot;, Arial, &quot;Liberation Sans&quot;, &quot;Hiragino Sans GB&quot;, &quot;Source Han Sans CN Normal&quot;, &quot;Microsoft YaHei&quot;, &quot;Wenquanyi Micro Hei&quot;, &quot;WenQuanYi Zen Hei&quot;, &quot;ST Heiti&quot;, SimHei, &quot;WenQuanYi Zen Hei Sharp&quot;, sans-serif; font-size: 17px; text-align: justify; background-color: rgb(255, 255, 255);"><img src="https://inews.gtimg.com/newsapp_bt/0/12836389516/641"/></span></p><p style="text-align: left;width:90%;margin:0 auto;"><span style="color: rgb(34, 34, 34); text-align: left; background-color: rgb(255, 255, 255); font-family: 微软雅黑, &quot;Microsoft YaHei&quot;; font-size: 16px;">图1中有四段比较明显的、连续的竖直直线，表明该段时间内课堂以学生行为为主，结合视频分析，课堂刚开始的第一段竖直直线为学生行为，主要是教师在上课时播放了一段视频，学生以看视频为主，第二段竖直直线是学生小组合作构建模型，第三段竖直直线是学生小组合作利用橡皮泥构建模型，第四段竖直直线是学生通过模型构建的方法分析无子西瓜培育过程，这四段教学过程都是以学生为主体，故而在图像中显示为竖直的直线。</span></p>',
    '<h1 class="title" align="left" style="box-sizing: border-box; margin: 0px; padding: 0px; border: 0px; font-size: 22px; vertical-align: baseline; background: rgb(255, 255, 255); line-height: 30px; color: rgb(51, 51, 51); word-break: break-all; font-family: PingFangSC, &quot;Helvetica Neue&quot;, Helvetica, &quot;Nimbus Sans L&quot;, Arial, &quot;Liberation Sans&quot;, &quot;Hiragino Sans GB&quot;, &quot;Source Han Sans CN Normal&quot;, &quot;Microsoft YaHei&quot;, &quot;Wenquanyi Micro Hei&quot;, &quot;WenQuanYi Zen Hei&quot;, &quot;ST Heiti&quot;, SimHei, &quot;WenQuanYi Zen Hei Sharp&quot;, sans-serif; white-space: normal; text-align: center;"><span style="font-family: 微软雅黑, &quot;Microsoft YaHei&quot;;">改进型S-T教学分析法对图分析举例——教师行为分析</span></h1><p style="text-align: center;"><img src="https://inews.gtimg.com/newsapp_bt/0/12836389516/641"/></p><p style="box-sizing: border-box;margin-bottom: 0px; padding: 0px; border: 0px; font-size: 13px; vertical-align: baseline; background: transparent; line-height: 18px; letter-spacing: 1px; color: rgb(155, 155, 155); word-break: break-all; text-align: center;">《染色体变异》S-T图3</p><p style="box-sizing: border-box;width:90%;margin:0 auto;  margin-top: 15px; margin-bottom: 0px; padding: 0px; border: 0px; font-size: 17px; vertical-align: baseline; background: rgb(255, 255, 255); line-height: 28px; text-align: justify; word-break: break-all; color: rgb(34, 34, 34); font-family: PingFangSC, &quot;Helvetica Neue&quot;, Helvetica, &quot;Nimbus Sans L&quot;, Arial, &quot;Liberation Sans&quot;, &quot;Hiragino Sans GB&quot;, &quot;Source Han Sans CN Normal&quot;, &quot;Microsoft YaHei&quot;, &quot;Wenquanyi Micro Hei&quot;, &quot;WenQuanYi Zen Hei&quot;, &quot;ST Heiti&quot;, SimHei, &quot;WenQuanYi Zen Hei Sharp&quot;, sans-serif; white-space: normal;"><span style="font-family: 微软雅黑, &quot;Microsoft YaHei&quot;; font-size: 16px;">图3中有四段比较明显的、连续的横向直线，表明该段时间内课堂以教师行为为主，结合视频分析，教师在这几个时期主要在讲授与染色体相关的知识，学生行为不多，偶尔有互动，故而在图像中显示为水平的直线。</span></p><p><br/></p>',
    '<h1 class="title" align="left" style="box-sizing: border-box; margin: 0px; padding: 0px; border: 0px; font-size: 22px; vertical-align: baseline; background: rgb(255, 255, 255); line-height: 30px; color: rgb(51, 51, 51); word-break: break-all; font-family: PingFangSC, &quot;Helvetica Neue&quot;, Helvetica, &quot;Nimbus Sans L&quot;, Arial, &quot;Liberation Sans&quot;, &quot;Hiragino Sans GB&quot;, &quot;Source Han Sans CN Normal&quot;, &quot;Microsoft YaHei&quot;, &quot;Wenquanyi Micro Hei&quot;, &quot;WenQuanYi Zen Hei&quot;, &quot;ST Heiti&quot;, SimHei, &quot;WenQuanYi Zen Hei Sharp&quot;, sans-serif; white-space: normal; text-align: center;"><span style="font-family: 微软雅黑, &quot;Microsoft YaHei&quot;;">改进型S-T教学分析法对图分析举例——互动行为<span></h1><p style="text-align: center;"><span style="font-family: 微软雅黑, &quot;Microsoft YaHei&quot;"><img src="https://inews.gtimg.com/newsapp_bt/0/12836389517/641"/></span></p><p style="box-sizing: border-box; margin-top: 10px; margin-bottom: 0px; padding: 0px; border: 0px; font-size: 13px; vertical-align: baseline; background: transparent; line-height: 18px; letter-spacing: 1px; color: rgb(155, 155, 155); word-break: break-all; text-align: center;">《染色体变异》S-T图2</p><p style="box-sizing: border-box;width:90%;margin:0 auto; margin-top: 15px; margin-bottom: 0px; padding: 0px; border: 0px; font-size: 17px; vertical-align: baseline; background: rgb(255, 255, 255); line-height: 28px; text-align: left; word-break: break-all; color: rgb(34, 34, 34); font-family: PingFangSC, &quot;Helvetica Neue&quot;, Helvetica, &quot;Nimbus Sans L&quot;, Arial, &quot;Liberation Sans&quot;, &quot;Hiragino Sans GB&quot;, &quot;Source Han Sans CN Normal&quot;, &quot;Microsoft YaHei&quot;, &quot;Wenquanyi Micro Hei&quot;, &quot;WenQuanYi Zen Hei&quot;, &quot;ST Heiti&quot;, SimHei, &quot;WenQuanYi Zen Hei Sharp&quot;, sans-serif; white-space: normal;"><span style="font-size: 16px; font-family: 微软雅黑, &quot;Microsoft YaHei&quot;;">图2中有三段比较明显的、连续的倾斜直线，表明该段时间内课堂以教师-学生互动行为为主，教师引导学生思考，教师与学生讨论，体现了“以教师为主导，以学生为主体”的教学理念。</span></p>']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.id)
    this.setData({
      html:this.data.html_list[options.id-1]
    })
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