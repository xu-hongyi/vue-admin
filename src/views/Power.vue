<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-table :data="rightsList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="权限名称" prop="authName"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="权限等级" prop="level">
          <template v-slot="{ row }">
            <el-tag v-if="row.level == 0">一级</el-tag>
            <el-tag v-else-if="row.level == 1" type="success">二级</el-tag>
            <el-tag v-else type="danger">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { getRightsList } from '../api/power'
export default {
  data() {
    return {
      rightsList: []
    }
  },
  created() {
    this._getRightsList()
  },
  methods: {
    async _getRightsList() {
      const data = await getRightsList('list')
      this.rightsList = data
    }
  }
}
</script>

<style lang="scss" scoped></style>
