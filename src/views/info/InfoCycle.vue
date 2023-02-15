<template>
  <div>
    <div>
      <div style="display: flex; justify-content: space-between">
        <div>
          <el-input style="width: 300px; margin-right: 10px"
                    prefix-icon="el-icon-search"
                    v-model="cycleId"
                    @keydown.enter.native="initCycles"
                    clearable
                    :disabled="showAdvanceSearchVisible"
                    @clear="initCycles"
                    placeholder="请输入周期ID进行搜索..."></el-input>
          <el-button type="primary" icon="el-icon-search" @click="initCycles" :disabled="showAdvanceSearchVisible">搜索
          </el-button>
          <el-button type="primary" @click="showAdvanceSearchVisible=!showAdvanceSearchVisible">
            <i :class="showAdvanceSearchVisible?'fa fa-angle-double-up':'fa fa-angle-double-down'"
               aria-hidden="true"></i>
            高级搜索
          </el-button>
        </div>
        <div>
          <el-button type="primary" icon="el-icon-plus" @click="showAddCycleView">添加周期</el-button>
        </div>
      </div>
    </div>
    <transition name="slide-fade">
      <div v-show="showAdvanceSearchVisible"
           style="border: 1px solid #409eff; border-radius: 5px; box-sizing: border-box; padding: 5px; margin: 10px 0px">
        <el-row style="margin-bottom: 10px">
          <el-col :span="6">
            所属诊案编号:
            <el-input size="mini" prefix-icon="el-icon-edit" style="width: 160px" v-model="searchValue.tcId"
                      placeholder=""></el-input>
          </el-col>
          <el-col :span="6">
            周期次序:
            <el-input size="mini" prefix-icon="el-icon-edit" style="width: 150px" v-model="searchValue.ccNum"
                      placeholder=""></el-input>
          </el-col>
          <el-col :span="6">
            第一阶段是否完成:
            <el-radio-group v-model="searchValue.step1">
              <el-radio label="是">是</el-radio>
              <el-radio label="否">否</el-radio>
            </el-radio-group>
          </el-col>
          <el-col :span="6">
            第二阶段是否完成:
            <el-radio-group v-model="searchValue.step2">
              <el-radio label="是">是</el-radio>
              <el-radio label="否">否</el-radio>
            </el-radio-group>
          </el-col>
        </el-row>
        <el-row style="margin-bottom: 10px">
          <el-col :span="6">
            第三阶段是否完成:
            <el-radio-group v-model="searchValue.step3">
              <el-radio label="是">是</el-radio>
              <el-radio label="否">否</el-radio>
            </el-radio-group>
          </el-col>
          <el-col :span="6">
            第四阶段是否完成:
            <el-radio-group v-model="searchValue.step4">
              <el-radio label="是">是</el-radio>
              <el-radio label="否">否</el-radio>
            </el-radio-group>
          </el-col>
          <el-col :span="6">
            第五阶段是否完成:
            <el-radio-group v-model="searchValue.step5">
              <el-radio label="是">是</el-radio>
              <el-radio label="否">否</el-radio>
            </el-radio-group>
          </el-col>
          <el-col :span="6">
            第六阶段是否完成:
            <el-radio-group v-model="searchValue.step6">
              <el-radio label="是">是</el-radio>
              <el-radio label="否">否</el-radio>
            </el-radio-group>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="5" :offset="18">
            <el-button size="mini" @click="showAdvanceSearchVisible=!showAdvanceSearchVisible">取消</el-button>
            <el-button @click="initCycles('advanced')" size="mini" icon="el-icon-search" type="primary">搜索</el-button>
          </el-col>
        </el-row>
      </div>
    </transition>
    <div style="margin-top: 10px">
      <el-table
          :data="cycles"
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
            prop="ccId"
            label="周期编号"
            align="center"
            fixed="left"
            width="80">
        </el-table-column>
        <el-table-column
            prop="tcId"
            label="所属诊案编号"
            align="center"
            width="110">
        </el-table-column>
        <el-table-column
            prop="ccNum"
            label="周期次序"
            align="center"
            width="100">
        </el-table-column>
        <el-table-column
            prop="step1"
            label="第一阶段是否完成"
            align="center"
            width="150">
        </el-table-column>
        <el-table-column
            prop="step2"
            label="第二阶段是否完成"
            align="center"
            width="150">
        </el-table-column>
        <el-table-column
            prop="step3"
            label="第三阶段是否完成"
            align="center"
            width="150">
        </el-table-column>
        <el-table-column
            prop="step4"
            label="第四阶段是否完成"
            align="center"
            width="150">
        </el-table-column>
        <el-table-column
            prop="step5"
            label="第五阶段是否完成"
            align="center"
            width="150">
        </el-table-column>
        <el-table-column
            prop="step6"
            label="第六阶段是否完成"
            align="center"
            width="150">
        </el-table-column>
        <el-table-column
            label="操作"
            align="center"
            fixed="right"
            width="100">
          <template slot-scope="scope">
            <el-button @click="showEditCycleView(scope.row)" style="padding: 3px" size="mini">编辑</el-button>
            <el-button @click="deleteCycle(scope.row)" style="padding: 3px" size="mini" type="danger">删除</el-button>
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
        <el-form ref="cycleForm" :model="cycle" :rules="rules">
          <el-row>
            <el-col :span="8">
              <el-form-item label="所属诊案编号:" prop="tcId">
                <el-input size="mini" prefix-icon="el-icon-edit" style="width: 220px" v-model="cycle.tcId"
                          placeholder="请输入所属诊案编号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="周期次序:" prop="ccNum">
                <el-input size="mini" prefix-icon="el-icon-edit" style="width: 220px" v-model="cycle.ccNum"
                          placeholder="请输入周期次序"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="第一阶段是否完成:" prop="step1">
                <el-radio-group v-model="cycle.step1" style="margin-top: 6px">
                  <el-radio label="是">是</el-radio>
                  <el-radio label="否">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="第二阶段是否完成:" prop="step2">
                <el-radio-group v-model="cycle.step2" style="margin-top: 6px">
                  <el-radio label="是">是</el-radio>
                  <el-radio label="否">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="第三阶段是否完成:" prop="step3">
                <el-radio-group v-model="cycle.step3" style="margin-top: 6px">
                  <el-radio label="是">是</el-radio>
                  <el-radio label="否">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="第四阶段是否完成:" prop="step4">
                <el-radio-group v-model="cycle.step4" style="margin-top: 6px">
                  <el-radio label="是">是</el-radio>
                  <el-radio label="否">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-col :span="8">
            <el-form-item label="第五阶段是否完成:" prop="step5">
              <el-radio-group v-model="cycle.step5" style="margin-top: 6px">
                <el-radio label="是">是</el-radio>
                <el-radio label="否">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="第六阶段是否完成:" prop="step6">
              <el-radio-group v-model="cycle.step6" style="margin-top: 6px">
                <el-radio label="是">是</el-radio>
                <el-radio label="否">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="doAddCycle">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "InfoCycle",
  data() {
    return {
      selections: [],
      searchValue: {
        ccId: '',
        tcId: '',
        ccNum: '',
        step1:'',
        step2:'',
        step3:'',
        step4:'',
        step5:'',
        step6:''
      },
      showAdvanceSearchVisible: false,
      title: '',
      cycles: [],
      loading: false,
      total: 0,
      currentPage: 1,
      size: 10,
      cycleId: '',
      dialogVisible: false,
      cycle: {
        ccId: null,
        tcId: '',
        ccNum: '',
        step1:'',
        step2:'',
        step3:'',
        step4:'',
        step5:'',
        step6:''
      },
      rules: {
        tcId: [{required: true, message: '请输入所属诊案编号', trigger: 'blur'}],
        ccNum: [{required: true, message: '请输入周期次序', trigger: 'blur'}],
        step1: [{required: true, message: '请输入第一阶段是否完成', trigger: 'blur'}],
        step2: [{required: true, message: '请输入第二阶段是否完成', trigger: 'blur'}],
        step3: [{required: true, message: '请输入第三阶段是否完成', trigger: 'blur'}],
        step4: [{required: true, message: '请输入第四阶段是否完成', trigger: 'blur'}],
        step5: [{required: true, message: '请输入第五阶段是否完成', trigger: 'blur'}],
        step6: [{required: true, message: '请输入第六阶段是否完成', trigger: 'blur'}],
      }
    }
  },
  mounted() {
    this.initCycles();
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
        let ccIds = '?';
        this.selections.forEach(item => {
          ccIds += 'ccIds=' + item.ccId + '&';
        })
        this.deleteRequest('/info/cycle/' + ccIds).then(resp => {
          if (resp) {
            this.initCycles();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    showEditCycleView(data) {
      this.title = '编辑样本信息';
      this.cycle = data;
      this.dialogVisible = true;
    },
    deleteCycle(data) {
      this.$confirm('此操作将永久删除' + data.ccId + '号周期记录，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest('/info/cycle/' + data.ccId).then(resp => {
          if (resp) {
            this.initCycles();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    doAddCycle() {
      if (this.cycle.ccId) {
        this.$refs['cycleForm'].validate(valid => {
          if (valid) {
            this.putRequest('/info/cycle/', this.cycle).then(resp => {
              if (resp) {
                this.dialogVisible = false;
                this.initCycles();
              }
            });
          }
        })
      } else {
        this.$refs['cycleForm'].validate(valid => {
          if (valid) {
            this.postRequest('/info/cycle/', this.cycle).then(resp => {
              if (resp) {
                this.dialogVisible = false;
                this.initCycles();
              }
            });
          }
        })
      }
    },
    sizeChange(size) {
      this.size = size;
      this.initCycles();
    },
    currentChange(currentPage) {
      this.currentPage = currentPage;
      this.initCycles();
    },
    showAddCycleView() {
      this.title = '添加周期';
      this.cycle = {
        ccId: null,
        tcId: '',
        ccNum: '',
        step1:'',
        step2:'',
        step3:'',
        step4:'',
        step5:'',
        step6:''
      };
      this.dialogVisible = true;
    },
    initCycles(type) {
      this.loading = true;
      let url = '/info/cycle/?currentPage=' + this.currentPage + '&size=' + this.size;
      if (type && type == 'advanced') {
        if (this.searchValue.tcId) {
          url += '&tcId=' + this.searchValue.tcId;
        }
        if (this.searchValue.ccNum) {
          url += '&ccNum=' + this.searchValue.ccNum;
        }
        if (this.searchValue.step1) {
          url += '&step1=' + this.searchValue.step1;
        }
        if (this.searchValue.step2) {
          url += '&step2=' + this.searchValue.step2;
        }
        if (this.searchValue.step3) {
          url += '&step3=' + this.searchValue.step3;
        }
        if (this.searchValue.step4) {
          url += '&step4=' + this.searchValue.step4;
        }
        if (this.searchValue.step5) {
          url += '&step5=' + this.searchValue.step5;
        }
        if (this.searchValue.step6) {
          url += '&step6=' + this.searchValue.step6;
        }
      } else {
        url += '&ccId=' + this.cycleId;

      }
      this.getRequest(url).then(resp => {
        this.loading = false;
        if (resp) {
          this.cycles = resp.data;
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