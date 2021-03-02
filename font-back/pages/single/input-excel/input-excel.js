
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
    Teach_Model:[],
    duration:0,//课程时长
    space:0,//采样间隔
    lenght_aix:0,//坐标单位
    showed:true,//显示生成图像按键
    file_url:'',//上传的文件路径
    grid:0,//格线
    legend:'',
    file:{
      name:'',
      size:0,
      time:'',
      path:''
    },
    file_show:true,
    answerImg:'',
    Rt:[],
    Ch:[],
    Rt_Ch_List:[]
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
    }
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
    }
  },
  lenght_aixchange:function (e) {
    console.log(e)

    this.setData({
      lenght_aix:e.detail.value
    })
  },
  uploadFile:function(){
    var that = this
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      success (res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFiles

        var file={
          name:tempFilePaths[0].name,
          size:tempFilePaths[0].size,
          time:tempFilePaths[0].time,
          path:tempFilePaths[0].path
        }
        that.setData({
          file:file,
          file_show:false
        })
        console.log(res)
      }
    })
  },
  openActionsheet:function(){
    var that=this
    wx.showActionSheet({
      itemList: ["打开","删除"],
      itemColor: '#007aff',
      success(res){
        var index = res.tapIndex
        console.log(index)
        if(index==0){
          console.log("filepath",that.data.file)
          wx.openDocument({
            filePath: that.data.file.path,
            success: function (res) {
              console.log('打开文档成功')
            }
          })
        }
        else if(index==1){
          that.setData({
            file:{},
            file_show:true,
            answerImg:'',
          })
        }
      }
    })
  },
  legend_change:function(e){
    this.setData({
      legend:e.detail.value
    })
    console.log(this.data.legend)
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
  judgeDat:function(){
    var space=Number(this.data.space)
    if(space==0){
      wx.hideLoading()
      wx.showToast({
        title: '采样间隔不能为0',
        icon:'none',
        duration:2000
      })
      return false
    }
    var lenght_aix=Number(this.data.lenght_aix)
    if(lenght_aix<=0){
      wx.hideLoading()
      wx.showToast({
        title: '坐标单位不能<=0',
        icon:'none',
        duration:2000
      })
      return false
    }
    var duration=Number(this.data.duration)
    if(duration==0){
      wx.hideLoading()
      wx.showToast({
        title: '课程时长不能为0',
        icon:'none',
        duration:2000
      })
      return false
    }
    var grid=Number(this.data.grid)
    if(grid==-1){
      wx.hideLoading()
      wx.showToast({
        title: '格线不能为空',
        icon:'none',
        duration:2000
      })
      return false
    }
    var legend=this.data.legend
    if(legend==''){
      wx.hideLoading()
      wx.showToast({
        title: '课例名称不能为空',
        icon:'none',
        duration:2000
      })
      return false
    }
    let file = this.data.file
    if(file.path==''){
      wx.hideLoading()
      wx.showToast({
        title: '文件不能为空',
        icon:'none',
        duration:2000
      })
      return false
    }
    return true
  },

  makePhoto:function (e) {
    var whichbnt = e.currentTarget.dataset.idx
    console.log(whichbnt)
    wx.showLoading({
      title: '加载中',
    })
    if(!this.judgeDat()){
      return
    }
    var that=this
    var serverurl = app.serverUrl;
    var urlimg=''
    if(whichbnt==2){
      urlimg='/del/rtch/excel'
    }else{
      urlimg='/del/st/excel'
    }
    wx.uploadFile({
      filePath: that.data.file.path,
      name: 'file',
      url: serverurl+urlimg,
      formData:{
        space:Number(this.data.space),
        lenght_aix:Number(this.data.lenght_aix),
        duration:Number(this.data.duration),
        grid:Number(this.data.grid),
        legend:this.data.legend,
      },
      success(res){
        wx.hideLoading()
        if(res.statusCode==200){
          var data = JSON.parse(res.data)
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
          that.deletePhoto(imgdel)
          that.del_Teach_Model()
          wx.showToast({
            title: '成功',
            icon:'success',
            duration:2000
          })
          console.log(data)
        }else if(res.statusCode==500){
          wx.showToast({
            title: '服务器错误',
            icon:'none',
            duration:2000
          })
        }
      },
      fail(err){
        wx.hideLoading()
        wx.showToast({
          title: '请求超时',
          icon:'none',
          duration:2000
        })
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
  resetList:function(){
    this.setData({
      Teach_Model:[],
      duration:0,//课程时长
      space:0,//采样间隔
      lenght_aix:0,//坐标单位
      showed:true,//显示生成图像按键
      file_url:'',//上传的文件路径
      grid:0,//格线
      legend:'',
      file:{
        name:'',
        size:0,
        time:'',
        path:''
      },
      file_show:true,
      answerImg:'',
      Rt:[],
      Ch:[],
      Rt_Ch_List:[]
    })
  },
  
    //预览图片
topic_preview: function(e){
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
      console.log(imgpath)
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