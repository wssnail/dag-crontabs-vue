<template>
  <div class="app-container" id="newdag" >

    <el-dialog title="配置任务" :visible.sync="dialogFormVisible">
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false;resetForm('form')">取 消</el-button>
        <el-button v-if="createData" type="primary" @click="submitRoom('form','createData')">保 存</el-button>
        <el-button v-if="updateData" type="primary" @click="submitRoom('form','updateData')">更新</el-button>
      </div>
    </el-dialog>

    <el-row>
      <el-row>
        <el-col :span="12">
          <span>选择任务:</span>
          <el-select v-model="taskName" filterable placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-button type="primary" @click="submitForm('ruleForm')">加载任务</el-button>
          <el-button type="primary" @click="getTaskName();dialogFormVisible = true;">配置任务</el-button>
        </el-col>
      </el-row>
      <el-col :span="18">

        <div id="mountNode" ref="mountNode" style="height: 84vh" ></div>

      </el-col>
      <el-col :span="6">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" size="mini" label-position="left" label-width="90px" class="demo-ruleForm">
          <el-form-item label-width="0" style="text-align: center">
            <el-button type="primary" @click="submitForm('ruleForm')">新增节点</el-button>
            <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
            <el-button @click="resetForm('ruleForm')">删除</el-button>
          </el-form-item>
          <el-form-item label="原节点名" prop="oldname">
            <el-input placeholder="无" v-model="ruleForm.oldname" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="任务类型" prop="jobtype">
            <el-select v-model="ruleForm.jobtype" placeholder="请选择任务类型">
              <el-option label="常见命令" value="cmd"></el-option>
              <el-option label="Hive Job" value="hive"></el-option>
              <el-option label="Spark Job" value="spark"></el-option>
            </el-select>
          </el-form-item>

          <div v-if="ruleForm.jobtype == 'spark'">
            <v-hive :checkIdNames="checkIdName" ref="spark"></v-hive>
          </div>

          <el-form-item label="前置任务" prop="parentJob">
            <el-tooltip placement="top">
              <div slot="content">前置任务和后置任务，不能存在闭环<!--<br/>--></div>
              <el-select v-model="ruleForm.parentJob" placeholder="请选择前置任务">
                <el-option v-for="(parentJobItem,index) in ruleForm.parentJobArray" :key="index" :label="parentJobItem" :value="parentJobItem">
                </el-option>
              </el-select>
            </el-tooltip>
          </el-form-item>

          <el-form-item label="后置任务" prop="childrenJob">
            <el-tooltip placement="top">
              <div slot="content">前置任务和后置任务，不能存在闭环</div>
              <el-select v-model="ruleForm.childrenJob" placeholder="请选择后置任务">
                <el-option v-for="(parentJobItem,index) in ruleForm.parentJobArray" :key="index" :label="parentJobItem" :value="parentJobItem">
                </el-option>
              </el-select>
            </el-tooltip>
          </el-form-item>

        </el-form>
        <!--<el-input v-model="idName" @blur="checkIdName" placeholder="请输入节点名" ></el-input>-->
      </el-col>
    </el-row>


  </div>

</template>

