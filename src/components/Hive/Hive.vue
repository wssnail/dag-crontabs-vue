<template>
  <div>
    <el-form :model="hiveRuleForm" :rules="rules" ref="hiveRuleForm" size="mini" label-position="left" label-width="90px" class="demo-ruleForm">

      <el-form-item label="节点名" prop="name">
        <el-input v-model="hiveRuleForm.name" placeholder="节点名称"></el-input>
      </el-form-item>
      <el-form-item label="master" prop="master">
        <el-input v-model="hiveRuleForm.master" placeholder="master"></el-input>
      </el-form-item>
      <el-form-item label="appname" prop="appname">
        <el-input v-model="hiveRuleForm.appname" placeholder="appname"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
    export default {

      name: "Hive",
      props:['checkIdNames'],
      data(){
          return{
            hiveRuleForm:{
              name:"",
              master:"",
              appname:""
            },
            rules: {
              name: [
                {required: true,message: '必须填写', trigger: 'blur'},
                {type:'email' , trigger: 'blur',validator:this.checkIdNames}
              ],
              master: [
                {required: true,message: '必须填写', trigger: 'blur'}
              ],
              appname: [
                { required: true, message: '必须填写', trigger: 'blur'}
              ]
            }
          }
      },
      methods:{
        getForm(form){
          var formData = true;
          this.$refs[form].validate((valid)=>{
            formData = valid
          });
          return Array(formData,this.hiveRuleForm)
        }
      }
    }
</script>

<style scoped>

</style>
