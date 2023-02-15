<template>
  <div>
    <div>
      <div style="display: flex; justify-content: space-between">
        <div>
          <el-input style="width: 300px; margin-right: 10px"
                    prefix-icon="el-icon-search"
                    v-model="eggId"
                    @keydown.enter.native="initEggs"
                    clearable
                    :disabled="showAdvanceSearchVisible"
                    @clear="initEggs"
                    placeholder="请输入样本ID进行搜索..."></el-input>
          <el-button type="primary" icon="el-icon-search" @click="initEggs" :disabled="showAdvanceSearchVisible">搜索
          </el-button>
          <el-button type="primary" @click="showAdvanceSearchVisible=!showAdvanceSearchVisible">
            <i :class="showAdvanceSearchVisible?'fa fa-angle-double-up':'fa fa-angle-double-down'"
               aria-hidden="true"></i>
            高级搜索
          </el-button>
        </div>
        <div>
          <el-button type="primary" icon="el-icon-plus" @click="showAddEggView">添加样本</el-button>
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
            存放器皿编号:
            <el-input size="mini" prefix-icon="el-icon-edit" style="width: 150px" v-model="searchValue.saveCount"
                      placeholder=""></el-input>
          </el-col>
          <el-col :span="6">
            培养箱编号:
            <el-input size="mini" prefix-icon="el-icon-edit" style="width: 160px" v-model="searchValue.saveLocation"
                      placeholder=""></el-input>
          </el-col>
          <el-col :span="6">
            液氮冷冻罐编号:
            <el-input size="mini" prefix-icon="el-icon-edit" style="width: 150px" v-model="searchValue.refStoreTankId"
                      placeholder=""></el-input>
          </el-col>
        </el-row>
        <el-row style="margin-bottom: 10px">
          <el-col :span="8">
            培养阶段:
            <el-input size="mini" prefix-icon="el-icon-edit" style="width: 180px" v-model="searchValue.stage"
                      placeholder=""></el-input>
          </el-col>
          <el-col :span="8">
            受精状态:
            <el-radio-group v-model="searchValue.isOosed">
              <el-radio label="已受精">已受精</el-radio>
              <el-radio label="未受精">未受精</el-radio>
            </el-radio-group>
          </el-col>
          <el-col :span="8">
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
            <el-button size="mini"  @click="showAdvanceSearchVisible=!showAdvanceSearchVisible">取消</el-button>
            <el-button @click="initEggs('advanced')" size="mini" icon="el-icon-search" type="primary">搜索</el-button>
          </el-col>
        </el-row>
      </div>
    </transition>
    <div style="margin-top: 10px">
      <el-table
          :data="eggs"
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
            prop="seId"
            label="卵子编号"
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
            prop="saveCount"
            label="存放器皿编号"
            align="center"
            width="110">
        </el-table-column>
        <el-table-column
            prop="saveLocation"
            label="培养箱编号"
            align="center"
            width="90">
        </el-table-column>
        <el-table-column
            prop="refStoreTankId"
            label="液氮冷冻罐编号"
            align="center"
            width="120">
        </el-table-column>
        <el-table-column
            prop="stage"
            label="所处于的培养阶段"
            align="center"
            width="120">
        </el-table-column>
        <el-table-column
            prop="isOosed"
            label="受精状态"
            align="center"
            width="100">
        </el-table-column>
        <el-table-column
            prop="collectDate"
            label="采集时间"
            align="center"
            width="140">
        </el-table-column>
        <el-table-column
            prop="expId"
            label="实验编号"
            align="center"
            width="80">
        </el-table-column>
        <el-table-column
            prop="number"
            label="数量"
            align="center"
            width="80">
        </el-table-column>
        <el-table-column
            prop="conditions"
            label="状态"
            align="center"
            width="80">
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
            <el-button @click="showEditEggView(scope.row)" style="padding: 3px" size="mini">编辑</el-button>
            <el-button @click="deleteEgg(scope.row)" style="padding: 3px" size="mini" type="danger">删除</el-button>
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
        <el-form ref="eggForm" :model="egg" :rules="rules">
          <el-row>
            <el-col :span="5">
              <el-form-item label="诊案编号:" prop="tcId">
                <el-input size="mini" prefix-icon="el-icon-edit" style="width: 130px" v-model="egg.tcId"
                          placeholder="请输入诊案编号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="实验编号:" prop="expId">
                <el-input size="mini" prefix-icon="el-icon-edit" style="width: 180px" v-model="egg.expId"
                          placeholder="请输入实验编号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="存放器皿编号:" prop="saveCount">
                <el-input size="mini" prefix-icon="el-icon-edit" style="width: 200px" v-model="egg.saveCount"
                          placeholder="请输入存放器皿编号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="培养箱编号:" prop="saveLocation">
                <el-input size="mini" prefix-icon="el-icon-edit" style="width: 160px" v-model="egg.saveLocation"
                          placeholder="请输入培养箱编号"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="液氮冷冻罐编号:" prop="refStoreTankId">
                <el-input size="mini" prefix-icon="el-icon-edit" style="width: 192px" v-model="egg.refStoreTankId"
                          placeholder="请输入液氮冷冻罐编号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="培养阶段:" prop="stage">
                <el-input size="mini" prefix-icon="el-icon-edit" style="width: 210px" v-model="egg.stage"
                          placeholder="请输入培养阶段"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="受精状态:" prop="isOosed">
                <el-radio-group v-model="egg.isOosed" style="margin-top: 9px">
                  <el-radio label="已受精">已受精</el-radio>
                  <el-radio label="未受精">未受精</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="采集时间:" prop="collectDate">
                <el-date-picker
                    v-model="egg.collectDate"
                    type="datetime"
                    size="mini"
                    style="width: 240px"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="采集时间">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="实验编号:" prop="expId">
                <el-input size="mini" prefix-icon="el-icon-edit" style="width: 150px" v-model="egg.expId"
                          placeholder="请输入实验编号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="数量:" prop="number">
                <el-input size="mini" prefix-icon="el-icon-edit" style="width: 150px" v-model="egg.number"
                          placeholder="请输入数量"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="状态:" prop="conditions">
                <el-input size="mini" prefix-icon="el-icon-edit" style="width: 157px" v-model="egg.conditions"
                          placeholder="请输入状态"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="备注:" prop="comment">
                <el-input type="textarea" size="mini" prefix-icon="el-icon-edit" style="width: 1020px"
                          v-model="egg.comment" placeholder="请输入备注"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="doAddEgg">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "InfoEgg",
  data() {
    return {
      selections:[],
      searchValue: {
        seId: '',
        tcId: '',
        saveCount: '',
        saveLocation: '',
        refStoreTankId: '',
        stage: '',
        isOosed: null,
        collectDateScope: null,
        expId: '',
      },
      showAdvanceSearchVisible: false,
      title: '',
      eggs: [],
      loading: false,
      total: 0,
      currentPage: 1,
      size: 10,
      eggId: '',
      dialogVisible: false,
      egg: {
        seId: null,
        tcId: '',
        saveCount: '',
        saveLocation: '',
        refStoreTankId: '',
        stage: '',
        isOosed: null,
        collectDate: '',
        expId: '',
        number: '',
        conditions: '',
        comment: ''
      },
      rules: {
        tcId: [{required: true, message: '请输入所属诊案编号', trigger: 'blur'}],
        saveCount: [{required: true, message: '请输入存放器皿编号', trigger: 'blur'}],
        saveLocation: [{required: true, message: '请输入培养箱编号', trigger: 'blur'}],
        refStoreTankId: [{required: true, message: '请输入液氮冷冻罐编号', trigger: 'blur'}],
        stage: [{required: true, message: '请输入所处于的培养阶段', trigger: 'blur'}],
        isOosed: [{required: true, message: '请输入受精状态', trigger: 'blur'}],
        collectDate: [{required: true, message: '请输入采集日期', trigger: 'blur'}],
        expId: [{required: true, message: '请输入实验编号', trigger: 'blur'}],
        number: [{required: true, message: '请输入数量', trigger: 'blur'}],
        conditions: [{required: true, message: '请输入状态', trigger: 'blur'}],
      }
    }
  },
  mounted() {
    this.initEggs();
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
        let seIds = '?';
        this.selections.forEach(item => {
          seIds += 'seIds=' + item.seId + '&';
        })
        this.deleteRequest('/info/egg/' + seIds).then(resp => {
          if (resp) {
            this.initEggs();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    showEditEggView(data) {
      this.title = '编辑样本信息';
      this.egg = data;
      this.dialogVisible = true;
    },
    deleteEgg(data) {
      this.$confirm('此操作将永久删除' + data.seId + '号卵子样本，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest('/info/egg/' + data.seId).then(resp => {
          if (resp) {
            this.initEggs();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    doAddEgg() {
      if (this.egg.seId) {
        this.$refs['eggForm'].validate(valid => {
          if (valid) {
            this.putRequest('/info/egg/', this.egg).then(resp => {
              if (resp) {
                this.dialogVisible = false;
                this.initEggs();
              }
            });
          }
        })
      } else {
        this.$refs['eggForm'].validate(valid => {
          if (valid) {
            this.postRequest('/info/egg/', this.egg).then(resp => {
              if (resp) {
                this.dialogVisible = false;
                this.initEggs();
              }
            });
          }
        })
      }
    },
    sizeChange(size) {
      this.size = size;
      this.initEggs();
    },
    currentChange(currentPage) {
      this.currentPage = currentPage;
      this.initEggs();
    },
    showAddEggView() {
      this.title = '添加样本';
      this.egg = {
        seId: null,
        tcId: '',
        saveCount: '',
        saveLocation: '',
        refStoreTankId: '',
        stage: '',
        isOosed: null,
        collectDate: '',
        expId: '',
        number: '',
        conditions: '',
        comment: ''
      };
      this.dialogVisible = true;
    },
    initEggs(type) {
      this.loading = true;
      let url = '/info/egg/?currentPage=' + this.currentPage + '&size=' + this.size;
      if (type && type == 'advanced') {
        if (this.searchValue.tcId) {
          url += '&tcId=' + this.searchValue.tcId;
        }
        if (this.searchValue.saveCount) {
          url += '&saveCount=' + this.searchValue.saveCount;
        }
        if (this.searchValue.refStoreTankId) {
          url += '&refStoreTankId=' + this.searchValue.refStoreTankId;
        }
        if (this.searchValue.stage) {
          url += '&stage=' + this.searchValue.stage;
        }
        if (this.searchValue.isOosed) {
          url += '&isOosed=' + this.searchValue.isOosed;
        }
        if (this.searchValue.collectDateScope) {
          url += '&collectDateScope=' + this.searchValue.collectDateScope;
        }
        if (this.searchValue.expId) {
          url += '&expId=' + this.searchValue.expId;
        }
      } else {
        url += '&seId=' + this.eggId;
      }
      this.getRequest(url).then(resp => {
        this.loading = false;
        if (resp) {
          this.eggs = resp.data;
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