<script>
  //plugin.tool.grid plugin.layout.dagre
  import G6 from '@antv/g6'
  import "@antv/g6/build/plugins"
  // import "@antv/g6/build/plugin.tool.grid"
  // import "@antv/g6/build/plugin.layout.dagre"

  // import "@antv/g6/build/"
  export default {
    name: 'minimap',
    data () {
      return {
        createData:false,
        updateData:false,
        dialogFormVisible: false,
        options:[{value:'none',label:'无'}],
        taskName:null,
        taskRules:{
          name:[
            {required: true,message: '必须输入任务名', trigger: 'blur'}
          ]
        },


        ruleForm: {
          jobtype: 'spark',
          parentJob:'无',
          oldname:'无',
          parentJobArray:['无'],
          childrenJob:'无',
          // childrenJobArray:[{'label':'无','value':'无'}],
          startNode:null,  //画线起始节点
          endNode:null,    //画线结束节点
          startNodeAllSource:{}, //找到起始节点的所有上个节点

        },
        rules: {
          jobtype: [
            {required: true,message: '请选择任务类型', trigger: 'blur'}
          ],
          parentJob:[
            {type:'parentJob', trigger: ['change','blur'],validator: this.jobChanged}
          ],
          childrenJob:[
            {type:'childrenJob', trigger: ['change','blur'],validator: this.jobChanged}
          ]

        },
        divWidth: null,//屏幕宽度
        graph: null,
        idName: null,
        parentToMeEdge:false,
        meToChildEdge:false,
        graphData: {
          nodes: [],
          edges: []
        }
      }
    },
    methods:{
      getTaskName(){
        if(this.taskName != "无"){
          this.taskForm.name = this.taskName
        }

      },
      checkIdName(rule, value,callback){
        if(this.checkItem(value)){
          callback(new Error(value + "节点已存在"))
        }else {
          this.getNodesToArray();
          callback()
        }
      },
      checkItem(id){
        var item = this.graph.find(id);
        return item
      },
      open2(level,msg) {
        var levelMsg = {'error':'错误','info':'提示','success':'成功','warning':'警告'};
        this.$confirm(msg, levelMsg[level], {
          confirmButtonText: '确定',
          // showCancelButton: false,
          type: level
        }).then(() => {
        }).catch(() => {
        });
      },
      getNodesToArray(){
        var nodes = this.graph.getNodes();
        for(let index in nodes){
          var id = nodes[index].id;
          if(this.ruleForm.parentJobArray.indexOf(id) == -1){
            this.ruleForm.parentJobArray.push(id)
          }
        }
        this.parentJob = '无';
        this.childrenJob = '无';
      },
      submitForm(formName){
        //判断是否允许保存
        var hiveForm = false;
        var hiveRuleForm = null;
        if(this.ruleForm.jobtype == 'spark'){
          [hiveForm,hiveRuleForm] = this.$refs.spark.getForm('hiveRuleForm');
          if (!hiveForm){
            return
          }
        }

        //当前组件的检查结果
        var curChecked = true;
        this.$refs[formName].validate((valid) => {
          if (!valid) {
            curChecked = false
          }
        });
        if(!curChecked){
          return
        }

        this.graph.add('node',{id:hiveRuleForm.name});
        // node.animate = false
        // graph.preventAnimate(callback);

        // this.graph.preventAnimate();

        //到这一步前边已经校验通过了，包括环判断，可以向下进行
        if(this.ruleForm.parentJob != "无"){
          var egdeId = this.ruleForm.parentJob + "-" + hiveRuleForm.name;
          this.graph.add('edge',{
            id:egdeId,
            source:this.ruleForm.parentJob,
            target:hiveRuleForm.name
          });
        }
        if(this.ruleForm.childrenJob != "无"){
          var egdeId = hiveRuleForm.name + "-" + this.ruleForm.childrenJob;
          this.graph.add('edge',{
            id: egdeId,
            source:hiveRuleForm.name,
            target:this.ruleForm.childrenJob
          })
        }
        //将绘制后的数据传递到后台



      },

      jobChanged(rule, value,callback){
        //rule type:'parentJob'
        //如果先选定tartget，则向下获取所有的子节点，从source中排除
        var beforNode = this.ruleForm.parentJob;
        var afterNode = this.ruleForm.childrenJob;
        console.log(beforNode + ":" + afterNode)
        if(beforNode == afterNode && beforNode!='无'){
          callback(new Error("前置任务与后置任务不能相同"))
        }else{
          if(beforNode != '无' && afterNode !='无'){
            //判断是否闭环
            if(!this.checkLoop(beforNode,afterNode)){
              callback(new Error("不能形成闭环"))
            }
          }else{
            callback()
          }
        }
      },
      graphDrag(x,y){
        //拖拽实现
        this.graph.translate(x, y);
      },
      getParent(node,sourceArray = []){
        var targetItem = null;
        var sourceItem = null;
        var curNodeAllEdges = node.getEdges();
        for(let index in curNodeAllEdges){
          targetItem = curNodeAllEdges[index].target;
          if(node.id == targetItem.id){
            sourceItem = curNodeAllEdges[index].source;
            sourceArray.push(sourceItem.id);
            this.getParent(sourceItem,sourceArray)
          }
        }
        return sourceArray
      },
      checkLoop(startId,endId){
        //判断是否闭环 false  true
        var startNode = this.graph.find(startId);
        var sourceArray = this.getParent(startNode);
        if(sourceArray.indexOf(endId) != -1){
          return false  //闭环
        }else{
          return true  //无闭环
        }
      }
    },
    mounted () {

      // 界面画图

      G6.registerNode('rect', {
        getPath: function getPath(item) {
          var width = 100; // 一半宽
          var height = 30; // 一半高
          return G6.Util.getRectPath(-width / 2, -height / 2, width, height, 10);
        }
      });

      this.graph = new G6.Graph({
        container: 'mountNode',
        // width:5000,
        // height: this.$refs.newDagGraph.offsetWidth,
        fitView: 'tl',
        modes: {
          default: ['panBlank', 'wheelZoom']
        },
        // plugins:[new G6.Plugins['tool.grid']],
        plugins: [new G6.Plugins['layout.dagre'](
          {rankdir:'LR',nodesep:20,ranksep:20,grid:{
              cell: 10
            }}
        ),
          new G6.Plugins['tool.grid']()], //template.maxSpanningForest
        grid:{
          cell: 10
        },
        // animate:true,
        defaultIntersectBox: 'rect' // 使用矩形包围盒
      });

      this.graph.edge({
        style: {
          endArrow: true
        }
      });

      this.graph.node({
        shape: 'rect',
        label: function label(model) {
          return model.id;
        },
        style: {
          stroke: '#00C0A5',
          fill: '#92949F',
          fillOpacity: 0.45,
          lineWidth: 2
        }
      });
      // alert(this.$refs.mountNode.clientWidth);
      this.graph.read(this.graphData);
      //点击node
      this.graph.on('node:click',
        (ev)=>{
          // console.log(ev.shape.id);
        });
      //对node和edge进行右键删除
      this.graph.on('contextmenu', (ev)=>{

      });
      // //划线起始
      this.graph.on('dragstart',
        (ev)=>{
          this.startNode = null;
          this.endNode = null;
          if(ev.item != null){
            this.startNode = ev.shape.id;
          }
        });

      //划线结束
      this.graph.on('dragend',
        (ev)=>{
          if(ev.item){
            this.endNode = ev.shape.id;
            if(this.startNode != null && this.startNode != this.endNode){
              //如果是起点向下是不会出现闭环的  A->B->C  从A开始画是不会出现闭环
              //终点向下只需要找到迭代的父节点就不会闭环   a->b>c 从c开始画是需要c的结束节点不出现在父节点即可
              //如果是中间节点只需要判断所有的父节点不是endNode即可  a->b->c 从b开始，只要b的结束节点不出现在b的父节点即可
              if(this.checkLoop(this.startNode,this.endNode)){
                if(!this.checkItem(this.startNode + "-" + this.endNode) && !this.checkItem(this.endNode + "-" + this.startNode)){
                  //当两种查找方式都不存在的时候才创建edge
                  this.graph.add('edge',{
                    id:this.startNode + "-" + this.endNode,
                    source:this.startNode,
                    target:this.endNode
                  });
                }
              }else{
                this.open2("error","不允许存在闭环");
              }
            }
          }
        });
      // //拖拽
      // this.graph.on('drag',
      //   (ev)=>{
      //     // console.log(ev.domEvent.movementX,ev.domEvent.movementY);
      //     if(this.startNode == null){
      //       this.graphDrag(ev.domEvent.movementX,ev.domEvent.movementY)
      //     }
      //   });
    },

  }

</script>

<style scoped>

  .el-form-item .el-select{
    width: 100%;
  }
</style>
