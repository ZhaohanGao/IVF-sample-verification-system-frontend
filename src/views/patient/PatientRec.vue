<template>
  <div>
    <el-card class="box-card" v-for="(patientRec, index) in patientRecs" :key="index">
      <el-descriptions title="" :column="3" border>
        <el-descriptions-item label="就诊ID">{{ patientRec.trId }}</el-descriptions-item>
        <el-descriptions-item label="医生编号">{{ patientRec.docId }}</el-descriptions-item>
        <el-descriptions-item label="就诊项目">{{ patientRec.treatmentProgram }}</el-descriptions-item>
        <el-descriptions-item label="处方项目">{{ patientRec.prescription }}</el-descriptions-item>
        <el-descriptions-item label="就诊时间">{{ patientRec.trDate }}</el-descriptions-item>
        <el-descriptions-item label="费用（元）">{{ patientRec.fee }}</el-descriptions-item>
      </el-descriptions>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "PatientRec",
  data() {
    return {
      patientRecs: []
    }
  },
  mounted() {
    this.initPatientRec();
  },
  methods: {
    initPatientRec() {
      this.getRequest('/patient/rec/').then(resp => {
        if (resp) {
          this.patientRecs = resp;
        }
      })
    }
  }
}
</script>

<style>
.box-card{
  margin-top: 10px;
}
</style>