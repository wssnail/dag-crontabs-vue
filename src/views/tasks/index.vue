<template>
  <div class="app-container">
    <el-dialog center width="70%" title="设置任务运行方式(Crontab模式存在则以Crontab方式运行)" :visible.sync="dialogFormVisible" top="0">
      <el-row type="flex" justify="center">
        <el-form :model="taskForm" size="small" ref="taskForm" label-position="left" label-width="140px">

          <el-form-item label="任务ID">
            <el-col :span="18">
              <el-input v-model="taskForm.id" disabled></el-input>
            </el-col>
          </el-form-item>

          <el-form-item label="任务名称" prop="name">
            <el-col :span="18">
              <el-input v-model="taskForm.name"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="时间间隔模式" prop="interval">
            <el-col :span="12">
              <el-input v-model="taskForm.every"></el-input>
            </el-col>
            <el-col :span="6">
              <el-select v-model="taskForm.interval" placeholder="时间">
                <el-option
                  v-for="item in intervals"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="Crontab定时模式" prop="dayOfWeek">
            <el-col :span="18">
              <el-select v-model="taskForm.crontab" placeholder="定时">
                <el-option
                  v-for="item in crontabs"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="数组类型参数" prop="args">
            <el-col :span="18">
              <el-input v-model="taskForm.args"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="Key-Value类型参数" prop="kwargs">
            <el-col :span="18">
              <el-input v-model="taskForm.kwargs"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="队列(运行节点)" >
            <el-col :span="18">
              <el-select v-model="taskForm.queue" placeholder="队列">
                <el-option
                  v-for="item in queues"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="优先级(0-255)" prop="level">
            <el-col :span="18">
              <el-input v-model="taskForm.level" placeholder="数字越小等级越高"></el-input>
            </el-col>
          </el-form-item>

        </el-form>

      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false;resetForm('taskForm')">取 消</el-button>
        <el-button type="primary" @click="submitRoom('taskForm','createData')">保 存</el-button>
        <!--<el-button type="primary" @click="submitRoom('taskForm','updateData')">更新</el-button>-->
      </div>
    </el-dialog>
    <div calss="task-button">
      <el-button @click="addTask();dialogFormVisible = true;">新增Crontab任务</el-button>
      <el-button @click="startTask()">启动任务</el-button>
      <el-button @click="closeTask()">停止任务</el-button>
      <el-button @click="dialogFormVisible = true;">关联任务流</el-button>
    </div>
    <template>
      <el-table
        ref="multipleTable"
        :data="tableData5"
        border
        style="width: 100%"
        size="mini"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="expand" width="20" fixed >
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="商品名称">
                <span>{{ props.row.name }}</span>
              </el-form-item>
              <el-form-item label="所属店铺">
                <span>{{ props.row.shop }}</span>
              </el-form-item>
              <el-form-item label="商品 ID">
                <span>{{ props.row.id }}</span>
              </el-form-item>
              <el-form-item label="店铺 ID">
                <span>{{ props.row.shopId }}</span>
              </el-form-item>
              <el-form-item label="商品分类">
                <span>{{ props.row.category }}</span>
              </el-form-item>
              <el-form-item label="店铺地址">
                <span>{{ props.row.address }}</span>
              </el-form-item>
              <el-form-item label="商品描述">
                <span>{{ props.row.desc }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          type="selection"
          width="35"
          fixed
        >
        </el-table-column>
        <el-table-column
          v-for="{ prop, label,width,fixed } in colConfigs"
          :key="prop"
          :prop="prop"
          :label="label"
          :width="width"
          :fixed="fixed"
          :show-overflow-tooltip="true">
          <template slot-scope="scope">
            {{prop === 'enabled'? (scope.row[prop] === true?'已启动':'未启动')
            :(prop === 'status'? (scope.row[prop] === ''?'未运行':scope.row[prop])
            :(prop === 'taskid'? (scope.row[prop] === ''?'未绑定任务流':scope.row[prop])
            :(scope.row[prop])))
            }}
          </template>

        </el-table-column>

        <el-table-column
          label="类型"
          width="150"
          prop="task">

        </el-table-column>
        <el-table-column prop="status" label='进度条' width="100">
          <template slot-scope="scope">
            <el-progress :percentage="100" :stroke-width="18" status="text">test</el-progress>
          </template>
        </el-table-column>
        <el-table-column
          label="数据时间"
          width="150"
          prop="desc">
        </el-table-column>
        <el-table-column
          label="用时"
          width="150"
          prop="desc">
        </el-table-column>
        <el-table-column
          label="进度"
          width="150"
          prop="desc">
        </el-table-column>
        <el-table-column
          label="应用"
          width="150"
          prop="desc">
        </el-table-column>

      </el-table>
    </template>

  </div>
</template>

<script>
  import { Message, MessageBox } from 'element-ui'
  import {Crontabs} from "../../api/crontabs";
  import {getWoker} from "../../api/woker";
  import {Tasks} from "../../api/tasks";

  export default {
    name: "AllTasks",
    data() {
      return {
        //start 新增任务的弹窗
        dialogFormVisible:false,
        colConfigs :[
          { prop: 'name', label: '任务名',width:150,fixed:true },
          { prop: 'enabled', label:'是否启动', width:80,fixed:true},
          { prop: 'status', label:'状态', width:80,fixed:true},
          { prop: 'id', label: '任务ID',width:60,fixed:false },
          { prop: 'taskid', label: '任务流名称',width:150,fixed:true },
          // { prop: 'taskid', label: '上一次的执行ID',width:150 },
          { prop: 'run_time', label:'上一次开始运行时间', width:140,},
          { prop: 'date_done', label:'上一次运行结束时间', width:140,},
          { prop: 'start_time', label:'创建时间', width:140,},
        ],
        taskForm: {
          id:'系统生成',
          name: '',
          every:'',
          interval: '',
          crontab: '',
          args: '[]',
          kwargs: '{}',
          queue: '',
          level:'',
        },
        intervals:[
          {'value':'','label':''},
          {'value':'seconds','label':'秒'},
          {'value':'minutes','label':'分钟'},
          {'value':'hours','label':'小时'},
          {'value':'days','label':'天'}
        ],
        crontabs:[
          {'value':'','label':''}
        ],
        queues:[

        ],
        //end 新增任务的弹窗
        tableData5: [],
        multipleSelection: []
      }
    },
    methods:{
      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      requestChange(){
        this.startTask().then((res) => {
          // Message({
          //   // message: error.message,
          //   dangerouslyUseHTMLString: true,
          //   message: "启动成功：" + seccessStart + "<br/>启动失败：" + failStart + "<br/>无需重新启动：" + areadyStart,
          //   type: 'success',
          //   duration: 5 * 1000
          // });
          console.log(res)
        },(error) =>{

        });
      },
      startTask(){

        var datas = [];
        for(let index in this.multipleSelection){
          var task = this.multipleSelection[index];
          if(!task.enabled){
            datas.push({'id':task.id,'enabled':true})
          }
        }
        // task.name,task.id
        Tasks("put",datas).then(
          (res) => {
            var id_updated = res.data.id_updated;
            for(let index in this.multipleSelection){
              var task = this.multipleSelection[index];
              if(id_updated.indexOf(task.name) >= 0){
                task.enabled = true;
              }
            }
            Message({
              // message: error.message,
              dangerouslyUseHTMLString: true,
              message: "启动成功：" + id_updated,
              type: 'success',
              duration: 5 * 1000
            });
            // console.log(res.data.id_updated);
          },
          (error) => {
            // failStart.push(task.name)
          }
        );
      },
      closeTask(){
        var datas = [];
        for(let index in this.multipleSelection){
          var task = this.multipleSelection[index];
          if(task.enabled){
            datas.push({'id':task.id,'enabled':false})
          }
        }
        Tasks("put",datas).then(
          (res) => {
            var id_updated = res.data.id_updated;
            for(let index in this.multipleSelection){
              var task = this.multipleSelection[index];
              if(id_updated.indexOf(task.name) >= 0){
                task.enabled = false;
              }
            }
            Message({
              // message: error.message,
              dangerouslyUseHTMLString: true,
              message: "关闭成功：" + id_updated,
              type: 'success',
              duration: 5 * 1000
            });
            // console.log(res.data.id_updated);
          },
          (error) => {
            // failStart.push(task.name)
          }
        );
      },
      addTask(){
        //从数据库获取定时
        Crontabs('get',{'path':'index'}).then(response => {
          var responseData = response.data;
          // console.log(responseData);
          for(let index in responseData){
            var currentData = responseData[index];
            var crontabSelect = {'value':currentData.id,'label':currentData.crontab + "-" + currentData.username};
            this.crontabs.push(crontabSelect);
            // debugger;
          }
        });
        //从celery获取woker节点
        getWoker().then(response => {
          var responseData = response.data;
          // console.log(responseData);
          var dict = {};
          for(let keys in responseData){

            dict[responseData[keys][0].name] = 0;
          }
          for(let key in dict){
            var queueSelect = {'value': key,'label': key};
            this.queues.push(queueSelect)
          }
        });
      },
      submitRoom(val,type){
        var data = this.taskForm;
        Tasks('post',data).then(response => {
          // console.log(response.data);
          Message({
            // message: error.message,
            message: response.data.msg,
            type: 'success',
            duration: 5 * 1000
          });
          this.dialogFormVisible = false;
          var datas = response.data.task;
          // this.tableData5 = datas;
          // console.log(datas)
          this.tableData5.unshift(datas)
        }).catch(error => {
          console.log(error)
        });

        // console.log(this.taskForm)
      },
      resetForm(val) {

        // console.log(this.oldForm);
        this.$refs[val].resetFields();
        this.taskForm = {
            id:'系统生成',
            name: '',
            every:'',
            interval: '',
            crontab: '',
            args: '[]',
            kwargs: '{}',
            queue: '',
            level:'',
        }
      }
    },
    mounted() {
      //获取定时信息
      Tasks('get').then(response => {
        var datas = response.data;
        this.tableData5 = datas;

        // console.log(this.tableData5)
      });



      // this.$axios({
      //   method: "get",
      //   url:"crontabs/"
      // }).then((response) => {
      //   //把token存储到store
      //   // console.log(response.data);
      //   var responseData = response.data;
      //   for(let index in responseData){
      //     var currentData = responseData[index];
      //     var crontabSelect = {'value':currentData.id,'label':currentData.crontab + "-" + currentData.username};
      //     this.crontabs.push(crontabSelect);
      //     // debugger;
      //   }
      //
      // }).catch((error) => {
      // });


      // this.$axios({
      //   method: "get",
      //   url:"celeryworker/"
      // }).then((response) => {
      //   //把token存储到store
      //   // console.log(response.data);
      //
      //   var responseData = response.data;
      //   console.log(responseData);
      //   var dict = {};
      //   for(let keys in responseData){
      //
      //     dict[responseData[keys][0].name] = 0;
      //   }
      //   for(let key in dict){
      //     var queueSelect = {'value': key,'label': key};
      //     this.queues.push(queueSelect)
      //   }
      // }).catch((error) => {
      // });
    }
  }
</script>

<style scoped>


  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-left:0;
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
  .el-form-item .el-select{
    width: 100%;
  }
  .el-table{
    margin-top: 10px;
  }

</style>
