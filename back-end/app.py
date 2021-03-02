from flask import Flask,request,json,jsonify
import time
import xlrd
import os
import sys
import matplotlib.pyplot as plt
from matplotlib.pyplot import MultipleLocator
sys.setrecursionlimit(100000)
# 支持中文
plt.rcParams['font.sans-serif'] = ['SimHei']  # 用来正常显示中文标签
plt.rcParams['axes.unicode_minus'] = False  # 用来正常显示负号

app=Flask(__name__,static_folder='statics', static_url_path='/img')

icon=['o','^','+',',']

systemname = ''

@app.route("/del/photo",methods=['DELETE'])
def getPhotoSTHandle():
    req_data  = request.get_data()
    print("data%s"%req_data)
    json_data =  json.loads(req_data.decode('utf-8'))
    strlist = json_data.get('answerImg')
    deleteFile(strlist)

    return jsonify({'code':0,'msg':'Success','data':''})

def deleteFile(strlist):
    pathlist = strlist.split('/')
    spiltstr = "/"
    if systemname=='win32':
        spiltstr='\\'
    project_path = os.path.dirname(os.path.realpath('__file__'))+spiltstr+'statics'

    for item in pathlist:
        project_path=project_path+spiltstr+item
    print(project_path)
    if os.path.exists(project_path):
        os.remove(project_path) 

@app.route("/del/multphotoes",methods=['POST'])# s-t 手动输入
def getMultiPhotoST():
    req_data  = request.get_data()
    json_data =  json.loads(req_data.decode('utf-8'))
    strlist = json_data.get('data_req')
    stu_act,legends,linestyles=del_date_req(strlist)
    space = json_data.get('space')
    lenght_axi=json_data.get('lenght_aix')
    duration = json_data.get('duration')
    grid=json_data.get('grid')

    imgurl=mutliple_photo(stu_act,space,lenght_axi,duration,grid,legends,linestyles)

    data={'imgurl':'/img/'+imgurl}
    return jsonify({'code':0,'msg':'Success','data':data})

@app.route("/del/rtchphoto",methods=['POST'])# rh-ch 手动输入
def getRtPhoto():
    req_data  = request.get_data()
    json_data =  json.loads(req_data.decode('utf-8'))
    strlist = json_data.get('data_req')
    stu_act,legends,_=del_date_req(strlist)
    imgurl,rt_list,ch_list=Rt_Ch(stu_act,legends)
    data={'imgurl':'/img/'+imgurl,'rtlist':rt_list,'chlist':ch_list}
    return jsonify({'code':0,'msg':'Success','data':data})

@app.route("/del/rtch/excel",methods=['POST'])# rt-ch excel 单文件
def getrtExcel():
    header = request.headers
    print("header:",header)
    data_info = request.form.to_dict()
    file = request.files['file']
    f = file.read()
    data = xlrd.open_workbook(file_contents=f)
    table = data.sheets()[0]
    stu_a=excel_to_list(table)
    stu_act=[stu_a]
    legends = [data_info['legend']]
    imgurl,rt_list,ch_list=Rt_Ch(stu_act,legends)
    print(rt_list)
    print(ch_list)
    data={'imgurl':'/img/'+imgurl,'rtlist':rt_list,'chlist':ch_list}
    print(data)
    return jsonify({'code':0,'msg':'Success','data':data})

@app.route("/del/rtch/multiple_excel",methods=['POST'])# rt-ch excel 多文件
def getrtMultipleExcel():
    data_info = request.form.to_dict()
    files = request.files.getlist('file')
    legends = data_info['legends'].split(',')
    stu_act = excels_list(files)
    imgurl,rt_list,ch_list=Rt_Ch(stu_act,legends)
    print(rt_list)
    print(ch_list)
    data={"imgurl":"/img/"+imgurl,"rtlist":rt_list,"chlist":ch_list}

    return jsonify({'code':0,'msg':'Success','data':data})

@app.route("/del/st/multiple_execl",methods=['POST'])# s-t excel 多文件
def getMultipleFile():
    data_info = request.form.to_dict()
    files = request.files.getlist('file')
    legends = data_info['legends'].split(',')
    linestyles = data_info['linestyles'].split(',')
    space = int(data_info['space'])
    lenght_axi= int(data_info['lenght_aix'])
    duration = int(data_info['duration'])
    grid= int(data_info['grid'])
    stu_act = excels_list(files)
    imgurl=mutliple_photo(stu_act,space,lenght_axi,duration,grid,legends,linestyles)
    data={'imgurl':'/img/'+imgurl}
    return jsonify({'code':0,'msg':'Success','data':data})



@app.route("/del/st/excel",methods=['POST'])#s-t excel 单文件
def getExcel():
    data_info = request.form.to_dict()
    file = request.files['file']
    f = file.read()
    data = xlrd.open_workbook(file_contents=f)
    table = data.sheets()[0]
    stu_a=excel_to_list(table)
    stu_act=[stu_a]
    space = int(data_info['space'])
    lenght_axi= int(data_info['lenght_aix'])
    duration = int(data_info['duration'])
    grid= int(data_info['grid'])
    legends = [data_info['legend']]
    linestyles = ['-'] 
    imgurl=mutliple_photo(stu_act,space,lenght_axi,duration,grid,legends,linestyles)
    data={'imgurl':'/img/'+imgurl}
    return jsonify({'code':0,'msg':'Success','data':data})

