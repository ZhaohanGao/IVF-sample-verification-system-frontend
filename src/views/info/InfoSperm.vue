<template>
  <div>
    <div>
      <div style="display: flex; justify-content: space-between">
        <div>
          <el-input style="width: 300px; margin-right: 10px"
                    prefix-icon="el-icon-search"
                    v-model="spermId"
                    @keydown.enter.native="initSperms"
                    clearable
                    :disabled="showAdvanceSearchVisible"
                    @clear="initSperms"
                    placeholder="请输入样本ID进行搜索..."></el-input>
          <el-button type="primary" icon="el-icon-search" @click="initSperms" :disabled="showAdvanceSearchVisible">搜索
          </el-button>
          <el-button type="primary" @click="showAdvanceSearchVisible=!showAdvanceSearchVisible">
            <i :class="showAdvanceSearchVisible?'fa fa-angle-double-up':'fa fa-angle-double-down'"
               aria-hidden="true"></i>
            高级搜索
          </el-button>
        </div>
        <div>
          <el-button type="primary" icon="el-icon-plus" @click="showAddSpermView">添加样本</el-button>
        </div>
      </div>
    </div>
    <transition name="slide-fade">
      <div v-show="showAdvanceSearchVisible"
           style="border: 1px solid #409eff; border-radius: 5px; box-sizing: border-box; padding: 5px; margin: 10px 0px">
        <el-row style="margin-bottom: 10px">
          <el-col :span="6">
            诊案编号:
            <el-input size="mini" prefix-icon="el-icon-edit" style="width: 150px" v-model="searchValue.tcId"
                      placeholder=""></el-input>
          </el-col>
          <el-col :span="6">
            存放位置:
            <el-input size="mini" prefix-icon="el-icon-edit" style="width: 160px" v-model="searchValue.position"
                      placeholder=""></el-input>
          </el-col>
          <el-col :span="6">
            存放容器编号:
            <el-input size="mini" prefix-icon="el-icon-edit" style="width: 150px" v-model="searchValue.containerId"
                      placeholder=""></el-input>
          </el-col>
          <el-col :span="6">
            实验编号:
            <el-input size="mini" prefix-icon="el-icon-edit" style="width: 180px" v-model="searchValue.expId"
                      placeholder=""></el-input>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="15">
            采集时间:
            <el-date-picker
                v-model="searchValue.collectDateScope"
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
            <el-button @click="initSperms('advanced')" size="mini" icon="el-icon-search" type="primary">搜索</el-button>
          </el-col>
        </el-row>
      </div>
    </transition>
    <div style="margin-top: 10px">
      <el-table
          :data="sperms"
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
            prop="ssId"
            label="精子编号"
            align="center"
            fixed="left"
            width="80">
        </el-table-column>
        <el-table-column
            prop="tcId"
            label="诊案编号"
            align="center"
            width="80">
        </el-table-column>
        <el-table-column
            prop="position"
            label="存放位置"
            align="center"
            width="140">
        </el-table-column>
        <el-table-column
            prop="containerId"
            label="存放容器编号"
            align="center"
            width="130">
        </el-table-column>
        <el-table-column
            prop="collectDate"
            label="采集时间"
            align="center"
            width="150">
        </el-table-column>
        <el-table-column
            prop="expId"
            label="实验编号"
            align="center"
            width="130">
        </el-table-column>
        <el-table-column
            prop="conditions"
            label="状态"
            align="center"
            width="130">
        </el-table-column>
        <el-table-column
            prop="comment"
            label="备注"
            align="center"
            width="240">
        </el-table-column>
        <el-table-column
            label="操作"
            align="center"
            fixed="right"
            width="100">
          <template slot-scope="scope">
            <el-button @click="showEditSpermView(scope.row)" style="padding: 3px" size="mini">编辑</el-button>
            <el-button @click="deleteSperm(scope.row)" style="padding: 3px" size="mini" type="danger">删除</el-button>
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
        <el-form ref="spermForm" :model="sperm" :rules="rules">
          <el-row>
            <el-col :span="8">
              <el-form-item label="诊案编号:" prop="tcId">
                <el-input size="mini" prefix-icon="el-icon-edit" style="width: 220px" v-model="sperm.tcId"
                          placeholder="请输入诊案编号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="存放位置:" prop="position">
                <el-input size="mini" prefix-icon="el-icon-edit" style="width: 220px" v-model="sperm.position"
                          placeholder="请输入存放位置"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="存放容器编号:" prop="containerId">
                <el-input size="mini" prefix-icon="el-icon-edit" style="width: 165px" v-model="sperm.containerId"
                          placeholder="请输入存放容器编号"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="采集时间:" prop="collectDate">
                <el-date-picker
                    v-model="sperm.collectDate"
                    type="datetime"
                    size="mini"
                    style="width: 220px"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="采集时间">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="实验编号:" prop="expId">
                <el-input size="mini" prefix-icon="el-icon-edit" style="width: 220px" v-model="sperm.expId"
                          placeholder="请输入实验编号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="状态:" prop="conditions">
                <el-input size="mini" prefix-icon="el-icon-edit" style="width: 220px" v-model="sperm.conditions"
                          placeholder="请输入状态"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="备注:" prop="comment">
                <el-input type="textarea" size="mini" prefix-icon="el-icon-edit" style="width: 950px"
                          v-model="sperm.comment" placeholder="请输入备注"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="doAddSperm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "InfoSperm",
  data() {
    return {
      selections: [],
      searchValue: {
        ssId: '',
        tcId: '',
        position: '',
        containerId: '',
        collectDateScope: null,
        expId: '',
      },
      showAdvanceSearchVisible: false,
      title: '',
      sperms: [],
      loading: false,
      total: 0,
      currentPage: 1,
      size: 10,
      spermId: '',
      dialogVisible: false,
      sperm: {
        ssId: null,
        tcId: '',
        position: '',
        containerId: '',
        collectDate: '',
        expId: '',
        conditions: '',
        comment: ''
      },
      rules: {
        tcId: [{required: true, message: '请输入所属诊案编号', trigger: 'blur'}],
        position: [{required: true, message: '请输入存放位置', trigger: 'blur'}],
        containerId: [{required: true, message: '请输入存放容器编号', trigger: 'blur'}],
        collectDate: [{required: true, message: '请输入采集日期', trigger: 'blur'}],
        expId: [{required: true, message: '请输入实验编号', trigger: 'blur'}],
        conditions: [{required: true, message: '请输入状态', trigger: 'blur'}],
      }
    }
  },
  mounted() {
    this.initSperms();
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
        let ssIds = '?';
        this.selections.forEach(item => {
          ssIds += 'ssIds=' + item.ssId + '&';
        })
        this.deleteRequest('/info/sperm/' + ssIds).then(resp => {
          if (resp) {
            this.initSperms();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    showEditSpermView(data) {
      this.title = '编辑样本信息';
      this.sperm = data;
      this.dialogVisible = true;
    },
    deleteSperm(data) {
      this.$confirm('此操作将永久删除' + data.ssId + '号精子样本，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest('/info/sperm/' + data.ssId).then(resp => {
          if (resp) {
            this.initSperms();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    doAddSperm() {
      if (this.sperm.ssId) {
        this.$refs['spermForm'].validate(valid => {
          if (valid) {
            this.putRequest('/info/sperm/', this.sperm).then(resp => {
              if (resp) {
                this.dialogVisible = false;
                this.initSperms();
              }
            });
          }
        })
      } else {
        this.$refs['spermForm'].validate(valid => {
          if (valid) {
            this.postRequest('/info/sperm/', this.sperm).then(resp => {
              if (resp) {
                this.dialogVisible = false;
                this.initSperms();
              }
            });
          }
        })
      }
    },
    sizeChange(size) {
      this.size = size;
      this.initSperms();
    },
    currentChange(currentPage) {
      this.currentPage = currentPage;
      this.initSperms();
    },
    showAddSpermView() {
      this.title = '添加样本';
      this.sperm = {
        ssId: null,
        tcId: '',
        position: '',
        containerId: '',
        collectDate: '',
        expId: '',
        conditions: '',
        comment: ''
      };
      this.dialogVisible = true;
    },
    initSperms(type) {
      this.loading = true;
      let url = '/info/sperm/?currentPage=' + this.currentPage + '&size=' + this.size;
      if (type && type == 'advanced') {
        if (this.searchValue.tcId) {
          url += '&tcId=' + this.searchValue.tcId;
        }
        if (this.searchValue.position) {
          url += '&position=' + this.searchValue.position;
        }
        if (this.searchValue.containerId) {
          url += '&containerId=' + this.searchValue.containerId;
        }
        if (this.searchValue.collectDateScope) {
          url += '&collectDateScope=' + this.searchValue.collectDateScope;
        }
        if (this.searchValue.expId) {
          url += '&expId=' + this.searchValue.expId;
        }
      } else {
        url += '&ssId=' + this.spermId;


      }
      this.getRequest(url).then(resp => {
        this.loading = false;
        if (resp) {
          this.sperms = resp.data;
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