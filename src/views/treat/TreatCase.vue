<template>
  <div>
    <div>
      <div style="display: flex; justify-content: space-between">
        <div>
          <el-input style="width: 300px; margin-right: 10px"
                    prefix-icon="el-icon-search"
                    v-model="caseId"
                    @keydown.enter.native="initCases"
                    clearable
                    :disabled="showAdvanceSearchVisible"
                    @clear="initCases"
                    placeholder="请输入就诊案例ID进行搜索..."></el-input>
          <el-button type="primary" icon="el-icon-search" @click="initCases" :disabled="showAdvanceSearchVisible">搜索
          </el-button>
          <el-button type="primary" @click="showAdvanceSearchVisible=!showAdvanceSearchVisible">
            <i :class="showAdvanceSearchVisible?'fa fa-angle-double-up':'fa fa-angle-double-down'"
               aria-hidden="true"></i>
            高级搜索
          </el-button>
        </div>
        <div>
          <el-button type="primary" icon="el-icon-plus" @click="showAddCaseView">添加案例</el-button>
        </div>
      </div>
    </div>
    <transition name="slide-fade">
      <div v-show="showAdvanceSearchVisible"
           style="border: 1px solid #409eff; border-radius: 5px; box-sizing: border-box; padding: 5px; margin: 10px 0px">
        <el-row style="margin-bottom: 10px">
          <el-col :span="6">
            患者女编号:
            <el-input size="mini" prefix-icon="el-icon-edit" style="width: 160px" v-model="searchValue.fpatientId"
                      placeholder=""></el-input>
          </el-col>
          <el-col :span="6">
            患者男编号:
            <el-input size="mini" prefix-icon="el-icon-edit" style="width: 160px" v-model="searchValue.mpatientId"
                      placeholder=""></el-input>
          </el-col>
          <el-col :span="6">
            RFID卡编号:
            <el-input size="mini" prefix-icon="el-icon-edit" style="width: 160px" v-model="searchValue.rfid"
                      placeholder=""></el-input>
          </el-col>
          <el-col :span="6">
            当前阶段:
            <el-input size="mini" prefix-icon="el-icon-edit" style="width: 160px" v-model="searchValue.step"
                      placeholder=""></el-input>
          </el-col>
        </el-row>
        <el-row style="margin-bottom: 10px">
          <el-col :span="12">
            开始日期:
            <el-date-picker
                v-model="searchValue.beginDateScope"
                value-format="yyyy-MM-dd"
                unlink-panels
                size:mini
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期始"
                end-placeholder="开始日期末">
            </el-date-picker>
          </el-col>
          <el-col :span="12">
            结束日期:
            <el-date-picker
                v-model="searchValue.endDateScope"
                value-format="yyyy-MM-dd"
                unlink-panels
                size:mini
                type="daterange"
                range-separator="至"
                start-placeholder="结束日期始"
                end-placeholder="结束日期末">
            </el-date-picker>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            状态:
            <el-input size="mini" prefix-icon="el-icon-edit" style="width: 160px" v-model="searchValue.state"
                      placeholder=""></el-input>
          </el-col>
          <el-col :span="6">
            周期数:
            <el-input size="mini" prefix-icon="el-icon-edit" style="width: 160px" v-model="searchValue.cycleNum"
                      placeholder=""></el-input>
          </el-col>
          <el-col :span="5" :offset="18">
            <el-button size="mini" @click="showAdvanceSearchVisible=!showAdvanceSearchVisible">取消</el-button>
            <el-button @click="initCases('advanced')" size="mini" icon="el-icon-search" type="primary">搜索</el-button>
          </el-col>
        </el-row>
      </div>
    </transition>
    <div style="margin-top: 10px">
      <el-table
          :data="cases"
          v-loading="loading"
          @selection-change="handleSelectionChange"
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
            prop="tcId"
            label="诊案编号"
            align="center"
            fixed="left"
            width="110">
        </el-table-column>
        <el-table-column
            prop="fpatient.name"
            label="患者女姓名"
            align="center"
            width="110">
        </el-table-column>
        <el-table-column
            prop="mpatient.name"
            label="患者男姓名"
            align="center"
            width="110">
        </el-table-column>
        <el-table-column
            prop="beginDate"
            label="开始日期"
            align="center"
            width="170">
        </el-table-column>
        <el-table-column
            prop="endDate"
            label="结束日期"
            align="center"
            width="170">
        </el-table-column>
        <el-table-column
            prop="rfid"
            label="RFID卡编号"
            align="center"
            width="110">
        </el-table-column>
        <el-table-column
            prop="step"
            label="当前阶段"
            align="center"
            width="110">
        </el-table-column>
        <el-table-column
            prop="state"
            label="状态"
            align="center"
            width="170">
        </el-table-column>
        <el-table-column
            prop="cycleNum"
            label="周期数"
            align="center"
            width="170">
        </el-table-column>
        <el-table-column
            prop="description"
            label="简要描述"
            align="center"
            width="170">
        </el-table-column>
        <el-table-column
            prop="comment"
            label="备注"
            align="center"
            width="170">
        </el-table-column>
        <el-table-column
            label="操作"
            align="center"
            fixed="right"
            width="100">
          <template slot-scope="scope">
            <el-button @click="showEditCaseView(scope.row)" style="padding: 3px" size="mini">编辑</el-button>
            <el-button @click="deleteCase(scope.row)" style="padding: 3px" size="mini" type="danger">删除</el-button>
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
        <el-form ref="caseForm" :model="tCase" :rules="rules">
          <el-row>
            <el-col :span="8">
              <el-form-item label="女患者编号:" prop="fpatientId">
                <el-input size="mini" prefix-icon="el-icon-edit" style="width: 220px" v-model="tCase.fpatientId"
                          placeholder="请输入患者编号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="男患者编号:" prop="mpatientId">
                <el-input size="mini" prefix-icon="el-icon-edit" style="width: 220px" v-model="tCase.mpatientId"
                          placeholder="请输入患者编号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="开始日期:" prop="beginDate">
                <el-date-picker
                    v-model="tCase.beginDate"
                    type="date"
                    size="mini"
                    style="width: 220px"
                    value-format="yyyy-MM-dd"
                    placeholder="开始日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="结束日期:" prop="endDate">
                <el-date-picker
                    v-model="tCase.endDate"
                    type="date"
                    size="mini"
                    style="width: 234px"
                    value-format="yyyy-MM-dd"
                    placeholder="结束日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="RFID卡编号:" prop="rfid">
                <el-input size="mini" prefix-icon="el-icon-edit" style="width: 217px" v-model="tCase.rfid"
                          placeholder="请输入RFID卡编号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="当前阶段:" prop="step">
                <el-input size="mini" prefix-icon="el-icon-edit" style="width: 220px" v-model="tCase.step"
                          placeholder="请输入当前阶段"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="状态:" prop="state">
                <el-input size="mini" prefix-icon="el-icon-edit" style="width: 262px" v-model="tCase.state"
                          placeholder="请输入状态"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="周期数:" prop="cycleNum">
                <el-input size="mini" prefix-icon="el-icon-edit" style="width: 250px" v-model="tCase.cycleNum"
                          placeholder="请输入状态"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="简要描述:" prop="description">
                <el-input type="textarea" size="mini" prefix-icon="el-icon-edit" style="width: 950px"
                          v-model="tCase.description" placeholder="请输入简要描述"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="备注:" prop="comment">
                <el-input type="textarea" size="mini" prefix-icon="el-icon-edit" style="width: 978px"
                          v-model="tCase.comment" placeholder="请输入备注"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="doAddCase">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "TreatCase",
  data() {
    return {
      selections: [],
      searchValue: {
        tcId: '',
        fpatientId: '',
        mpatientId: '',
        beginDateScope: '',
        endDateScope: '',
        rfid: '',
        step: '',
        state: '',
        cycleNum: ''
      },
      showAdvanceSearchVisible: false,
      title: '',
      cases: [],
      loading: false,
      total: 0,
      currentPage: 1,
      size: 10,
      caseId: '',
      dialogVisible: false,
      tCase: {
        tcId: null,
        fpatientId: '',
        mpatientId: '',
        beginDate: '',
        endDate: '',
        rfid: '',
        step: '',
        state: '',
        cycleNum: '',
        description: '',
        comment: ''
      },
      rules: {
        fpatientId: [{required: true, message: '请输入患者女编号', trigger: 'blur'}],
        mpatientId: [{required: true, message: '请输入患者男编号', trigger: 'blur'}],
        beginDate: [{required: true, message: '请输入开始日期', trigger: 'blur'}],
        endDate: [{required: true, message: '请输入结束日期', trigger: 'blur'}],
        rfid: [{required: true, message: '请输入RFID卡编号', trigger: 'blur'}],
        step: [{required: true, message: '请输入当前阶段', trigger: 'blur'}],
        state: [{required: true, message: '请输入状态', trigger: 'blur'}],
        cycleNum: [{required: true, message: '请输入周期数', trigger: 'blur'}]
      }
    }
  },
  mounted() {
    this.initCases();
  },
  methods: {
    validateFee(rule, value, callback){
      if(typeof value!='number'){
        return callback(new Error('请输入正确格式的数字'));
      }
      return callback();
    },
    numFilter(value) {
      let tempVal = parseFloat(value).toFixed(3);
      let realVal = tempVal.substring(0, tempVal.length - 1);
      return realVal;
    },
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
        let tcIds = '?';
        this.selections.forEach(item => {
          tcIds += 'tcIds=' + item.tcId + '&';
        })
        this.deleteRequest('/treatment/case/' + tcIds).then(resp => {
          if (resp) {
            this.initCases();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    showEditCaseView(data) {
      this.title = '编辑就诊案例';
      this.tCase = data;
      this.dialogVisible = true;
    },
    deleteCase(data) {
      this.$confirm('此操作将永久删除' + data.tcId + '号就诊案例，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest('/treatment/case/' + data.tcId).then(resp => {
          if (resp) {
            this.initCases();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    doAddCase() {
      if (this.tCase.tcId) {
        this.$refs['caseForm'].validate(valid => {
          if (valid) {
            this.putRequest('/treatment/case/', this.tCase).then(resp => {
              if (resp) {
                this.dialogVisible = false;
                this.initCases();
              }
            });
          }
        })
      } else {
        this.$refs['caseForm'].validate(valid => {
          if (valid) {
            this.postRequest('/treatment/case/', this.tCase).then(resp => {
              if (resp) {
                this.dialogVisible = false;
                this.initCases();
              }
            });
          }
        })
      }
    },
    sizeChange(size) {
      this.size = size;
      this.initCases();
    },
    currentChange(currentPage) {
      this.currentPage = currentPage;
      this.initCases();
    },
    showAddCaseView() {
      this.title = '添加就诊记录';
      this.tCase = {
        tcId: null,
        fpatientId: '',
        mpatientId: '',
        beginDate: '',
        endDate: '',
        rfid: '',
        step: '',
        state: '',
        cycleNum: '',
        description: '',
        comment: ''
      };
      this.dialogVisible = true;
    },
    initCases(type) {
      this.loading = true;
      let url = '/treatment/case/?currentPage=' + this.currentPage + '&size=' + this.size;
      if (type && type == 'advanced') {
        if (this.searchValue.tcId) {
          url += '&tcId=' + this.searchValue.tcId;
        }
        if (this.searchValue.fpatientId) {
          url += '&fpatientId=' + this.searchValue.fpatientId;
        }
        if (this.searchValue.mpatientId) {
          url += '&mpatientId=' + this.searchValue.mpatientId;
        }
        if (this.searchValue.beginDateScope) {
          url += '&beginDateScope=' + this.searchValue.beginDateScope;
        }
        if (this.searchValue.endDateScope) {
          url += '&endDateScope=' + this.searchValue.endDateScope;
        }
        if (this.searchValue.rfid) {
          url += '&rfid=' + this.searchValue.rfid;
        }
        if (this.searchValue.step) {
          url += '&step=' + this.searchValue.step;
        }
        if (this.searchValue.state) {
          url += '&state=' + this.searchValue.state;
        }
        if (this.searchValue.cycleNum) {
          url += '&cycleNum=' + this.searchValue.cycleNum;
        }
      }else {
        url += '&tcId=' + this.caseId;
      }
      this.getRequest(url).then(resp => {
        this.loading = false;
        if (resp) {
          this.cases = resp.data;
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