let head_all = document.querySelector('head');
class trueOfFlase {
    
    constructor() {
    }
}
/*author ：刘洌铒(liulieer)【眼：注册单选按钮组】
* time : 2022/6/1
* 功能（function） : 注册单选按钮组/注销单选按钮
* 原型1：addRadioGroup(节点集合变量,'样式1','样式2',【true|false】,函数变量)
*原型2：addRadioGroup（buttons，'selStyle','noSelStyle',true.fn）
*原型3：addRadioGroup（节点集合变量,'选中按钮的样式class名','未选中按钮的样式class名','是否保留原来的样式【默认保留】',事件处理函数的变量）
*注意事项：
*1.一般js添加设置样式是慢于css的，所以刚加载时会延迟载入选中和未选中的功能
*2.我们将往事件处理函数中传入一个实参event，该实参代表触发的事件源
*3.调用event事件源时，event新增两个可调用的属性：event.group_Id 和 event.group_Button_Id，其中前者记录所在组位于存储集合中的下标，后者记录在本组中，位于所在节点集合的下标，调用者可通过这两个属性获得事件源的组编号和按钮在本组中的编号，需要注意的是，这两个编号都是从0开始的；
以下是测试实例：
<style>
        div{width: 50px;height: 50px;background-color: aqua;border: 1px solid black;float: left;}
        .sel{background-color: black;}
        .no{background-color: blue;}
    </style>
</head>
<body>
    <div id="button">
        <div>1</div>
        <div>2</div>
        <div>3</div>
    </div>
    <div id="button2">
        <div>12</div>
        <div>22</div>
        <div>32</div>
    </div>
</body>
<script src="../js/all.js"></script>
<script>
    // ================================
    const button_box = document.getElementById('button')
    const button_box2 = document.getElementById('button2')
    const buttons = button_box.children;
    const buttons2 = button_box2.children;
    
    function A(){
        console.log('我被调用啦' + event.group_Id);
    }
    addRadioGroup(buttons,'sel','no',false,A);
    
    function B(event){
        console.log(event.group_Id+'cccc');
    }
    addRadioGroup(buttons2,'sel','no',false,B)
</script>
*/
class addRadioGroup_Object{//单选按钮组数据存储对象
    static group_Index = 0;//当前组数
    static addRadioGroup_nodeList = new Array();//单选按钮-组-集合
    static addRadioGroup_functinonList = new Array();//事件处理函数集合
    static up_click_time = new Array();//上一次点击的时间
    static getGroupIndex(nodeListFirst){//传入节点，找到组在集合中的下标，该函数较耗资源，影响性能，已被event.group_Id属性代替，此处保留的作用为以防万一
        for(let i = 0; i < this.addRadioGroup_nodeList.length;i++){
            // console.log(this.addRadioGroup_nodeList[i][0]);
            for(let i2 = 0; i2 < this.addRadioGroup_nodeList[i].length;i2++){
                if(this.addRadioGroup_nodeList[i][i2]==nodeListFirst.target ){
                    return i;
                }
            }
        }
        return -1;
    }
    constructor(){

    }
}
function addRadioGroup(nodes,selStyleStr,noStyleStr,retain = true,fn,intervalTime){
    let group_Index = addRadioGroup_Object.group_Index;
    if (selStyleStr == undefined) {//如果没有传入样式，则添加并使用初始样式
        head_all.innerHTML += '<style>.addRadioGroupselStyleStr{background-image: linear-gradient(45deg,blue,red);!important;}.addRadioGroupnoStyleStr{background-color: #fff!important;}</style>'
        noStyleStr = 'addRadioGroupnoStyleStr'
        selStyleStr = 'addRadioGroupselStyleStr'
        console.log('您没有传入选中和未选中的样式名，于是为您选择了默认样式以便您调试');
    }
    if(selStyleStr.indexOf('.') != -1){
        selStyleStr = selStyleStr.replace('.','');
    } 
    if(noStyleStr.indexOf('.') != -1){
        noStyleStr = noStyleStr.replace('.','');
    }
    addRadioGroup_Object.addRadioGroup_functinonList.push(fn);
    addRadioGroup_Object.up_click_time.push(0);
    if(retain){//如果选择保留
        let no = new Array();
        let yes = new Array();
        for(let i = 0; i < nodes.length; i++){
            let name = nodes[i].className;
            if(name.indexOf(noStyleStr) != -1){
                name = name.replace(noStyleStr,'')
            }
            if(name.indexOf(selStyleStr) != -1){
                name = name.replace(selStyleStr,'') 
            }
            no.push(name + ' ' + String(noStyleStr));
            yes.push(name + ' ' + String(selStyleStr));
            let setAddRadioGroupEventFn
            // console.log(nodes[i]);
            nodes[i].addEventListener('click',setAddRadioGroupEventFn = function(event){
                event.group_Id = group_Index//记录所在组位于存储集合中的下标
                event.group_Button_Id = i;//记录在本组中，位于所在节点集合的
                if(intervalTime && Date.now() - addRadioGroup_Object.up_click_time[event.group_Id] < intervalTime){
                    console.log('您点击太快了');
                    return;
                }
                let addRadioGroup_functinonListTemp = addRadioGroup_Object.addRadioGroup_functinonList[group_Index];
                if(addRadioGroup_functinonListTemp != undefined){
                    addRadioGroup_functinonListTemp(event);//启用事件处理函数
                }
                for(let n = 0; n < nodes.length; n++){
                    nodes[n].className = no[n]//未选中
                }
                nodes[i].className = yes[i];//选中
                if(intervalTime){addRadioGroup_Object.up_click_time[event.group_Id] = Date.now()}
            })
            // AddRadioGroupEventFnNames.push(String(nodes[i]));
            setAddRadioGroupEventFns.push(setAddRadioGroupEventFn);
        }
    }else{
        for(let i = 0; i < nodes.length; i++){
            let setAddRadioGroupEventFn
            nodes[i].addEventListener('click',setAddRadioGroupEventFn = function(event){
                if(!event.group_Button_Id){
                    event.group_Id = group_Index//记录所在组位于存储集合中的下标
                    event.group_Button_Id = i;//记录在本组中，位于所在节点集合的
                }
                let addRadioGroup_functinonListTemp = addRadioGroup_Object.addRadioGroup_functinonList[group_Index];
                if(addRadioGroup_functinonListTemp != undefined){
                    addRadioGroup_functinonListTemp(event);//启用事件处理函数
                }
                for(let n = 0; n < nodes.length;n++){
                    nodes[n].className = noStyleStr;
                }
                nodes[i].className = selStyleStr;
            })
            // AddRadioGroupEventFnNames.push(String(nodes[i]));
            setAddRadioGroupEventFns.push(setAddRadioGroupEventFn);
        }
    }
    addRadioGroup_Object.addRadioGroup_nodeList.push(nodes);
    addRadioGroup_Object.group_Index++;
}
let RadioGroupDedicatedFunction;//专用函数变量
// let AddRadioGroupEventFnNames = new Array();
let setAddRadioGroupEventFns = new Array();
/*【注销按钮组】函数暂不可用，后继更新
function removeRadioGroup(nodes){//注销注册的按钮【注意，该功能不完整，只能注销第一个注册的按钮组，以后有时间再进行完善】
    for (let i = 0; i < nodes.length;i++){
        nodes[i].removeEventListener('click',setAddRadioGroupEventFns[i]);
    }
}
*/

