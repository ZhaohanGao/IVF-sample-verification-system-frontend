<template>
  <div>
    <div>
      <div style="display: flex; justify-content: space-between">
        <div>
          <el-input style="width: 300px; margin-right: 10px"
                    prefix-icon="el-icon-search"
                    v-model="patientId"
                    @keydown.enter.native="initPatients"
                    clearable
                    :disabled="showAdvanceSearchVisible"
                    @clear="initPatients"
                    placeholder="请输入患者ID进行搜索..."></el-input>
          <el-button type="primary" icon="el-icon-search" @click="initPatients" :disabled="showAdvanceSearchVisible">搜索
          </el-button>
          <el-button type="primary" @click="showAdvanceSearchVisible=!showAdvanceSearchVisible">
            <i :class="showAdvanceSearchVisible?'fa fa-angle-double-up':'fa fa-angle-double-down'"
               aria-hidden="true"></i>
            高级搜索
          </el-button>
        </div>
        <div>
          <el-button type="primary" icon="el-icon-plus" @click="showAddPatientView">添加患者</el-button>
        </div>
      </div>
    </div>
    <transition name="slide-fade">
      <div v-show="showAdvanceSearchVisible"
           style="border: 1px solid #409eff; border-radius: 5px; box-sizing: border-box; padding: 5px; margin: 10px 0px">
        <el-row style="margin-bottom: 10px">
          <el-col :span="6">
            身份证号:
            <el-input size="mini" prefix-icon="el-icon-edit" style="width: 190px" v-model="searchValue.citizenId"
                      placeholder=""></el-input>
          </el-col>
          <el-col :span="6">
            患者姓名:
            <el-input size="mini" prefix-icon="el-icon-edit" style="width: 180px" v-model="searchValue.name"
                      placeholder=""></el-input>
          </el-col>
          <el-col :span="6">
            性别:
            <el-radio-group v-model="searchValue.gender">
              <el-radio label="男">男</el-radio>
              <el-radio label="女">女</el-radio>
            </el-radio-group>
          </el-col>
          <el-col :span="6">
            籍贯:
            <el-input size="mini" prefix-icon="el-icon-edit" style="width: 188px" v-model="searchValue.nativePlace"
                      placeholder=""></el-input>
          </el-col>
        </el-row>
        <el-row style="margin-top: 10px">
          <el-col :span="6">
            联系地址:
            <el-input size="mini" prefix-icon="el-icon-edit" style="width: 190px" v-model="searchValue.address"
                      placeholder=""></el-input>
          </el-col>
          <el-col :span="11">
            出生日期:
            <el-date-picker
                v-model="searchValue.birthdayScope"
                value-format="yyyy-MM-dd"
                unlink-panels
                size:mini
                type="daterange"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间">
            </el-date-picker>
          </el-col>
          <el-col :span="6">
            配偶身份证号:
            <el-input size="mini" prefix-icon="el-icon-edit" style="width: 170px" v-model="searchValue.spouseId"
                      placeholder=""></el-input>
          </el-col>
        </el-row>
        <el-row style="margin-top: 6px">
          <el-col :span="6">
            配偶姓名:
            <el-input size="mini" prefix-icon="el-icon-edit" style="width: 190px" v-model="searchValue.spouse"
                      placeholder=""></el-input>
          </el-col>
          <el-col :span="5" :offset="12">
            <el-button size="mini" @click="showAdvanceSearchVisible=!showAdvanceSearchVisible">取消</el-button>
            <el-button @click="initPatients('advanced')" size="mini" icon="el-icon-search" type="primary">搜索
            </el-button>
          </el-col>
        </el-row>
      </div>
    </transition>
    <div style="margin-top: 10px">
      <el-table
          :data="patients"
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
            prop="ptId"
            label="患者编号"
            align="center"
            fixed="left"
            width="100">
        </el-table-column>
        <el-table-column
            prop="citizenId"
            label="身份证号"
            align="center"
            width="180">
        </el-table-column>
        <el-table-column
            prop="name"
            label="患者姓名"
            align="center"
            width="140">
        </el-table-column>
        <el-table-column
            prop="gender"
            label="性别"
            align="center"
            width="100">
        </el-table-column>
        <el-table-column
            prop="birthday"
            label="出生日期"
            align="center"
            width="150">
        </el-table-column>
        <el-table-column
            prop="nativePlace"
            label="籍贯"
            align="center"
            width="160">
        </el-table-column>
        <el-table-column
            prop="address"
            label="联系地址"
            align="center"
            width="240">
        </el-table-column>
        <el-table-column
            prop="spouseId"
            label="配偶身份证号"
            align="center"
            width="180">
        </el-table-column>
        <el-table-column
            prop="spouse"
            label="配偶姓名"
            align="center"
            width="140">
        </el-table-column>
        <el-table-column
            prop="medicalHistory"
            label="病史"
            align="center"
            width="240">
        </el-table-column>
        <el-table-column
            label="操作"
            align="center"
            fixed="right"
            width="100">
          <template slot-scope="scope">
            <el-button @click="showEditPatientView(scope.row)" style="padding: 3px" size="mini">编辑</el-button>
            <el-button @click="deletePatient(scope.row)" style="padding: 3px" size="mini" type="danger">删除</el-button>
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
        <el-form ref="patientForm" :model="patient" :rules="rules">
          <el-row>
            <el-col :span="8">
              <el-form-item label="身份证号:" prop="citizenId">
                <el-input size="mini" prefix-icon="el-icon-edit" style="width: 230px" v-model="patient.citizenId"
                          placeholder="请输入身份证号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="患者姓名:" prop="name">
                <el-input size="mini" prefix-icon="el-icon-edit" style="width: 237px" v-model="patient.name"
                          placeholder="请输入患者姓名"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="籍贯:" prop="nativePlace">
                <el-input size="mini" prefix-icon="el-icon-edit" style="width: 227px" v-model="patient.nativePlace"
                          placeholder="请输入籍贯"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="联系地址:" prop="address">
                <el-input size="mini" prefix-icon="el-icon-edit" style="width: 220px" v-model="patient.address"
                          placeholder="请输入联系地址"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="配偶身份证号:" prop="spouseId">
                <el-input size="mini" prefix-icon="el-icon-edit" style="width: 220px" v-model="patient.spouseId"
                          placeholder="请输入配偶身份证号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="配偶姓名:" prop="spouse">
                <el-input size="mini" prefix-icon="el-icon-edit" style="width: 200px" v-model="patient.spouse"
                          placeholder="请输入配偶姓名"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="病史:" prop="medicalHistory">
                <el-input type="textarea" size="mini" prefix-icon="el-icon-edit" style="width: 947px"
                          v-model="patient.medicalHistory" placeholder="请输入病史"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="doAddPatient">确 定</el-button>
          </span>
    </el-dialog>
  </div>