@app.errorhandler(404)
def handle_404_error(err):
    """
    自定义的处理错误方法
    :return:
    """
    #这个函数的返回值会是前端用户看到的最终结果
    return "出现了404错误，错误信息：%s" % err
@app.errorhandler(500)
def handle_505_error(err):
    """
    自定义的处理错误方法
    :return:
    """
    #这个函数的返回值会是前端用户看到的最终结果
    return "出现了500错误，错误信息：%s" % err


def excels_list(files):
    stu_acts = []
    print(len(files))
    for item in files:
        f = item.read()
        data = xlrd.open_workbook(file_contents=f)
        table = data.sheets()[0]
        stu_a=excel_to_list(table)
        stu_acts.append(stu_a)
    return stu_acts

def excel_to_list(table):
    nrows = table.nrows  # 获取该sheet中的有效行数
    strlist=[]
    for i in range(nrows):
        strlist+=table.row_values(i)
    
    return strlist

def count_Rtch(req_list):
    rt_sum=0
    ch_sum=0
    for index in range(len(req_list)):
        if req_list[index] == 'T':
            rt_sum+=1
        elif req_list[index] == 'D':
            rt_sum+=0.5
        if index!=0 and req_list[index-1]!=req_list[index]:
            ch_sum+=1
    rt = rt_sum/len(req_list)
    ch = ch_sum/len(req_list)
    return rt,ch
        

def Rt_Ch(stu_act,legends):
    print("legends:",legends)
    lenght_axi=0.1
    x_major_locator=MultipleLocator(lenght_axi)
    y_major_locator=MultipleLocator(lenght_axi)
    ax=plt.gca()
    ax.xaxis.set_major_locator(x_major_locator)
    ax.yaxis.set_major_locator(y_major_locator)
    plt.xlim(0, 1)
    plt.ylim(0,1)
    line(0,0,0.5,1)
    line(0.5,1,1,0)
    line(0.3,0,0.3,0.6)
    line(0.7,0,0.7,0.6)
    line(0.3,0.6,0.7,0.6)
    line(0.3,0.2,0.7,0.2)
    rt_list=[]
    ch_list=[]
    imgurl="Rt_Ch"+str(int(time.time()))+".png"
    plt.grid()
    for index in range (len(stu_act)):
        rt,ch=count_Rtch(stu_act[index])
        x=[rt]
        y=[ch]
        rt_list.append(round(rt,2))
        ch_list.append(round(ch,2))
        plt.scatter(x,y,label=legends[index],c='k',marker=icon[index])
    plt.xlabel('Rt')
    plt.ylabel('Ch',rotation='horizontal')
    plt.legend()
    plt.savefig("./statics/rt-ch/"+imgurl)
    plt.cla()
    return 'rt-ch/'+imgurl,rt_list,ch_list

def line(x1,y1,x2,y2):    
    x = [x1,x2]    
    y = [y1,y2]
    plt.plot(x, y,color="k")
    

def del_date_req(strlist):
    stu_acts=[]
    legends=[]
    linestyles=[]
    for item in strlist:
        stu_acts.append(item['stu_action'])
        legends.append(item['legend'])
        linestyles.append(item['linestyle'])
    return stu_acts,legends,linestyles

def mutliple_photo(data,space,lenght_axi,duration,grid,label,style):
    x_major_locator=MultipleLocator(lenght_axi)
    y_major_locator=MultipleLocator(lenght_axi)
    ax=plt.gca()
    ax.xaxis.set_major_locator(x_major_locator)
    ax.yaxis.set_major_locator(y_major_locator)
    for index in range (len(data)):
        x,y=str_to_list(data[index],space)
        plt.plot(x,y,color='black',label=label[index],linestyle=style[index])
    if grid==1:
        plt.grid()
    plt.xlim(0,duration)
    plt.ylim(0,duration)
  
    plt.xlabel('T')
    plt.ylabel('S',rotation='horizontal')
    plt.legend()
    imgurl=str(int(time.time()))+".png"
    plt.savefig("./statics/s-t/"+imgurl)
    plt.cla()
    return 's-t/'+imgurl

def draw_photo(data,space,lenght_axi,duration,title,grid):
    x_major_locator=MultipleLocator(lenght_axi)
    y_major_locator=MultipleLocator(lenght_axi)
    ax=plt.gca()
    ax.xaxis.set_major_locator(x_major_locator)
    ax.yaxis.set_major_locator(y_major_locator)
    x,y=str_to_list(data,space)
    if grid==1:
        plt.grid()
    plt.xlim(0,duration)
    plt.ylim(0,duration)
    plt.title(title)
    plt.xlabel('T')
    plt.ylabel('S',rotation='horizontal')
    plt.plot(x,y)
    imgurl=title+str(int(time.time()))+".png"
    plt.savefig("./statics/"+imgurl)
    plt.cla()
    return 's-t/'+imgurl
    

def str_to_list(req_str,space):
    space/=60
    t_num = 0
    s_num = 0
    t_list=[0]
    s_list=[0]
    for s in req_str:
        if s=='T':
            t_num+=space
        elif s=='S':
            s_num+=space
        else:
            s_num+=space
            t_num+=space
        t_list.append(t_num)
        s_list.append(s_num)
    return t_list,s_list

if __name__ == "__main__":
    
    systemname = sys.platform
    app.run(host="10.242.221.122",port=8087,debug=False)