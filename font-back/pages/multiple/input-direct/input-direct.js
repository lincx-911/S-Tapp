// pages/input-direct/single/single.js



const app=getApp()
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
      {value: 1, name: '有格线',checked:false},
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
    Teach_Model:[],
    class_num:0,
    duration:0,
    space:0,
    data_req:[],
    class_info:[],
    showed:false,
    shownum:5,
    lenght_aix:0,
    answerImg:"",
    grid:0,
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
    res_arr[index].show=true
    
    var total = Math.ceil((Number(e.detail.value)*60)/this.data.space)
    var req_arr = new Array(total)
    var arr_time = new Array(total)
    var sp = Number(this.data.space)
    for(var i=0;i<total;i++){
      req_arr[i]=' '
      arr_time[i]=this.secondFormat(sp*(i+1))
    }
    res_arr[index].req = req_arr
    res_arr[index].arr_time=arr_time
    res_arr[index].data_test.length=total
    res_arr[index].up=!res_arr[index].up
    this.setData({
      class_info:res_arr
    })
    
    console.log(this.data.class_info)
  },
  spachange:function (e) {
    console.log(e)

    this.setData({
      space:e.detail.value
    })
    
    if(this.data.class_info.length>0){
      var classes = this.data.class_info
      var classlen = classes.length
      for(var i =0;i<classlen;i++){
        if(classes[i].duration!=0){
          var total = Math.ceil((Number(classes[i].duration)*60)/this.data.space)
          var arr_len = classes[i].req.length
          if(arr_len>total){
            classes[i].req=classes.req.slice(0,total)
            classes[i].arr_time = classes[i].arr_time.slice(0,total)
            classes[i].data_test.length=total
          }
          else if(arr_len<total){

            for(var j=arr_len;j<total;j++){
              classes[i].req.push(' ')
              classes[i].arr_time.push(this.secondFormat(this.data.space*(j+1)))
            }
            classes[i].data_test.length=total
          }
        }
      }
      this.setData({
        class_info:classes
      })

    }
  },
  lenght_aixchange:function (e) {
    console.log(e)

    this.setData({
      lenght_aix:e.detail.value
    })
  },
  type_change:function(e){
    
  },

  bindPickerChange_hx: function (e) {
    console.log("hx",e);
    var value = Number(e.detail.value)
    var idx = e.currentTarget.dataset.index
    var cidx = e.currentTarget.dataset.cindex
    var arr = this.data.class_info
    arr[cidx].req[idx]=this.data.pic_array[value].name
    this.setData({
      class_info:arr
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
          show:false,
          req:[],//课程代码列表
          arr_time:[],//课程时刻
          data_test:[],
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
    if(this.data.class_info.length>0){
      var classes = this.data.class_info
      var classlen = classes.length
      for(var i =0;i<classlen;i++){
        if(classes[i].duration!=0){
          var total = Math.ceil((Number(classes[i].duration)*60)/this.data.space)
          var arr_len = classes[i].req.length
          if(arr_len>total){
            classes[i].req=classes[i].req.slice(0,total)
            classes[i].arr_time.length
            var sp = Number(this.data.space)
            for(var j=0;j<total;j++){
              classes[i].arr_time[j]=this.secondFormat(sp*(j+1))
            }
            classes[i].data_test.length=total
          }
          else if(arr_len<total){

            for(var j=arr_len;j<total;j++){
              classes[i].req.push(' ')
            }
            var sp = Number(this.data.space)
            classes[i].arr_time.length
            for(var j=0;j<total;j++){
              classes[i].arr_time[j]=this.secondFormat(sp*(j+1))
            }
            classes[i].data_test.length=total
          }
        }
      }
      this.setData({
        class_info:classes
      })
    }
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
  changeUp:function (e) {
    console.log("up",e)
    var idx = e.currentTarget.dataset.idx
    var classes = this.data.class_info
    var class_idx = this.data.class_info[idx]
  
    var num = 0;
    var shownum=this.data.shownum;
    if(class_idx.up==true){
      if(shownum>class_idx.req.length){
        shownum=class_idx.req.length
      }
      num=shownum
    }else{
    num=class_idx.req.length
    }
    classes[idx].data_test.length=num
    classes[idx].up=!classes[idx].up
    this.setData({
      class_info:classes
    })
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
        return false
      }
      if(classes[i].type==''){
        return false
      }
      for(var j=0;j<req_len;j++){
        if(i!=j&&classes[index].type==classes[j].type){
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
        stu_action : classes[i].req.join(''),
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
  
  makePhoto:function (e) {
    console.log(e)
    var whichbnt = e.currentTarget.dataset.idx
    if(!this.checkData()){
      wx.showToast({
        title: '存在空白处',
        icon:'none',
        duration:2000,
      })
      return
    }
    wx.showLoading({
      title: '加载中',
    })
    var that=this
    var serverurl = app.serverUrl;
    var arr = this.data.data_req
    if(Number(this.data.lenght_aix)<=0){
      wx.showToast({
        title: '坐标单位不能为<=0',
        icon:'none',
        duration:2000
      })
      return 
    }
    var data={}
    var urlimg = ""
    if(whichbnt==2){
      data={
        data_req:this.data.data_req
      }
      urlimg='/del/rtchphoto'

    }else{
      data = {
        data_req:this.data.data_req,
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
          wx.showToast({
            title: '服务器内部错误',
            icon:'none',
            duration: 2000
          })
        }else{
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
        show:false,
        req:[],//课程代码列表
        arr_time:[],//课程时刻
        data_test:[],
        up:false
      }
      res[i]=data
    }
    this.setData({
      class_info:res
    })
    console.log(res)
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