</template>

<script>
import { isCitizenId } from "../../components/validator/isCitizenId";

export default {
  name: "InfoPatient",
  data() {
    const checkCitizenId = (rule, value, callback) => {
      const errorMsg = isCitizenId(value);
      if (errorMsg != "") {
        callback(new Error(errorMsg));
      }else {
        callback();
      }
    };
    return {
      activeItemIndex: 0,
      patientItemName: [
        '身份证号',
        '患者姓名',
        '籍贯',
        '联系地址',
        '配偶身份证号',
        '配偶姓名',
        '病史'
      ],
      selections: [],
      searchValue: {
        citizenId: '',
        name: '',
        gender: '',
        birthdayScope: null,
        nativePlace: '',
        address: '',
        spouseId: '',
        spouse: ''
      },
      showAdvanceSearchVisible: false,
      title: '',
      patients: [],
      loading: false,
      total: 0,
      currentPage: 1,
      size: 10,
      patientId: '',
      dialogVisible: false,
      patient: {
        ptId:'',
        citizenId: '',
        name: '',
        nativePlace: '',
        address: '',
        spouseId: '',
        spouse: '',
        medicalHistory: '',
        gender: null,
        birthday: null
      },
      rules: {
        citizenId:[{validator: checkCitizenId,trigger: "blur"}],
        name: [{required: true, message: '请输入患者姓名', trigger: 'blur'}],
        gender: [{required: true, message: '请输入性别', trigger: 'blur'}],
        birthday: [{required: true, message: '请输入出生日期', trigger: 'blur'}],
        address: [{required: true, message: '请输入联系地址', trigger: 'blur'}],
        nativePlace: [{required: true, message: '请输入籍贯', trigger: 'blur'}],
        spouseId: [{validator: checkCitizenId, trigger: 'blur'}],
        spouse: [{required: true, message: '请输入配偶姓名', trigger: 'blur'}],
        medicalHistory: [{required: true, message: '请输入病史', trigger: 'blur'}],
      }
    }
  },
  mounted() {
    this.initPatients();
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
        let ptIds = '?';
        this.selections.forEach(item => {
          ptIds += 'ptIds=' + item.ptId + '&';
        })
        this.deleteRequest('/info/patient/' + ptIds).then(resp => {
          if (resp) {
            this.initPatients();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    showEditPatientView(data) {
      this.title = '编辑患者信息';
      this.patient = data;
      this.dialogVisible = true;
    },
    deletePatient(data) {
      this.$confirm('此操作将永久删除' + data.ptId + '号患者信息，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest('/info/patient/' + data.ptId).then(resp => {
          if (resp) {
            this.initPatients();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    doAddPatient() {
      if (this.patient.ptId) {
        this.$refs['patientForm'].validate(valid => {
          if (valid) {
            this.putRequest('/info/patient/', this.patient).then(resp => {
              if (resp) {
                this.dialogVisible = false;
                this.initPatients();
              }
            });
          }
        })
      } else {
        this.$refs['patientForm'].validate(valid => {
          if (valid) {
            this.postRequest('/info/patient/', this.patient).then(resp => {
              if (resp) {
                this.dialogVisible = false;
                this.initPatients();
              }
            });
          }
        })
      }
    },
    sizeChange(size) {
      this.size = size;
      this.initPatients();
    },
    currentChange(currentPage) {
      this.currentPage = currentPage;
      this.initPatients();
    },
    showAddPatientView() {
      this.activeItemIndex = 0;
      this.title = '添加患者';
      this.patient = {
        ptId: null,
        citizenId: '',
        name: '',
        nativePlace: '',
        address: '',
        spouseId: '',
        spouse: '',
        medicalHistory: '',
        gender: null,
        birthday: null
      },
          this.dialogVisible = true;
    },
    initPatients(type) {
      this.loading = true;
      let url = '/info/patient/?currentPage=' + this.currentPage + '&size=' + this.size;
      if (type && type == 'advanced') {
        if (this.searchValue.citizenId) {
          url += '&citizenId=' + this.searchValue.citizenId;
        }
        if (this.searchValue.name) {
          url += '&name=' + this.searchValue.name;
        }
        if (this.searchValue.gender) {
          url += '&gender=' + this.searchValue.gender;
        }
        if (this.searchValue.birthdayScope) {
          url += '&birthdayScope=' + this.searchValue.birthdayScope;
        }
        if (this.searchValue.nativePlace) {
          url += '&nativePlace=' + this.searchValue.nativePlace;
        }
        if (this.searchValue.address) {
          url += '&address=' + this.searchValue.address;
        }
        if (this.searchValue.spouseId) {
          url += '&spouseId=' + this.searchValue.spouseId;
        }
        if (this.searchValue.spouse) {
          url += '&spouse=' + this.searchValue.spouse;
        }
      } else {
        url += '&ptId=' + this.patientId;
      }
      this.getRequest(url).then(resp => {
        this.loading = false;
        if (resp) {
          this.patients = resp.data;
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