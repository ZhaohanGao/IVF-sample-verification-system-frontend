<template>
  <div>
    <el-card >
      <el-descriptions title="患者信息列表" :column="3" border>
        <el-descriptions-item label="ID">{{ patientInfo.ptId }}</el-descriptions-item>
        <el-descriptions-item label="身份证号">{{ patientInfo.citizenId }}</el-descriptions-item>
        <el-descriptions-item label="姓名">{{ patientInfo.name }}</el-descriptions-item>
        <el-descriptions-item label="性别">{{ patientInfo.gender }}</el-descriptions-item>
        <el-descriptions-item label="出生日期">{{ patientInfo.birthday }}</el-descriptions-item>
        <el-descriptions-item label="籍贯">{{ patientInfo.nativePlace }}</el-descriptions-item>
        <el-descriptions-item label="联系地址">{{ patientInfo.address }}</el-descriptions-item>
        <el-descriptions-item label="配偶身份证号">{{ patientInfo.spouseId }}</el-descriptions-item>
        <el-descriptions-item label="配偶姓名">{{ patientInfo.spouse }}</el-descriptions-item>
      </el-descriptions>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "PatientInfo",
  data() {
    return {
      patientInfo: []
    }
  },
  mounted() {
    this.initPatientInfo();
  },
  methods: {
    initPatientInfo() {
      this.getRequest('/patient/info/').then(resp => {
        if (resp) {
          this.patientInfo = resp;
        }
      })
    }
  }
}
</script>
