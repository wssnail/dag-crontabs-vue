<template>
  <div id="home" class="app-container">
    <el-button @click="dialogFormVisible = true;createData = true">新增Crontab</el-button>

    <el-dialog title="定时设置（参考Linux Crontab的配置方式）" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" size="small" ref="form" label-position="left" label-width="150px" >

        <el-form-item label="" size="mini" label-width="0px">
          <el-col :span="13">
            <el-tag type="info">*/1表示每分钟一次,1表示每小时的1分钟：09:01 10:01</el-tag>
          </el-col>
          <el-col :span="11">
            <el-tag type="info">可以先在Linux中测试成功后再添加到系统中</el-tag>
          </el-col>
        </el-form-item>
        <el-form-item label="ID" v-show="false">
          <el-col :span="12">
            <el-input v-model="form.id"></el-input>
          </el-col>
        </el-form-item>

        <el-form-item label="分(Minute)" prop="minute">
          <el-col :span="12">
            <el-input v-model="form.minute"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="时(Hour)" prop="hour">
          <el-col :span="12">
            <el-input v-model="form.hour"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="天(Day of week)" prop="dayOfWeek">
          <el-col :span="12">
            <el-input v-model="form.dayOfWeek"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="天(Day of month)" prop="dayOfMonth">
          <el-col :span="12">
            <el-input v-model="form.dayOfMonth"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="月(Month of year)" prop="monthOfYear">
          <el-col :span="12">
            <el-input v-model="form.monthOfYear"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="时区(Timezone)" >
          <el-col :span="12">
            <el-input v-model="form.timezone" disabled></el-input>
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false;resetForm('form')">取 消</el-button>
        <el-button v-if="createData" type="primary" @click="submitRoom('form','createData')">保 存</el-button>
        <el-button v-if="updateData" type="primary" @click="submitRoom('form','updateData')">更新</el-button>
      </div>
    </el-dialog>

    <el-button @click="clearFilter">清除所有过滤器</el-button>
    <el-table
      ref="filterTable"
      :data="tableData"
      size="mini"
      style="width: 100%">
      <el-table-column
        prop="id"
        label="ID"
        width="180">
      </el-table-column>
      <el-table-column
        prop="crontab"
        label="Crontab定时">
      </el-table-column>
      <el-table-column
        prop="username"
        label="创建用户"
        width="180"
        :filters="[{ text: 'root', value: 'root' }, { text: username, value: username }]"
        :filter-method="filterTag"
        filter-placement="bottom-end">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.username === 'root' ? 'primary' : 'success'"
            disable-transitions>{{scope.row.username}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="180">
        <template slot-scope="scope">
          <!--<el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>-->
          <el-button type="text" size="small" @click="handleClick(scope.row);
            dialogFormVisible = true;updateData = true" :disabled="scope.row.username != username">编辑</el-button>
          <!--<el-button @click="deleteRow(scope.$index,tableData,scope.row)" type="text" size="small" :disabled="scope.row.username != username">移除</el-button>-->
          <el-popover
            :ref="scope.row.id"
            placement="top"
            width="200"
            trigger="click"
          >
            <p>以下任务将被同时删除：</p>
            <p v-if="scope.row.tasks && scope.row.tasks.length > 0">{{scope.row.tasks.join(" , ")}}</p>
            <p v-else>无</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="cancelInput(scope.row.id)">取消</el-button>
              <el-button type="danger" size="mini" @click="cancelInput(scope.row.id);deleteRow(scope.$index,tableData,scope.row)">确定</el-button>
            </div>
            <el-button slot="reference"  type="text" size="small" :disabled="scope.row.username != username">删除</el-button>
          </el-popover>
        </template>

      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { Crontabs } from "@/api/crontabs";
  export default {
    name: "Crontab",
    data(){
      return {
        // visible2:false,
        createData:false,
        updateData:false,
        username: null,
        tableData: null,
        dialogTableVisible: false,
        dialogFormVisible: false,
        oldForm:null,
        form: {
          id:'',
          minute: '*',
          hour: '*',
          dayOfWeek: '*',
          dayOfMonth: '*',
          monthOfYear: '*',
          timezone: 'Asia/Shanghai',
          tasks:null,
        },
        rules: {
          minute: [
            {required: true, message: 'Minute 必填', trigger: 'blur'},
            {trigger: 'blur',validator: this.submitData}
          ],
          hour: [
            {required: true, message: 'Hour 必填', trigger: 'blur'}
          ],
          dayOfWeek: [
            {required: true, message: 'Day of week 必填', trigger: 'blur'}
          ],
          dayOfMonth: [
            {required: true, message: 'Day of month 必填', trigger: 'blur'}
          ],
          monthOfYear: [
            {required: true, message: 'Month of year 必填', trigger: 'blur'},
          ]
        }
      }
    },
    methods:{
      cancelInput (id){
        // 关闭删除框
        this.$refs[id].doClose();
      },
      deleteRow(index, rows, row) {
        rows.splice(index, 1);
        let id = row.id;
        Crontabs('delete',{'id':id}).then(response => {
          let data = response.data;
          this.open(data.msg)
        });
        // this.$axios({
        //   method: 'delete',
        //   url: 'crontabs/',
        //   data:{'id':id},
        // }).then((response) => {
        //   //把token存储到store
        //   let data = response.data;
        //   this.open(data.msg)
        // }).catch((error) => {
        // });
      },
      submitRoom(val,type){
        console.log(this.form);
        let validateResult = this.getFormData(val);
        if(validateResult.valid){
          // 向表中新增数据
          let method = 'post';
          if(type == 'updateData'){
            method = 'put'
          }
          Crontabs(method,this.form).then(response => {
              //把token存储到store
              let data = response.data;
              // console.log(data)
              let tableData = data.crontab_json;
              if(method === 'post'){
                if(data.created){
                  this.tableData.unshift(tableData);
                  // this.tableData.sort(this.compare('id'))
                }else{
                  this.open("数据已存在，无法创建！")
                }
                // this.resetForm(val)
              }else if(method === 'put'){
                if(data.updated){
                  this.tableData = this.tableData.filter(t => t.id != this.form['id']);
                  this.tableData.unshift(tableData);
                  // this.tableData.sort(this.compare('id'))
                }else{
                  this.open("数据已存在，无法更新！")
                }
                // this.resetForm(val)
              }
              this.resetForm(val)
          });
          this.createData = false;
          this.updateData = false;
          this.dialogFormVisible = false;
          // this.resetForm(val)
        }
      },
      //数组对象排序
      compare(attr) {
        return function(a,b){
          var val1 = a[attr];
          var val2 = b[attr];
          return val2 - val1;
        }
      },
      resetForm(val) {
        this.createData=false;
        this.updateData=false;
        // console.log(this.oldForm);
        this.$refs[val].resetFields();
        this.form = {
          id:'',
          minute: '*',
          hour: '*',
          dayOfWeek: '*',
          dayOfMonth: '*',
          monthOfYear: '*',
          timezone: 'Asia/Shanghai',
          tasks:null,
        };
      },
      // 并对外暴露操作方法 避免出现 Uncaught (in promise) false
      getFormData(val) {
        const ret = {};
        this.$refs[val].validate((valid) => {
          ret.valid = valid;
          ret.form = this.form;
        });
        return ret;
      },
      open2(level,msg) {
        // 弹窗，需要确定
        var levelMsg = {'error':'错误','info':'提示','success':'成功','warning':'警告'};
        this.$confirm(msg, levelMsg[level], {
          confirmButtonText: '确定',
          // showCancelButton: false,
          type: level
        }).then(() => {
        }).catch(() => {
        });
      },
      open(msg) {
        // 消息提示
        this.$message(msg);
      },
      submitData(rule, value,callback){
        //rule type:'parentJob'
        //如果先选定tartget，则向下获取所有的子节点，从source中排除
        let data = this.form;
        if(data.minute == '*' && data.hour == '*' && data.dayOfWeek == '*' && data.dayOfMonth == '*' && data.monthOfYear == '*'){
          callback(new Error("定时均为星号，请在Linux中尝试相关格式后进行调整"))
        }else{
          callback()
        }
      },
      handleClick(row) {
        // 点了编辑后需要给form赋值
        // console.log(row);
        this.form.id = row['id'];
        this.form.minute = row['minute'];
        this.form.hour = row['hour'];
        this.form.dayOfWeek = row['day_of_week'];
        this.form.dayOfMonth = row['day_of_month'];
        this.form.monthOfYear = row['month_of_year'];
        this.form.timezone = row['timezone'];
      },
      resetDateFilter() {
        this.$refs.filterTable.clearFilter('date');
      },
      clearFilter() {
        this.$refs.filterTable.clearFilter();
      },
      filterTag(value, row) {
        return row.username === value;
      }
    },
    mounted() {
      // this.oldForm = JSON.parse(JSON.stringify(this.form));
      // this.username = this.$store.get("username","游客");
      // this.$axios.get('crontabs/').then((response) => {
      //   //把token存储到store
      //   this.tableData = response.data;
      //   this.tableData.sort(this.compare('id'))
      // }).catch((error) => {
      //   console.log(error)
      // });
      this.username = this.name;
        Crontabs('get').then(response => {
        this.tableData = response.data;
        this.tableData.sort(this.compare('id'))
      });

    },
    computed: {
      ...mapGetters([
        'name',
        'roles'
      ])
    }
  }
</script>

<style scoped>
  .el-form-item .el-select{
    width: 100%;
  }

</style>
