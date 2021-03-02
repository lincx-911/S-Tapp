// pages/input-direct/single/single.js



const app=getApp()
Page({

  data: {
    space_array:[
      {id: 15, name: '15'},
      {id: 30, name: '30'},
      {id: 45, name: '45'},
      {id: 60, name: '60'},
    ],
    grid_item:[
      {value: 0, name: '无格线', checked: true},
      {value: 1, name: '有格线',checked:false},
    ],
    pic_array: [
      { id: 0, name: ' '},
      { id: 1, name: 'S' },
      { id: 2, name: 'T' },
      { id: 3, name: 'D' },
    ],
    
    duration:0,
    space:0,
    data_test:[],
    data_time:[],
    data_req:[],
    input_time:0,
    total_time:0,
    showed:false,
    animation: '',
    showlist:true,
    up:true,
    shownum:5,
    legend:'',
    lenght_aix:0,
    answerImg:"",
    grid:0,
    Rt:[],
    Ch:[],
    Teach_Model:[
    ],
  },
  durchange:function(e){
    console.log(e)
    this.setData({
      duration:e.detail.value
    })
    if(this.data.duration!=0&&this.data.space!=0){
      this.setData({
        showed:true
      })
      this.confime()
    }
  },
  spachange:function (e) {
    console.log(e)

    this.setData({
      space:e.detail.value
    })
    if(this.data.duration!=0&&this.data.space!=0){
      this.setData({
        showed:true
      })
      this.confime()
    }
  },
  lenght_aixchange:function (e) {
    console.log(e)

    this.setData({
      lenght_aix:e.detail.value
    })
  },
  legend_change:function(e){
    console.log("legend:",e.detail.value)
    this.setData({
      legend:e.detail.value
    })
  },
  confime:function() {
    if(this.data.duration*60<this.data.space){
      wx.showToast({
        title: '课程时长不能少于采样间隔',
        icon:'none',
        duration: 2000
      })
      return
    }
    var total = Math.ceil((this.data.duration*60)/this.data.space)
    var arr =  new Array(total)
    var arr_time=new Array(total)
    var sp = Number(this.data.space)
    console.log(typeof this.data.space)
    
    for(var i=0;i<total;i++){
      arr[i]=' '
      arr_time[i]=this.secondFormat(sp*(i+1))
    }

    console.log(total)
    this.setData({
      showed:true,
      total_time:total,
      data_test:arr,
      data_time:arr_time,
      shownum:5,
    })
  },
  bindPickerChange_hx: function (e) {
    console.log(e.currentTarget.id);
    console.log('picker发送选择改变，携带值为', e.detail.value);
    var arr=this.data.data_req
 
    arr[e.currentTarget.id]=this.data.pic_array[e.detail.value].name
   
    this.setData({   //给变量赋值
      data_req:arr
    })
    
  },
  bindPickerChange_space:function(e){
    console.log('picker发送选择改变，携带值为', e);
    this.setData({   //给变量赋值
      space: this.data.space_array[Number(e.detail.value)].id
    })
    if(this.data.duration!=0&&this.data.space!=0){
      this.setData({
        showed:true
      })
      this.confime()
    }
  },
  secondFormat:function (sec) {
    let hour = Math.floor(sec/3600);
    let minute = Math.floor((sec-hour*3600)/60);
    let second = sec - hour * 3600 - minute * 60;
    if (hour < 10) {
      hour = "0" + hour;
    }
    if (minute < 10) {
        minute = "0" + minute;
    }
    if (second < 10) {
        second = "0" + second;
    }
    return hour + ":" + minute + ":" + second;
  },
  changeUp:function () {
    var num = 0;
    if(this.data.up==true){
      if(this.data.shownum>this.data.total_time){
        this.setData({
          shownum:this.data.total_time
        })
      }
      num=this.data.shownum
    }else{
    num=this.data.total_time
    }
    var arr = new Array(num)
    this.setData({
      up:!this.data.up,
      data_test:arr
    })
  },
  makePhoto:function (e) {
    var whichbnt = e.currentTarget.dataset.idx
    wx.showLoading({
      title: '加载中',
    })
    var that=this
    var serverurl = app.serverUrl;
    var arr = this.data.data_req
    var arr_str = arr.join('')
    if(Number(this.data.lenght_aix)===0){
      wx.showToast({
        title: '坐标单位不能为0',
        icon:'none',
        duration:2000
      })
      return 
    }
    var data={}
    var urlimg=''
    var data_req_item={
      stu_action:arr_str,
      legend:this.data.legend,
      linestyle:":"
    }
    var data_req=[data_req_item]
    if(whichbnt==2){
      data={
        data_req:data_req
      }
      urlimg='/del/rtchphoto'

    }else{
      data = {
        data_req:data_req,
        space:Number(this.data.space),
        lenght_aix:Number(this.data.lenght_aix),
        duration:Number(this.data.duration),
        grid:Number(this.data.grid)
      }
      urlimg='/del/multphotoes'
    }

    wx.request({
      url:serverurl+urlimg,
      method:'POST',
      data:data,
      success(res){
        wx.hideLoading()
        var data = res.data
          var imgdel = that.data.answerImg
          if(whichbnt==2){
            that.setData({
              answerImg:serverurl+data.data.imgurl,
              Rt:data.data.rtlist,
              Ch:data.data.chlist
            })
          }else{
            that.setData({
              answerImg:serverurl+data.data.imgurl
            })
          }
          if(res.statusCode==200){
            wx.showToast({
              title: '成功',
              icon:'success',
              duration: 2000
            })
          
          that.deletePhoto(imgdel)
          that.del_Teach_Model()

        }else if(res.statusCode==500){
          wx.hideLoading()
          wx.showToast({
            title: '服务器内部错误',
            icon:'none',
            duration: 2000
          })
        }else{
          wx.hideLoading()
          wx.showToast({
            title: '服务器内部错误',
            icon:'none',
            duration: 2000
          })
        }
        console.log(res)
      },
      fail(err){
        wx.hideLoading()
        wx.showToast({
          title: '请求错误',
          icon:'none',
          duration: 2000
        })
        console.log("err",err)
      }
    })
  },
  del_Teach_Model:function(){
    
    var len = this.data.Rt.length
    console.log("len",len)
    var t_r_clist = new Array(len)
    for(let i=0;i<len;i++){
      var data = this.del_Rt_Ch(this.data.Rt[i],this.data.Ch[i])
      console.log(data)
      t_r_clist[i]=data
    }
    this.setData({
      Teach_Model:t_r_clist
    })
  },
  
  del_Rt_Ch:function(rt,ch){
    rt = Number(rt)
    ch = Number(ch)
    if(rt<=parseFloat(0.3))return '练习型'
    if(rt>=parseFloat(0.7))return '讲授型'
    if(ch>=parseFloat(0.6))return '对话型'
    if(parseFloat(0.3)<rt&&rt<parseFloat(0.7)&&ch>parseFloat(0.2)&&ch<parseFloat(0.6))return '平衡型'
    if(parseFloat(0.3)<rt&&rt<parseFloat(0.7)&&ch<=parseFloat(0.2))return '板块型'
    
    return ' '
  },
  resetList:function () {
    
    this.setData({
      duration:0,
      space:0,
      data_req:[],
      data_test:[],
      input_time:0,
      showed:false,
      answerImg:"",
      grid:0,
      lenght_aix:0,
      Teach_Model:[],
      Rt:[],
      Ch:[]
    })
  },
  //预览图片
topic_preview: function(e){
  var that = this;
  var url = e.currentTarget.dataset.url;
  var previewImgArr = [url];
  wx.previewImage({
  current: url, // 当前显示图片的http链接
  urls: previewImgArr // 需要预览的图片http链接列表
  })
  },
  //下载文件
  downloadImg:function () {
      let that = this
  
  //判断用户是否授权"保存到相册"
  wx.getSetting({
   success (res) {
    //没有权限，发起授权
    if (!res.authSetting['scope.writePhotosAlbum']) {
     wx.authorize({
      scope: 'scope.writePhotosAlbum',
      success () {//用户允许授权，保存图片到相册
       that.saveImg();
      },
      fail () {//用户点击拒绝授权，跳转到设置页，引导用户授权
       wx.openSetting({
        success () {
         wx.authorize({
          scope: 'scope.writePhotosAlbum',
          success() {
           that.saveImg();
          }
         })
        }
       })
      }
     })
    } else {//用户已授权，保存到相册
     that.saveImg()
    }
   }
  })
  },
  saveImg:function () {
    let that = this
    wx.showLoading({
      title: '正在保存图片',
    })
    wx.downloadFile({
      url: that.data.answerImg,
      success:function(res){
        console.log(res)
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(res){
            wx.hideLoading()
            wx.showToast({
              title: '保存成功',
              icon:'success',
              duration:1000
            })
          },
          fail(err){
            wx.hideLoading()
            wx.showToast({
              title: '保存失败',
              icon:'none',
              duration:1000
            })
          }
        })
      }
      
    })
  },
  radioChange(e) {
    var items = this.data.grid_item
    for (let i = 0, len = items.length; i < len; i++) {
      items[i].checked = items[i].value == e.detail.value
    }
    this.setData({
      grid_item:items,
      grid:e.detail.value
    })
  },
  onUnload:function(){
    if(this.data.answerImg!=''){
      this.deletePhoto(this.data.answerImg)
    }
    
  },
  deletePhoto:function(e){
    var serverurl = app.serverUrl;
    var answerimg = e
    var target = '/img/'
    var start = answerimg.indexOf(target)
    var imgpath = answerimg.substring(start+target.length,answerimg.length)
    var url = serverurl+'/del/photo'
    wx.request({
      url: url,
      method:'DELETE',
      data:{
        answerImg:imgpath
      },
      success(res){
        console.log(res)
      },
      fail(err){
        console.log(err)
      }
    })
  }
})