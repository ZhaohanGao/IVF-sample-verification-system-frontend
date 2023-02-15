<template>
  <div>
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="权限组" name="PermitsMana"><PermitsMana></PermitsMana></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import PermitsMana from "@/components/sys/cfg/PermitsMana";

export default {
  name: "SysCfg",
  data() {
    return {
      activeName: 'PermitsMana'
    }
  },
  components:{
    'PermitsMana': PermitsMana
  }
}
</script>

<style scoped>

</style>