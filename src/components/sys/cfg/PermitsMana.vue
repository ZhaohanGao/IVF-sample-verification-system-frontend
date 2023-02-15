<template>
  <div>
    <div class="permitsManaTool">
      <el-input size="small" placeholder="请输入角色英文名" v-model="role.name">
        <template slot="prepend">ROLE_</template>
      </el-input>
      <el-input size="small" v-model="role.nameZh" placeholder="请输入角色中文名" @keydown.enter.native="doAddRole"></el-input>
      <el-button size="small" type="primary" icon="el-icon-plus" @click="doAddRole">添加角色</el-button>
    </div>
    <div class="permitsManaMain">
      <el-collapse v-model="activeName" accordion @change="change">
        <el-collapse-item :title="r.nameZh" :name="r.id" v-for="(r,index) in roles" :key="index">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>可访问资源</span>
              <el-button style="float: right; padding: 3px 0; color: red" type="text" icon="el-icon-delete" @click="doDeleteRole(r)"></el-button>
            </div>
            <div>
              <el-tree show-checkbox :data="allMenus" :props="defaultProps" :default-checked-keys="selectedMenus"
                       ref="tree" :key="index" node-key="id"></el-tree>
              <div style="display: flex; justify-content: flex-end">
                <el-button size="mini" @click="cancelUpdate">取消修改</el-button>
                <el-button size="mini" type="primary" @click="doUpdate(r.id,index)">确认修改</el-button>
              </div>
            </div>
          </el-card>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>
export default {
  name: "PermitsMana",
  data() {
    return {
      role: {
        name: '',
        nameZh: ''
      },
      roles: [],
      allMenus: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      selectedMenus: [],
      activeName: -1
    }
  },
  mounted() {
    this.initRoles();
  },
  methods: {
    doDeleteRole(role){
      if(role.nameZh=='患者'){
        this.$message({
          type: 'warning',
          message: '无法删除患者角色！'
        })
      }else {
        this.$confirm('此操作将永久删除[' + role.nameZh + ']角色，是否继续？','提示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
          this.deleteRequest('/system/cfg/permits/role/' + role.id).then(resp=>{
            if (resp){
              this.initRoles();
            }
          })
        }).catch(()=>{
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      }
    },
    doAddRole() {
      if (this.role.name && this.role.nameZh) {
        this.postRequest('/system/cfg/permits/role', this.role).then(resp => {
          if (resp) {
            this.initRoles();
          }
        })
      } else {
        this.$message.error("请输入所有字段！");
      }
    },
    cancelUpdate() {
      this.activeName = -1;
      this.role.name = '';
      this.role.nameZh = '';
    },
    doUpdate(rid, index) {
      let tree = this.$refs.tree[index];
      let selectedKeys = tree.getCheckedKeys(true);
      let url = '/system/cfg/permits/?rid=' + rid;
      selectedKeys.forEach(keys => {
        url += '&mids=' + keys;
      });
      this.putRequest(url).then(resp => {
        if (resp) {
          this.activeName = -1;
        }
      })
    },
    change(rid) {
      if (rid) {
        this.initAllMenus();
        this.initSelectedMenus(rid);
      }
    },
    initSelectedMenus(rid) {
      this.getRequest('/system/cfg/permits/mid/' + rid).then(resp => {
        if (resp) {
          this.selectedMenus = resp;
        }
      });
    },
    initAllMenus() {
      this.getRequest('/system/cfg/permits/menus').then(resp => {
        if (resp) {
          this.allMenus = resp;
        }
      })
    },
    initRoles() {
      this.getRequest('/system/cfg/permits/').then(resp => {
        if (resp) {
          this.roles = resp;
        }
      })
    }
  }
}
</script>

<style scoped>
.addRoleInput {
  width: 300px;
  margin-right: 8px;
}

.posManaMain {
  margin-top: 10px;
}

.permitsManaTool {
  display: flex;
  justify-content: flex-start;
}

.permitsManaTool .el-input {
  width: 300px;
  margin-right: 6px;
}

.permitsManaMain {
  margin-top: 10px;
  width: 720px;
}
</style>