const app=getApp()

const Multipart = require('../../../utils/Multipart.min.js')

Page({

  data: {
    class_array:[
      {id: 2, name: '2'},
      {id: 3, name: '3'},
      {id: 4, name: '4'},

    ],
    space_array:[
      {id: 15, name: '15'},
      {id: 30, name: '30'},
      {id: 45, name: '45'},
      {id: 60, name: '60'},
    ],
    grid_item:[
      {value: 0, name: '无格线', checked: true},
      {value: 1, name: '有格线', checked: false},
    ],
    pic_array: [
      { id: 0, name: ' '},
      { id: 1, name: 'S' },
      { id: 2, name: 'T' },
      { id: 3, name: 'D' },
    ],
    d_a_types:[
      { id: '-', name: '实线'},
      { id: '--', name: '短线' },
      { id: '-.', name: '短点相间线' },
      { id: ':', name: '虚点线' },
    ],
    Teach_Model:[
    ],
    class_num:0,
    duration:0,
    space:0,
    data_req:[],
    class_info:[],
    showed:false,
    lenght_aix:0,
    answerImg:"",
    grid:0,
    answerImg:'',
    Rt:[],
    Ch:[]
  },
  classchange:function(e){
    if(e.detail.value<0){
      wx.showToast({
        title: '课程数量不能为0',
      })
      return
    }
    this.setData({
      class_num:e.detail.value
    })
    if(this.data.class_num>0){
      var arr = new Array(this.data.class_num)
      for(var i=0;i<arr.length;i++){
        arr[i]=0
      }
      this.setData({
        
        showed:true
      })
    }
  },
  
  duration_change:function(e){
    console.log(e)
    if(this.data.space==0){
      wx.showToast({
        title: '采样间隔不能为0',
        icon:"none",
        duration:2000
      })
      return
    }
    if(!this.isNumber(e.detail.value)){
      wx.showToast({
        title: '请输入数字',
        icon:"none",
        duration:2000
      })
      return
    }
    
    var index = e.target.dataset.index
    var res_arr = this.data.class_info
    res_arr[index].duration = e.detail.value
    this.setData({
      class_info:res_arr
    })
    
    console.log(this.data.class_info)
  },
  lenght_aixchange:function (e) {
    console.log(e)

    this.setData({
      lenght_aix:e.detail.value
    })
  },
  bindPickerChange_class:function(e){
    this.setData({   //给变量赋值
      class_num: this.data.class_array[Number(e.detail.value)].id,
      showed:true
    })

    var classes = this.data.class_info
    if(classes.length==0){
      this.initTimeAction()
      return
    }
    if(classes.length<this.data.class_num){
      var arr_len = classes.length
      for(var i=arr_len;i<this.data.class_num;i++){
        var data={
          type:this.data.d_a_types[i].id,
          typename:this.data.d_a_types[i].name,
          legend:"",
          duration:"",
          file_show:true,
          file:{}
        }
        classes.push(data)
      }
      this.setData({
        class_info:classes
      })
    }else if(classes.length>this.data.class_num){
      classes=classes.slice(0,this.data.class_num)
      this.setData({
        class_info:classes
      })
    }
      
  },
  bindPickerChange_space:function(e){
    console.log('picker发送选择改变，携带值为', e);
    this.setData({   //给变量赋值
      space: this.data.space_array[Number(e.detail.value)].id
    })
  },
  bindPickerChange_type:function(e){
    console.log("type",e)
    var index = e.currentTarget.dataset.index
    var value = Number(e.detail.value)
    var res_arr = this.data.class_info
    for(var i=0;i<res_arr.length;i++){
      if(i!=index&&this.data.d_a_types[value].id==res_arr[i].type){
        wx.showToast({
          icon:"none",
          title: '该类型已被选择,请重新选择',
          duration:2000
        })
        return
      }
    }
    res_arr[index].type = this.data.d_a_types[value].id
    res_arr[index].typename = this.data.d_a_types[value].name

    this.setData({
      class_info:res_arr
    })
    console.log(this.data.class_info)
  },

  checkData:function () {
    var classes = this.data.class_info
    var max_dur = 0
    var data_req=[]
    for(var i=0;i<classes.length;i++){
      var req_len = classes[i].length
      if(max_dur<Number(classes[i].duration)){
        max_dur=Number(classes[i].duration)
      }
      if(classes[i].legend==''){
        wx.hideLoading()
        wx.showToast({
          title: '课例不能为空',
          icon:'none',
          duration:2000
        })
        return false
      }
      if(classes[i].type==''){
        wx.hideLoading()
        wx.showToast({
          title: '类型不能为空',
          icon:'none',
          duration:2000
        })
        return false
      }
      if(classes[i].file.path==undefined){
        wx.hideLoading()
        wx.showToast({
          title: '文件未全部上传',
          icon:'none',
          duration:2000,
        })
        return false
      }
      for(var j=0;j<req_len;j++){
        if(i!=j&&classes[index].type==classes[j].type){
          wx.hideLoading()

          wx.showToast({
            icon:"none",
            title: '课程的线条类型不能相同',
            duration:2000
          })
          return false
        }
        if(classes[i].req[j]==' '){
          return false
        }
      }
      var data = {
        legend:classes[i].legend,
        linestyle:classes[i].type
      }
      data_req.push(data)
    }
    this.setData({
      data_req:data_req,
      duration:max_dur
    })
    return true
  },
  judgeExcel:function(e){
    
  },
  uploadFile:function(e){
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
        var index = e.currentTarget.dataset.idx
        var classes = that.data.class_info
        classes[index].file=file
        classes[index].file_show=false
        that.setData({
          class_info:classes
        })
        console.log(res)
      }
    })
  },
  openActionsheet:function(e){
    var that=this
    wx.showActionSheet({
      itemList: ["打开","删除"],
      itemColor: '#007aff',
      success(res){
        var index = res.tapIndex
        console.log(index)
        var idx = e.currentTarget.dataset.idx
        var classes = that.data.class_info
        if(index==0){
          console.log("filepath",that.data.file)
          wx.openDocument({
            filePath: classes[idx].file.path,
            success: function (res) {
              console.log('打开文档成功')
            }
          })
        }
        else if(index==1){
          classes[idx].file={}
          classes[idx].file_show=true
          that.setData({
            class_info:classes,
            answerImg:''
          })
        }
      }
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
    if(!this.checkData()){
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
    var data={}
    var legends= []
    var linestyles = []
    var data_req = that.data.data_req
    for(var i= 0;i<data_req.length;i++){
      legends.push(data_req[i].legend)
      linestyles.push(data_req[i].linestyle)
    }

    if(whichbnt==2){
      urlimg='/del/rtch/multiple_excel'
      data={
        legends:legends
      }
    }else{
      urlimg='/del/st/multiple_execl'
      data = {
        legends:legends,
        linestyles:linestyles,
        space:Number(this.data.space),
        lenght_aix:Number(this.data.lenght_aix),
        duration:Number(this.data.duration),
        grid:Number(this.data.grid)
      }
    }
    var class_info =  that.data.class_info
    var files = new Array(that.data.class_num)
    
    let fields = Object.keys(data).map(key => ({
			name: key,
			value: data[key]
    }))
    console.log(fields)
    for(var i=0;i<files.length;i++){
      var file = {
        filePath:class_info[i].file.path,//文件路径 必须要有的
        filename:class_info[i].file.name,//文件名称 后台要不要？
        name: 'file',//字段名
      }
      files[i]=file
    }
    console.log("files:",files)
    new Multipart({
			files,
			fields
		}).submit(serverurl+urlimg).then(
      (res) => {
        console.log(res)
        wx.hideLoading()
        if(res.statusCode==200){
          var data = res.data
          var imgdel = that.data.answerImg
          console.log(data)
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
          wx.showToast({
            title: '成功',
            icon:'success',
            duration:2000
          })
          that.deletePhoto(imgdel)
          that.del_Teach_Model()
        }else if(res.statusCode==500){
          wx.showToast({
            title: '服务器错误',
            icon:'none',
            duration:2000
          })
        }
      },
      (err) => {
        console.log(err)
        wx.hideLoading()
        wx.showToast({
          title: '请求超时',
          icon:'none',
          duration:2000
        })
      }
    )

  },
  del_Teach_Model:function(){
    
    var len = this.data.Rt.length
    console.log("len",len)
    var t_r_clist = new Array(len)
    for(let i=0;i<len;i++){
      var data = {
        model:this.del_Rt_Ch(this.data.Rt[i],this.data.Ch[i]),
        legend:this.data.class_info[i].legend
      }
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
      class_num:0,
      duration:0,
      space:0,
      durations:[],
      class_info:[],
      data_req:[],
      input_time:0,
      showed:false,
      lenght_aix:0,
      answerImg:"",
      grid:0,
      Rt:[],
      Ch:[],
      Teach_Model:[
      ],
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
  initTimeAction:function(){
    let num = this.data.class_num
    var res=new Array(num);
    for(var i=0;i<num;i++){
      //每个课程的信息
      var data={
        type:this.data.d_a_types[i].id,
        typename:this.data.d_a_types[i].name,
        legend:"",
        duration:"",
        file_show:true,
        file:{}
      }
      res[i]=data
    }
    this.setData({
      class_info:res
    })
  },
  legend_change:function(e){

    var index = e.target.dataset.index
    var res_arr = this.data.class_info
    res_arr[index].legend = e.detail.value
    this.setData({
      class_info:res_arr
    })
    console.log(this.data.class_info)
  },
  isNumber:function(val) {
    　　if (parseFloat(val).toString() == "NaN") {
    　　　　
    　　　　return false;
    　　} else {
    　　　　return true;
    　　}
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