/* author ：刘洌铒(liulieer)【眼：注册轮播选项组】
* time : 2022/6/11
* 功能 （function）: 轮播选项组
*原型：addCarouselGroup（参与轮播的元素集合，上一个的按钮节点，下一个的按钮节点,参与轮播的元素父节点，是否循环【默认为循环】,事件处理函数,第一个元素的left值，两个相邻元素之间left值的差，在页面中显示的元素个数，数值单位【默认为px】）
*该方法将往事件处理函数中传入两个实参oldIndex、nextIndex，其中第一个参数表示正在消失的元素位于节点集合中的下标，，第二个参数表示正在出现的元素位于节点集合中的下标，调用者可通过接收这两个参数来得知正在出现和正在消失的元素
*注意事项：
*1.传入参数中参与轮播的节点集合最好具有left属性，如果没有，则所有轮播图之间的间隙为0,且父容器节点需要有超出隐藏的属性！
*前四个参数是必须值，是否循环和事件处理函数是可选项，如果需要更换数值的单位，则需要传入最后的四个数值！默认的数值单位为px
*2.该方法只实现横向轮播
*3.解决过渡效果问题，增加传入显示的元素个数的参数，把出现过渡不自然的头尾元素放到显示的外面
*测试实例：
      <style>
        *{transition: all 1s;}
        #S{width: 350px;height: 100px; left: 200px;border: 1px solid blue;position: relative;}
        .a{width: 40px;height: 40px;float: left;position: absolute; margin-left: 10px;background-color: #000;}
        .b{width: 50px; height: 50px;position: absolute;background-color: aqua;}
        #b1{left: 10px;}
        #b2{left: 700px;}

        #x{top: 50px; width: 350px;height: 100px; left: 300px;border: 1px solid blue;position: relative;}
        .x{width: 40px;height: 40px;float: left;position: absolute; margin-left: 10px;background-color: #000;}
        #b3{margin-top: 100px;}
        #b4{margin-top: 100px;left: 200px;}
    </style>
</head>

<body>
   <div id="S">
        <div class="a" style="left: 0px;"></div>
        <div class="a" style="left: 60px;"></div>
        <div class="a" style="left: 120px;"></div>
        <div class="a" style="left: 180px;"></div>
        <div class="a" style="left: 240px;"></div>
        <div class="a" style="left: 300px;"></div>
        <div class="a" style="left: 360px;"></div>
        <div class="a" style="left: 420px;"></div>
        <div class="a" style="left: 480px;"></div>
   </div>
   <div id="b1" class="b"></div>
   <div id="b2" class="b"></div>
   <div id="x">
    <div class="x" style="left: 0px;"></div>
    <div class="x" style="left: 60px;"></div>
    <div class="x" style="left: 120px;"></div>
    <div class="x" style="left: 180px;"></div>
    <div class="x" style="left: 240px;"></div>
    <div class="x" style="left: 300px;"></div>
    <div class="x" style="left: 360px;"></div>
</div>
<div id="b3" class="b"></div>
<div id="b4" class="b"></div>
</body>
<script src="./js/all.js"></script>
<script>
    let s = document.getElementById('S');
    let as = document.getElementsByClassName('a');
    let b1 = document.getElementById('b1');
    let b2 = document.getElementById('b2');
    // console.log(getComputedStyle(as[1]).left);
    // console.log(s.clientWidth);
    //通过getComputedStyle方法可以用来获取DOM元素实际显示时的样式
    let x = document.getElementById('x');
    let cs = document.getElementsByClassName('x');
    let b3 = document.getElementById('b3');
    let b4 = document.getElementById('b4');

    let fn  = function(a,b){
        console.log('我被调用了；'+ a + '正在消失；' + b + '正在出现');
    }
    let fn2 = function(a,b){
        console.log('嗯'+ a + '正在消失；' + b + '正在出现');
    }
    addCarouselGroup(as,b1,b2,s,true,fn)
    addCarouselGroup(cs,b3,b4,x,true,fn2);
*/
let addCarouselGroup_Object = {//数据存储对象
    group_Id : 0,//组编号，记录一共有多少组
    left_Index_Group : new Array(),//各组中【目前】位于最左边的元素在节点集合中的下标
    console_Length_Group : new Array(),//各组中一次需要操作的元素个数
    coordGroup_Group : new Array(),//各组中所有显示的方块的坐标组
    box_Cha_Group : new Array(),//各组中每个方块的距离（以最左的边来计算）
    Group_Fn : new Array(),//各组中点击时调用的方法
}
function addCarouselGroup(nodes,lastButon,nextButton,fathreNode,isLoop=true,Fn,startLeft=undefined,cha=undefined,length=undefined,unit='px'){
    
    // 数据处理
    let group_Id = addCarouselGroup_Object.group_Id;
    // let length = addCarouselGroup_Object.
    addCarouselGroup_Object.Group_Fn.push(Fn);

    if(getComputedStyle(fathreNode).position != 'relative' && getComputedStyle(fathreNode).position != 'absolute'){
        fathreNode.style.position = 'relative'//为父容器加定位属性，子元素的绝对定位才不会是相对文档流
    }
    let leftStr = getComputedStyle(nodes[0]).left;
    startLeft = startLeft ? startLeft : parseInt(leftStr);//最左元素的left值
    cha = cha ? cha : undefined;
    if(!cha){
        if(typeof(startLeft) != 'number'){
            cha = nodes[0].offsetWidth;
        }else if(!cha){
            cha = -(startLeft - parseInt(getComputedStyle(nodes[1]).left))
        }
    }
    addCarouselGroup_Object.box_Cha_Group.push(cha);//每个方块的距离（以最左的边来计算）
    length = length ? length+1 : parseInt(fathreNode.clientWidth/cha)+2
    addCarouselGroup_Object.console_Length_Group.push(length);//一次需要操作的元素个数
    addCarouselGroup_Object.left_Index_Group.push(0);//目前位于最左边的元素在节点集合中的下标
    let coordGroup = new Array()//所有显示的方块的坐标组
    for(let i = 0; i < length;i++){
        coordGroup.push(startLeft + cha*i);
    }

    // 事件处理
    addCarouselGroup_Object.coordGroup_Group.push(coordGroup);
    nextButton.addEventListener('click',function(event){//下一个
        if(!event.CarouselGroup_Id){//组编号跟随事件
            event.CarouselGroup_Id = group_Id;
        }
        let group_Id2 = event.CarouselGroup_Id;
        let oldIndex = addCarouselGroup_Object.left_Index_Group[group_Id2];//消失方块的位于集合中的下标;
        if(!isLoop && oldIndex + length > nodes.length){//如果不需要循环，则检查是否可以被点击
            return;
        }
        if(addCarouselGroup_Object.Group_Fn[event.CarouselGroup_Id]){
            let nextIndex = (addCarouselGroup_Object.left_Index_Group[group_Id2] + addCarouselGroup_Object.console_Length_Group[group_Id2] - 1)%nodes.length;//新出现的方块位于集合中的下标
            addCarouselGroup_Object.Group_Fn[event.CarouselGroup_Id](oldIndex,nextIndex);//把消失的方块下标和新出现的方块下标作为参数传入
        }
        // console.log('组：'+ event.CarouselGroup_Id + '  ' +group_Id);
        let x = oldIndex;//在节点集合中的指针
        for(let i = 0; i < length;i++){//操作需要操作的所有节点
            if(x == nodes.length){
                x = 0;
            }
            // console.log(addCarouselGroup_Object.coordGroup_Group[group_Id2][i] - addCarouselGroup_Object.box_Cha_Group[group_Id2] )
            if(i == 0){
                nodes[x].style.left = addCarouselGroup_Object.coordGroup_Group[group_Id2][i] - addCarouselGroup_Object.box_Cha_Group[group_Id2] + unit;
            }else{
                nodes[x].style.left = addCarouselGroup_Object.coordGroup_Group[group_Id2][i-1] + unit;
            }
            x++;
        }
        addCarouselGroup_Object.left_Index_Group[group_Id2]++
        if(addCarouselGroup_Object.left_Index_Group[group_Id2] >= nodes.length){
            addCarouselGroup_Object.left_Index_Group[group_Id2] = 0
        }
    });
    lastButon.addEventListener('click',function(event){//上一个
        if(!event.CarouselGroup_Id){//组编号跟随事件
            event.CarouselGroup_Id = group_Id;
        }
        let group_Id2 = event.CarouselGroup_Id;
        let nextIndex =  addCarouselGroup_Object.left_Index_Group[group_Id2];//新出现方块的位于集合中的下标;
        if(!isLoop && addCarouselGroup_Object.left_Index_Group[group_Id2] == 0){//如果不需要循环，则检查是否可以被点击
            return;
        }
        let oldIndex = (addCarouselGroup_Object.left_Index_Group[group_Id2] + length - 1) % nodes.length-1//消失的方块在集合中的下标
        if(oldIndex == -1){oldIndex = nodes.length-1}
        if(addCarouselGroup_Object.Group_Fn[event.CarouselGroup_Id]){
            let nextIndex = oldIndex >= length-1 ? oldIndex - length +1: nodes.length + oldIndex - length +1;//新出现的方块位于集合中的下标
            addCarouselGroup_Object.Group_Fn[event.CarouselGroup_Id](oldIndex,nextIndex);//把消失的方块下标和新出现的方块下标作为参数传入
        }
        let x = oldIndex//指针
        for(let i = length-1;i >= 0;i--){
            if(x <= -1){
                x = nodes.length-1;
            }
            if(i == length-1){
                nodes[x].style.left = addCarouselGroup_Object.coordGroup_Group[group_Id2][i] + addCarouselGroup_Object.box_Cha_Group[group_Id2] + unit;
            }else{
                nodes[x].style.left = addCarouselGroup_Object.coordGroup_Group[group_Id2][i] + unit
            }
            x--;
        }
        addCarouselGroup_Object.left_Index_Group[group_Id2]--;
        if(addCarouselGroup_Object.left_Index_Group[group_Id2] < 0){
            addCarouselGroup_Object.left_Index_Group[group_Id2] = nodes.length-1
        }
    });
    addCarouselGroup_Object.group_Id++;//记录组
}

// author ：
// time : 2022/5/31 
// 功能 （function）: 阻塞线程运行
//原型：无返回值 stop（毫秒数值）
function stop(time){//线程阻塞
    let oldTime = Date.now();
    let newTime;
    while (true){
        newTime = Date.now();
        if(newTime - oldTime == time) break;
    }
}