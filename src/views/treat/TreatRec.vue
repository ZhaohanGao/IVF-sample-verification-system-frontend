<template>
  <div>
    <div>
      <div style="display: flex; justify-content: space-between">
        <div>
          <el-input style="width: 300px; margin-right: 10px"
                    prefix-icon="el-icon-search"
                    v-model="recId"
                    @keydown.enter.native="initRecs"
                    clearable
                    :disabled="showAdvanceSearchVisible"
                    @clear="initRecs"
                    placeholder="请输入就诊记录ID进行搜索..."></el-input>
          <el-button type="primary" icon="el-icon-search" @click="initRecs" :disabled="showAdvanceSearchVisible">搜索
          </el-button>
          <el-button type="primary" @click="showAdvanceSearchVisible=!showAdvanceSearchVisible">
            <i :class="showAdvanceSearchVisible?'fa fa-angle-double-up':'fa fa-angle-double-down'"
               aria-hidden="true"></i>
            高级搜索
          </el-button>
        </div>
        <div>
          <el-button type="primary" icon="el-icon-plus" @click="showAddRecView">添加记录</el-button>
        </div>
      </div>
    </div>
    <transition name="slide-fade">
      <div v-show="showAdvanceSearchVisible"
           style="border: 1px solid #409eff; border-radius: 5px; box-sizing: border-box; padding: 5px; margin: 10px 0px">
        <el-row style="margin-bottom: 10px">
          <el-col :span="6">
            患者编号:
            <el-input size="mini" prefix-icon="el-icon-edit" style="width: 160px" v-model="searchValue.patientId"
                      placeholder=""></el-input>
          </el-col>
          <el-col :span="6">
            医生编号:
            <el-input size="mini" prefix-icon="el-icon-edit" style="width: 160px" v-model="searchValue.docId"
                      placeholder=""></el-input>
          </el-col>
          <el-col :span="6">
            就诊项目:
            <el-input size="mini" prefix-icon="el-icon-edit" style="width: 180px" v-model="searchValue.treatmentProgram"
                      placeholder=""></el-input>
          </el-col>
          <el-col :span="6">
            处方项目:
            <el-input size="mini" prefix-icon="el-icon-edit" style="width: 180px" v-model="searchValue.prescription"
                      placeholder=""></el-input>
          </el-col>
        </el-row>
        <el-row style="margin-bottom: 10px">
          <el-col :span="12">
            就诊时间:
            <el-date-picker
                v-model="searchValue.trDateScope"
                value-format="yyyy-MM-dd HH:mm:ss"
                unlink-panels
                size:mini
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间">
            </el-date-picker>
          </el-col>
          <el-col :span="8" :rule="rules">
            费用范围:
            <el-input size="mini" prefix-icon="el-icon-edit" style="width: 140px"
                      v-model="searchValue.feeScope1"></el-input>
            ~
            <el-input size="mini" prefix-icon="el-icon-edit" style="width: 140px"
                      v-model="searchValue.feeScope2"></el-input>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="5" :offset="18">
            <el-button size="mini" @click="showAdvanceSearchVisible=!showAdvanceSearchVisible">取消</el-button>
            <el-button @click="initRecs('advanced')" size="mini" icon="el-icon-search" type="primary">搜索</el-button>
          </el-col>
        </el-row>
      </div>
    </transition>
    <div style="margin-top: 10px">
      <el-table
          :data="recs"
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
            prop="trId"
            label="就诊编号"
            align="center"
            fixed="left"
            width="110">
        </el-table-column>
        <el-table-column
            prop="patientId"
            label="患者编号"
            align="center"
            width="110">
        </el-table-column>
        <el-table-column
            prop="patient.name"
            label="患者姓名"
            align="center"
            width="110">
        </el-table-column>
        <el-table-column
            prop="docId"
            label="医生编号"
            align="center"
            width="110">
        </el-table-column>
        <el-table-column
            prop="treatmentProgram"
            label="就诊项目"
            align="center"
            width="170">
        </el-table-column>
        <el-table-column
            prop="prescription"
            label="处方项目"
            align="center"
            width="170">
        </el-table-column>
        <el-table-column
            prop="trDate"
            label="就诊时间"
            align="center"
            width="170">
        </el-table-column>
        <el-table-column
            prop="fee"
            label="费用"
            align="center"
            width="140">
          <template slot-scope="scope">
            {{ numFilter(scope.row.fee) }}
          </template>
        </el-table-column>
        <el-table-column
            label="操作"
            align="center"
            fixed="right"
            width="100">
          <template slot-scope="scope">
            <el-button @click="showEditRecView(scope.row)" style="padding: 3px" size="mini">编辑</el-button>
            <el-button @click="deleteRec(scope.row)" style="padding: 3px" size="mini" type="danger">删除</el-button>
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
        <el-form ref="recForm" :model="rec" :rules="rules">
          <el-row>
            <el-col :span="8">
              <el-form-item label="患者编号:" prop="patientId">
                <el-input size="mini" prefix-icon="el-icon-edit" style="width: 170px" v-model="rec.patientId"
                          placeholder="请输入患者编号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="医生编号:" prop="docId">
                <el-input size="mini" prefix-icon="el-icon-edit" style="width: 240px" v-model="rec.docId"
                          placeholder="请输入医生编号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="就诊项目:" prop="treatmentProgram">
                <el-input size="mini" prefix-icon="el-icon-edit" style="width: 200px" v-model="rec.treatmentProgram"
                          placeholder="请输入就诊项目"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="处方项目:" prop="prescription">
                <el-input size="mini" prefix-icon="el-icon-edit" style="width: 170px" v-model="rec.prescription"
                          placeholder="请输入处方项目"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="就诊时间:" prop="trDate">
                <el-date-picker
                    v-model="rec.trDate"
                    type="datetime"
                    size="mini"
                    style="width: 240px"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="就诊时间">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="费用:" prop="fee">
                <el-input size="mini" prefix-icon="el-icon-edit" style="width: 227px" v-model="rec.fee"
                          placeholder="请输入费用">
                  <template slot-scope="scope">
                    {{ numFilter(scope.row.fee) }}
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="doAddRec">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "TreatRec",
  data() {
    return {
      selections: [],
      searchValue: {
        trId: '',
        patientId: '',
        docId: '',
        treatmentProgram: '',
        prescription: '',
        trDateScope: '',
        feeScope1: null,
        feeScope2: null
      },
      showAdvanceSearchVisible: false,
      title: '',
      recs: [],
      loading: false,
      total: 0,
      currentPage: 1,
      size: 10,
      recId: '',
      dialogVisible: false,
      rec: {
        trId: null,
        patientId: '',
        docId: '',
        treatmentProgram: '',
        prescription: '',
        trDate: '',
        fee: '',
      },
      rules: {
        patientId: [{required: true, message: '请输入患者编号', trigger: 'blur'}],
        docId: [{required: true, message: '请输入医生编号', trigger: 'blur'}],
        treatmentProgram: [{required: true, message: '请输入就诊项目', trigger: 'blur'}],
        prescription: [{required: true, message: '请输入处方项目', trigger: 'blur'}],
        trDate: [{required: true, message: '请输入就诊时间', trigger: 'blur'}],
        fee: [{required: true, message: '请输入费用', trigger: 'blur'},
              { validator: this.validateFee, trigger: 'blur' },],
      }
    }
  },
  mounted() {
    this.initRecs();
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
        let trIds = '?';
        this.selections.forEach(item => {
          trIds += 'trIds=' + item.trId + '&';
        })
        this.deleteRequest('/treatment/rec/' + trIds).then(resp => {
          if (resp) {
            this.initRecs();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    showEditRecView(data) {
      this.title = '编辑就诊记录';
      this.rec = data;
      this.dialogVisible = true;
    },
    deleteRec(data) {
      this.$confirm('此操作将永久删除' + data.trId + '号就诊记录，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest('/treatment/rec/' + data.trId).then(resp => {
          if (resp) {
            this.initRecs();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    doAddRec() {
      if (this.rec.trId) {
        this.$refs['recForm'].validate(valid => {
          if (valid) {
            this.putRequest('/treatment/rec/', this.rec).then(resp => {
              if (resp) {
                this.dialogVisible = false;
                this.initRecs();
              }
            });
          }
        })
      } else {
        this.$refs['recForm'].validate(valid => {
          if (valid) {
            this.postRequest('/treatment/rec/', this.rec).then(resp => {
              if (resp) {
                this.dialogVisible = false;
                this.initRecs();
              }
            });
          }
        })
      }
    },
    sizeChange(size) {
      this.size = size;
      this.initRecs();
    },
    currentChange(currentPage) {
      this.currentPage = currentPage;
      this.initRecs();
    },
    showAddRecView() {
      this.title = '添加就诊记录';
      this.rec = {
        trId: null,
        patientId: '',
        docId: '',
        treatmentProgram: '',
        prescription: '',
        trDate: '',
        fee: ''
      };
      this.dialogVisible = true;
    },
    initRecs(type) {
      this.loading = true;
      let url = '/treatment/rec/?currentPage=' + this.currentPage + '&size=' + this.size;
      if (type && type == 'advanced') {
        if (this.searchValue.trId) {
          url += '&trId=' + this.searchValue.trId;
        }
        if (this.searchValue.patientId) {
          url += '&patientId=' + this.searchValue.patientId;
        }
        if (this.searchValue.docId) {
          url += '&docId=' + this.searchValue.docId;
        }
        if (this.searchValue.treatmentProgram) {
          url += '&treatmentProgram=' + this.searchValue.treatmentProgram;
        }
        if (this.searchValue.prescription) {
          url += '&prescription=' + this.searchValue.prescription;
        }
        if (this.searchValue.trDateScope) {
          url += '&trDateScope=' + this.searchValue.trDateScope;
        }
        if (this.searchValue.feeScope1) {
          url += '&feeScope1=' + this.searchValue.feeScope1;
        }
        if (this.searchValue.feeScope2) {
          url += '&feeScope2=' + this.searchValue.feeScope2;
        }
      }else {
        url += '&trId=' + this.recId;
      }
      this.getRequest(url).then(resp => {
        this.loading = false;
        if (resp) {
          this.recs = resp.data;
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