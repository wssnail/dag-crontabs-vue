<template>
  <div class="app-container">
    <el-button @click="dialogFormVisible = true;">新增Crontab</el-button>
    <el-dialog center width="70%" title="定时设置（参考Linux Crontab的配置方式）" :visible.sync="dialogFormVisible" top="0">
      <el-row type="flex" justify="center">
        <el-form :model="taskForm" size="small" ref="form" label-position="left" label-width="140px">

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
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitRoom('form','createData')">保 存</el-button>
        <el-button type="primary" @click="submitRoom('form','updateData')">更新</el-button>
      </div>
    </el-dialog>
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
          label="任务ID"
          width="150"
          prop="id">
        </el-table-column>
        <el-table-column
          label="执行ID"
          width="150"
          prop="name">
        </el-table-column>
        <el-table-column
          label="任务名"
          fixed
          prop="desc"
          width="150"
        >
        </el-table-column>
        <el-table-column
          label="状态"
          fixed
          width="150"
          prop="desc">
        </el-table-column>
        <el-table-column
          label="类型"
          width="150"
          prop="desc">
        </el-table-column>
        <el-table-column
          label="调度时间"
          width="150"
          prop="desc">
        </el-table-column>
        <el-table-column
          label="数据时间"
          width="150"
          prop="desc">
        </el-table-column>
        <el-table-column
          label="开始时间"
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
  import {Crontabs} from "../../api/crontabs";
  import {getWoker} from "../../api/woker";

  export default {
    name: "AllTasks",
    data() {
      return {
        //start 新增任务的弹窗
        dialogFormVisible:false,
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
          {'value':'SECONDS','label':'秒'},
          {'value':'MINUTES','label':'分钟'},
          {'value':'HOURS','label':'小时'},
          {'value':'DAYS','label':'天'}
        ],
        crontabs:[
          {'value':'','label':''}
        ],
        queues:[

        ],
        //end 新增任务的弹窗
        tableData5: [{
          id: '12987122',
          name: '好滋好味鸡蛋仔',
          category: '江浙小吃、小吃零食',
          desc: '荷兰优质淡奶，奶香浓而不腻',
          address: '上海市普陀区真北路',
          shop: '王小虎夫妻店',
          shopId: '10333'
        }, {
          id: '12987123',
          name: '好滋好味鸡蛋仔',
          category: '江浙小吃、小吃零食',
          desc: '荷兰优质淡奶，奶香浓而不腻',
          address: '上海市普陀区真北路',
          shop: '王小虎夫妻店',
          shopId: '10333'
        }, {
          id: '12987125',
          name: '好滋好味鸡蛋仔',
          category: '江浙小吃、小吃零食',
          desc: '荷兰优质淡奶，奶香浓而不腻',
          address: '上海市普陀区真北路',
          shop: '王小虎夫妻店',
          shopId: '10333'
        }, {
          id: '12987126',
          name: '好滋好味鸡蛋仔',
          category: '江浙小吃、小吃零食',
          desc: '荷兰优质淡奶，奶香浓而不腻',
          address: '上海市普陀区真北路',
          shop: '王小虎夫妻店',
          shopId: '10333'
        }],
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
      }
    },
    mounted() {
      //获取定时信息

      Crontabs('get').then(response => {
        var responseData = response.data;
        console.log(responseData);
        for(let index in responseData){
          var currentData = responseData[index];
          var crontabSelect = {'value':currentData.id,'label':currentData.crontab + "-" + currentData.username};
          this.crontabs.push(crontabSelect);
          // debugger;
        }
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


      getWoker().then(response => {
        var responseData = response.data;
        console.log(responseData);
        var dict = {};
        for(let keys in responseData){

          dict[responseData[keys][0].name] = 0;
        }
        for(let key in dict){
          var queueSelect = {'value': key,'label': key};
          this.queues.push(queueSelect)
        }
      });

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

</style>
