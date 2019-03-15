<template>
  <div id="home" class="app-container">
    <el-table
      :data="tableData"
      stripe
      size="mini"
      style="width: 100%">
      <el-table-column
        prop="id"
        label="id"
        width="180">
      </el-table-column>
      <el-table-column
        prop="interval"
        label="间隔时间"
        width="180">
      </el-table-column>
      <el-table-column
        prop="username"
        label="创建用户">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import {getIntervals} from "@/api/intervals";

  export default {
    name: "Interval",
    data(){
      return{
        tableData:null
      }
    },
    mounted() {
      // this.$axios.get('intervals/').then((response) => {
      //   //把token存储到store
      //   console.log(response.data);
      //   this.tableData = response.data;
      // }).catch((error) => {
      // });
      getIntervals().then(response => {
        this.tableData = response.data;
      })
    }
  }
</script>

<style scoped>


</style>
