<template>
  <div>
    <div>
      <div style="display: flex; justify-content: space-between">
        <div>
          <el-input style="width: 300px; margin-right: 10px"
                    prefix-icon="el-icon-search"
                    v-model="logId"
                    @keydown.enter.native="initLogs"
                    clearable
                    :disabled="showAdvanceSearchVisible"
                    @clear="initLogs"
                    placeholder="请输入日志ID进行搜索..."></el-input>
          <el-button type="primary" icon="el-icon-search" @click="initLogs" :disabled="showAdvanceSearchVisible">搜索
          </el-button>
          <el-button type="primary" @click="showAdvanceSearchVisible=!showAdvanceSearchVisible">
            <i :class="showAdvanceSearchVisible?'fa fa-angle-double-up':'fa fa-angle-double-down'"
               aria-hidden="true"></i>
            高级搜索
          </el-button>
        </div>
        <div>
          <el-button type="primary" icon="el-icon-plus" @click="showAddLogView">添加日志</el-button>
        </div>
      </div>
    </div>
    <transition name="slide-fade">
      <div v-show="showAdvanceSearchVisible"
           style="border: 1px solid #409eff; border-radius: 5px; box-sizing: border-box; padding: 5px; margin: 10px 0px">
        <el-row style="margin-bottom: 10px">
          <el-col :span="7">
            核对类型:
            <el-input size="mini" prefix-icon="el-icon-edit" style="width: 150px" v-model="searchValue.checkType"
                      placeholder=""></el-input>
          </el-col>
          <el-col :span="10">
            时间:
            <el-date-picker
                v-model="searchValue.dateTimeScope"
                value-format="yyyy-MM-dd HH:mm:ss"
                unlink-panels
                size:mini
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间">
            </el-date-picker>
          </el-col>
        </el-row>
        <el-row style="margin-bottom: 10px">
          <el-col :span="8">
            芯片1编号:
            <el-input size="mini" prefix-icon="el-icon-edit" style="width: 150px" v-model="searchValue.rfid1"
                      placeholder=""></el-input>
          </el-col>
          <el-col :span="16">
            芯片1记录时间:
            <el-date-picker
                v-model="searchValue.rfid1RectimeScope"
                value-format="yyyy-MM-dd HH:mm:ss"
                unlink-panels
                size:mini
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间">
            </el-date-picker>
          </el-col>
        </el-row>
        <el-row style="margin-bottom: 10px">
          <el-col :span="8">
            芯片2编号:
            <el-input size="mini" prefix-icon="el-icon-edit" style="width: 150px" v-model="searchValue.rfid2"
                      placeholder=""></el-input>
          </el-col>
          <el-col :span="16">
            芯片2记录时间:
            <el-date-picker
                v-model="searchValue.rfid2RectimeScope"
                value-format="yyyy-MM-dd HH:mm:ss"
                unlink-panels
                size:mini
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间">
            </el-date-picker>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="15">
            结果:
            <el-input size="mini" prefix-icon="el-icon-edit" style="width: 192px" v-model="searchValue.results"
                      placeholder=""></el-input>
          </el-col>
          <el-col :span="5" :offset="4">
            <el-button size="mini"  @click="showAdvanceSearchVisible=!showAdvanceSearchVisible">取消</el-button>
            <el-button @click="initLogs('advanced')" size="mini" icon="el-icon-search" type="primary">搜索</el-button>
          </el-col>
        </el-row>
      </div>
    </transition>
    <div style="margin-top: 10px">
      <el-table
          :data="logs"
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
            prop="logId"
            label="日志编号"
            align="center"
            fixed="left"
            width="120">
        </el-table-column>
        <el-table-column
            prop="checkType"
            label="核对类型"
            align="center"
            width="120">
        </el-table-column>
        <el-table-column
            prop="dateTime"
            label="时间"
            align="center"
            width="180">
        </el-table-column>
        <el-table-column
            prop="rfid1"
            label="芯片1编号"
            align="center"
            width="130">
        </el-table-column>
        <el-table-column
            prop="rfid1Rectime"
            label="芯片1记录时间"
            align="center"
            width="180">
        </el-table-column>
        <el-table-column
            prop="rfid2"
            label="芯片2编号"
            align="center"
            width="130">
        </el-table-column>
        <el-table-column
            prop="rfid2Rectime"
            label="芯片2记录时间"
            align="center"
            width="180">
        </el-table-column>
        <el-table-column
            prop="results"
            label="结果"
            align="center"
            width="160">
        </el-table-column>
        <el-table-column
            prop="resComment"
            label="结果描述"
            align="center"
            width="240">
        </el-table-column>
        <el-table-column
            label="操作"
            align="center"
            fixed="right"
            width="100">
          <template slot-scope="scope">
            <el-button @click="showEditLogView(scope.row)" style="padding: 3px" size="mini">编辑</el-button>
            <el-button @click="deleteLog(scope.row)" style="padding: 3px" size="mini" type="danger">删除</el-button>
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
        <el-form ref="logForm" :model="log" :rules="rules">
          <el-row>
            <el-col :span="8">
              <el-form-item label="核对类型:" prop="checkType">
                <el-input size="mini" prefix-icon="el-icon-edit" style="width: 180px" v-model="log.checkType"
                          placeholder="请输入核对类型"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="时间:" prop="dateTime">
                <el-date-picker
                    v-model="log.dateTime"
                    type="datetime"
                    size="mini"
                    style="width: 240px"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="时间">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="芯片1编号:" prop="rfid1">
                <el-input size="mini" prefix-icon="el-icon-edit" style="width: 160px" v-model="log.rfid1"
                          placeholder="请输入芯片1编号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="16">
              <el-form-item label="芯片1记录时间:" prop="rfid1Rectime">
                <el-date-picker
                    v-model="log.rfid1Rectime"
                    type="datetime"
                    size="mini"
                    style="width: 240px"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="芯片1记录时间">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="芯片2编号:" prop="rfid2">
                <el-input size="mini" prefix-icon="el-icon-edit" style="width: 210px" v-model="log.rfid2"
                          placeholder="请输入芯片2编号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="16">
              <el-form-item label="芯片2记录时间:" prop="rfid2Rectime">
                <el-date-picker
                    v-model="log.rfid2Rectime"
                    type="datetime"
                    size="mini"
                    style="width: 240px"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="芯片2记录时间">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="结果:" prop="results">
                <el-input size="mini" prefix-icon="el-icon-edit" style="width: 150px" v-model="log.results"
                          placeholder="请输入结果"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="18">
              <el-form-item label="结果描述:" prop="number">
                <el-input type="textarea" size="mini" prefix-icon="el-icon-edit" style="width: 380px" v-model="log.resComment"
                          placeholder="请输入结果描述"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="doAddLog">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "WitLog",
  data() {
    return {
      selections:[],
      searchValue: {
        logId: '',
        checkType: '',
        dateTimeScope: null,
        rfid1: '',
        rfid1RectimeScope: null,
        rfid2: '',
        rfid2RectimeScope: null,
        results: '',
      },
      showAdvanceSearchVisible: false,
      title: '',
      logs: [],
      loading: false,
      total: 0,
      currentPage: 1,
      size: 10,
      logId: '',
      dialogVisible: false,
      log: {
        logId: null,
        checkType: '',
        dateTime: '',
        rfid1: '',
        rfid1Rectime: '',
        rfid2: '',
        rfid2Rectime: '',
        results: '',
        resComment: ''
      },
      rules: {
        checkType: [{required: true, message: '请输入核对类型', trigger: 'blur'}],
        dateTime: [{required: true, message: '请输入时间', trigger: 'blur'}],
        rfid1: [{required: true, message: '请输入芯片1编号', trigger: 'blur'}],
        rfid1Rectime: [{required: true, message: '请输入芯片1记录时间', trigger: 'blur'}],
        rfid2: [{required: true, message: '请输入芯片2编号', trigger: 'blur'}],
        rfid2Rectime: [{required: true, message: '请输入芯片2记录时间', trigger: 'blur'}],
        results: [{required: true, message: '请输入结果', trigger: 'blur'}]
      }
    }
  },
  mounted() {
    this.initLogs();
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
        let logIds = '?';
        this.selections.forEach(item => {
          logIds += 'logIds=' + item.logId + '&';
        })
        this.deleteRequest('/witness/log/' + logIds).then(resp => {
          if (resp) {
            this.initLogs();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    showEditLogView(data) {
      this.title = '编辑日志信息';
      this.log = data;
      this.dialogVisible = true;
    },
    deleteLog(data) {
      this.$confirm('此操作将永久删除' + data.logId + '号日志，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest('/witness/log/' + data.logId).then(resp => {
          if (resp) {
            this.initLogs();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    doAddLog() {
      if (this.log.logId) {
        this.$refs['logForm'].validate(valid => {
          if (valid) {
            this.putRequest('/witness/log/', this.log).then(resp => {
              if (resp) {
                this.dialogVisible = false;
                this.initLogs();
              }
            });
          }
        })
      } else {
        this.$refs['logForm'].validate(valid => {
          if (valid) {
            this.postRequest('/witness/log/', this.log).then(resp => {
              if (resp) {
                this.dialogVisible = false;
                this.initLogs();
              }
            });
          }
        })
      }
    },
    sizeChange(size) {
      this.size = size;
      this.initLogs();
    },
    currentChange(currentPage) {
      this.currentPage = currentPage;
      this.initLogs();
    },
    showAddLogView() {
      this.title = '添加日志';
      this.log = {
        logId: null,
        checkType: '',
        dateTime: '',
        rfid1: '',
        rfid1Rectime: '',
        rfid2: '',
        rfid2Rectime: '',
        results: '',
        resComment: ''
      };
      this.dialogVisible = true;
    },
    initLogs(type) {
      this.loading = true;
      let url = '/witness/log/?currentPage=' + this.currentPage + '&size=' + this.size;
      if (type && type == 'advanced') {
        if (this.searchValue.checkType) {
          url += '&checkType=' + this.searchValue.checkType;
        }
        if (this.searchValue.dateTimeScope) {
          url += '&dateTimeScope=' + this.searchValue.dateTimeScope;
        }
        if (this.searchValue.rfid1) {
          url += '&rfid1=' + this.searchValue.rfid1;
        }
        if (this.searchValue.rfid1RectimeScope) {
          url += '&rfid1RectimeScope=' + this.searchValue.rfid1RectimeScope;
        }
        if (this.searchValue.rfid2) {
          url += '&rfid2=' + this.searchValue.rfid2;
        }
        if (this.searchValue.rfid2RectimeScope) {
          url += '&rfid2RectimeScope=' + this.searchValue.rfid2RectimeScope;
        }
        if (this.searchValue.results) {
          url += '&results=' + this.searchValue.results;
        }
      } else {
        url += '&logId=' + this.logId;
      }
      this.getRequest(url).then(resp => {
        this.loading = false;
        if (resp) {
          this.logs = resp.data;
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