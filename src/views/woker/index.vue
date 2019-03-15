<template>
  <div class="app-container">

    <template>
      <el-table
        ref="multipleTable"
        :data="tableData5"
        border
        style="width: 100%"
        :span-method="objectSpanMethod"
        size="mini"
      >

        <el-table-column
          label="队列（当前可用）"
          width="300"
          prop="queue">
        </el-table-column>

        <el-table-column
          label="Worker节点（存活状态）"
          prop="host">
        </el-table-column>

      </el-table>
    </template>
  </div>

</template>

<script>
  import { getWoker} from '@/api/woker'
  export default {
    name: "Woker",
    data(){
      return{
        tableData5: [],
        queueNum:{},
        oldQueue:"",
        oldRowIndex:-1
      }
    },
    methods:{
      sortByKey(array,key){
        return array.sort(function(a,b){
          var x = a[key];
          var y = b[key];
          return((x<y)?-1:((x>y)?1:0));
        })
      },
      objectSpanMethod({ row, column, rowIndex, columnIndex }) {
        // if(this.oldRowIndex != rowIndex){
        //   this.oldRowIndex = rowIndex;
        //   // console.log(rowIndex);
        //   // console.log(oldRowIndex);
        //   // console.log(oldRowIndex != rowIndex);
        //   if(this.oldQueue != row.queue){
        //     this.oldQueue = row.queue;
        //     return {
        //       rowspan: this.queueNum[this.oldQueue],
        //       colspan: 1
        //     };
        //   }else{
        //     return {
        //       rowspan: 0,
        //       colspan: 0
        //     };
        //   }
        // }
      },

    },
    mounted() {
      getWoker().then(response => {
        // console.log(response.data);
        var responseData = response.data;
        var queueNum = {};
        var data = []
        for(let keys in responseData){
          var queueWorker = {};
          var hostWorker = keys;
          var queue = responseData[keys][0].name;
          queueWorker.host = hostWorker;
          queueWorker.queue = queue;
          data.push(queueWorker);
          //给相同队列计数
          if(queueNum[queue] != undefined){
            queueNum[queue] += 1
          }else{
            queueNum[queue] = 1
          }

          //记录queue的开始位置

        }

        this.queueNum = queueNum;

        // this.tableData5 = this.sortByKey(data,'queue');
        this.tableData5 = this.sortByKey(data,'queue');

        // console.log(this.tableData5)

        // console.log(this.queueNum)
        // this.list = response.data.items
        // this.listLoading = false
      })
      // this.$axios({
      //   method: "get",
      //   url:"celeryworker/"
      // }).then((response) => {
      //   //把token存储到store
      //   // console.log(response.data);
      //
      //   var responseData = response.data;
      //   console.log(responseData);
      //
      //   for(let keys in responseData){
      //     var queueWorker = {};
      //     var hostWorker = keys;
      //     var queue = responseData[keys][0].name;
      //     queueWorker.host = hostWorker;
      //     queueWorker.queue = queue;
      //     this.tableData5.push(queueWorker)
      //   }
      //
      // }).catch((error) => {
      // });
    }
  }
</script>

<style scoped>

</style>
