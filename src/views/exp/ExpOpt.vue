<template>
  <div>
    <div>
      <div style="display: flex; justify-content: space-between">
        <div>
          <el-input style="width: 300px; margin-right: 10px"
                    prefix-icon="el-icon-search"
                    v-model="expOptId"
                    @keydown.enter.native="initExpOpts"
                    clearable
                    :disabled="showAdvanceSearchVisible"
                    @clear="initExpOpts"
                    placeholder="请输入实验操作ID进行搜索..."></el-input>
          <el-button type="primary" icon="el-icon-search" @click="initExpOpts" :disabled="showAdvanceSearchVisible">搜索
          </el-button>
          <el-button type="primary" @click="showAdvanceSearchVisible=!showAdvanceSearchVisible">
            <i :class="showAdvanceSearchVisible?'fa fa-angle-double-up':'fa fa-angle-double-down'"
               aria-hidden="true"></i>
            高级搜索
          </el-button>
        </div>
        <div>
          <el-button type="primary" icon="el-icon-plus" @click="showAddExpOptView">添加实验操作</el-button>
        </div>
      </div>
    </div>
    <transition name="slide-fade">
      <div v-show="showAdvanceSearchVisible"
           style="border: 1px solid #409eff; border-radius: 5px; box-sizing: border-box; padding: 5px; margin: 10px 0px">
        <el-row style="margin-bottom: 10px">
          <el-col :span="8">
            实验操作编号:
            <el-input size="mini" prefix-icon="el-icon-edit" style="width: 150px" v-model="searchValue.expId"
                      placeholder=""></el-input>
          </el-col>
          <el-col :span="8">
            操作对象编号:
            <el-input size="mini" prefix-icon="el-icon-edit" style="width: 170px" v-model="searchValue.operandId"
                      placeholder=""></el-input>
          </el-col>
          <el-col :span="8">
            实验种类:
            <el-input size="mini" prefix-icon="el-icon-edit" style="width: 167px" v-model="searchValue.expType"
                      placeholder=""></el-input>
          </el-col>
        </el-row>
        <el-row style="margin-bottom: 10px">
          <el-col :span="8">
            实验内容:
            <el-input size="mini" prefix-icon="el-icon-edit" style="width: 183px" v-model="searchValue.expName"
                      placeholder=""></el-input>
          </el-col>
          <el-col :span="8">
            操作人员编号:
            <el-input size="mini" prefix-icon="el-icon-edit" style="width: 170px" v-model="searchValue.operatorId"
                      placeholder=""></el-input>
          </el-col>
          <el-col :span="8">
            周期:
            <el-input size="mini" prefix-icon="el-icon-edit" style="width: 200px" v-model="searchValue.cycleNum"
                      placeholder=""></el-input>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="15">
            实验时间:
            <el-date-picker
                v-model="searchValue.expDateScope"
                value-format="yyyy-MM-dd HH:mm:ss"
                unlink-panels
                size:mini
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间">
            </el-date-picker>
          </el-col>
          <el-col :span="5" :offset="4">
            <el-button size="mini" @click="showAdvanceSearchVisible=!showAdvanceSearchVisible">取消</el-button>
            <el-button @click="initExpOpts('advanced')" size="mini" icon="el-icon-search" type="primary">搜索</el-button>
          </el-col>
        </el-row>
      </div>
    </transition>
    <div style="margin-top: 10px">
      <el-table
          :data="expOpts"
          @selection-change="handleSelectionChange"
          v-loading="loading"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
          stripe
          border
          style="width: 100%">
        <el-table-column
            type="selection"
            width="55">
        </el-table-column>
        <el-table-column
            prop="expId"
            label="实验操作编号"
            align="center"
            fixed="left"
            width="120">
        </el-table-column>
        <el-table-column
            prop="operandId"
            label="操作对象编号"
            align="center"
            width="120">
        </el-table-column>
        <el-table-column
            prop="expType"
            label="实验种类"
            align="center"
            width="150">
        </el-table-column>
        <el-table-column
            prop="expName"
            label="实验内容"
            align="center"
            width="160">
        </el-table-column>
        <el-table-column
            prop="expDate"
            label="实验时间"
            align="center"
            width="180">
        </el-table-column>
        <el-table-column
            prop="operatorId"
            label="操作人员编号"
            align="center"
            width="140">
        </el-table-column>
        <el-table-column
            prop="cycleNum"
            label="周期"
            align="center"
            width="110">
        </el-table-column>
        <el-table-column
            label="操作"
            align="center"
            fixed="right"
            width="100">
          <template slot-scope="scope">
            <el-button @click="showEditExpOptView(scope.row)" style="padding: 3px" size="mini">编辑</el-button>
            <el-button @click="deleteExpOpt(scope.row)" style="padding: 3px" size="mini" type="danger">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 10px">
        <el-button style="float: left" type="danger" icon="el-icon-delete" @click="batchDelete"
                   :disabled="this.selections.length === 0">批量删除
        </el-button>
        <el-pagination
            style="float: right"
            background
            @current-change="currentChange"
            @size-change="sizeChange"
            layout="sizes, prev, pager, next, jumper, ->, total"
            :total="total">
        </el-pagination>
      </div>
    </div>
    <el-dialog
        :title="title"
        :visible.sync="dialogVisible"
        width="80%">
      <div>
        <el-form ref="expOptForm" :model="expOpt" :rules="rules">
          <el-row>
            <el-col :span="8">
              <el-form-item label="操作对象编号:" prop="operandId">
                <el-input size="mini" prefix-icon="el-icon-edit" style="width: 180px" v-model="expOpt.operandId"
                          placeholder="请输入操作对象编号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="实验种类:" prop="expType">
                <el-input size="mini" prefix-icon="el-icon-edit" style="width: 190px" v-model="expOpt.expType"
                          placeholder="请输入实验种类"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="实验内容:" prop="expName">
                <el-input size="mini" prefix-icon="el-icon-edit" style="width: 192px" v-model="expOpt.expName"
                          placeholder="请输入实验内容"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="实验时间:" prop="expDate">
                <el-date-picker
                    v-model="expOpt.expDate"
                    type="datetime"
                    size="mini"
                    style="width: 220px"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="实验时间">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="周期:" prop="cycleNum">
                <el-input size="mini" prefix-icon="el-icon-edit" style="width: 220px" v-model="expOpt.cycleNum"
                          placeholder="请输入周期"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="doAddExpOpt">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "InfoExpOpt",
  data() {
    return {
      selections: [],
      searchValue: {
        expId: '',
        operandId: '',
        expType: '',
        expName: '',
        expDateScope: null,
        operatorId:'',
        cycleNum:''
      },
      showAdvanceSearchVisible: false,
      title: '',
      expOpts: [],
      loading: false,
      total: 0,
      currentPage: 1,
      size: 10,
      expOptId: '',
      dialogVisible: false,
      expOpt: {
        expId: '',
        operandId: '',
        expType: '',
        expName: '',
        expDateScope: null,
        operatorId:'',
        cycleNum:''
      },
      rules: {
        operandId: [{required: true, message: '请输入操作对象编号', trigger: 'blur'}],
        expType: [{required: true, message: '请输入实验种类', trigger: 'blur'}],
        expName: [{required: true, message: '请输入实验内容', trigger: 'blur'}],
        expDate: [{required: true, message: '请输入实验时间', trigger: 'blur'}],
        cycleNum: [{required: true, message: '请输入周期', trigger: 'blur'}],
      }
    }
  },
  mounted() {
    this.initExpOpts();
  },
  methods: {
    handleSelectionChange(val) {
      this.selections = val;
    },
    batchDelete() {
      // 删除前的提示
      this.$confirm('此操作将永久删除' + this.selections.length + '条记录，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: "warning",
      }).then(() => {
        let expIds = '?';
        this.selections.forEach(item => {
          expIds += 'expIds=' + item.expId + '&';
        })
        this.deleteRequest('/experiment/opt/' + expIds).then(resp => {
          if (resp) {
            this.initExpOpts();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    showEditExpOptView(data) {
      this.title = '编辑样本信息';
      this.expOpt = data;
      this.dialogVisible = true;
    },
    deleteExpOpt(data) {
      this.$confirm('此操作将永久删除' + data.expId + '号实验操作记录，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest('/experiment/opt/' + data.expId).then(resp => {
          if (resp) {
            this.initExpOpts();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    doAddExpOpt() {
      if (this.expOpt.expId) {
        this.$refs['expOptForm'].validate(valid => {
          if (valid) {
            this.putRequest('/experiment/opt/', this.expOpt).then(resp => {
              if (resp) {
                this.dialogVisible = false;
                this.initExpOpts();
              }
            });
          }
        })
      } else {
        this.$refs['expOptForm'].validate(valid => {
          if (valid) {
            this.postRequest('/experiment/opt/', this.expOpt).then(resp => {
              if (resp) {
                this.dialogVisible = false;
                this.initExpOpts();
              }
            });
          }
        })
      }
    },
    sizeChange(size) {
      this.size = size;
      this.initExpOpts();
    },
    currentChange(currentPage) {
      this.currentPage = currentPage;
      this.initExpOpts();
    },
    showAddExpOptView() {
      this.title = '添加样本';
      this.expOpt = {
        expId: '',
        operandId: '',
        expType: '',
        expName: '',
        expDateScope: null,
        operatorId:'',
        cycleNum:''
      };
      this.dialogVisible = true;
    },
    initExpOpts(type) {
      this.loading = true;
      let url = '/experiment/opt/?currentPage=' + this.currentPage + '&size=' + this.size;
      if (type && type == 'advanced') {
        if (this.searchValue.operandId) {
          url += '&operandId=' + this.searchValue.operandId;
        }
        if (this.searchValue.expName) {
          url += '&expName=' + this.searchValue.expName;
        }
        if (this.searchValue.expType) {
          url += '&expType=' + this.searchValue.expType;
        }
        if (this.searchValue.expDateScope) {
          url += '&expDateScope=' + this.searchValue.expDateScope;
        }
        if (this.searchValue.operatorId) {
          url += '&operatorId=' + this.searchValue.operatorId;
        }
        if (this.searchValue.cycleNum) {
          url += '&cycleNum=' + this.searchValue.cycleNum;
        }
      } else {
        url += '&expId=' + this.expOptId;


      }
      this.getRequest(url).then(resp => {
        this.loading = false;
        if (resp) {
          this.expOpts = resp.data;
          this.total = resp.total;
        }
      })
    }
  }
}
</script>

<style>
.slide-fade-enter-active {
  transition: all .4s ease;
}

.slide-fade-leave-active {
  transition: all .4s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}

.slide-fade-enter, .slide-fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}
</style>