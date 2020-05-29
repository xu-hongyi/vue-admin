<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row class="add-btn">
        <el-col>
          <el-button type="primary" @click="showCateDialog">添加分类</el-button>
        </el-col>
      </el-row>

      <tree-table
        class="tree-table"
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
      >
        <template #isok="{row}">
          <i v-if="row.cat_deleted === false" class="el-icon-success"></i>
          <i v-else class="el-icon-error"></i>
        </template>
        <template #order="{row}">
          <el-tag type="primary" v-if="row.cat_level === 0" size="mini"
            >一级</el-tag
          >
          <el-tag type="success" v-else-if="row.cat_level === 1" size="mini"
            >二级</el-tag
          >
          <el-tag type="warning" v-else size="mini">三级</el-tag>
        </template>
        <template #isok="{row}">
          <i v-if="row.cat_deleted === false" class="el-icon-success"></i>
          <i v-else class="el-icon-error"></i>
        </template>

        <template #edit="{row}">
          <el-button
            icon="el-icon-edit"
            size="mini"
            type="success"
            @click="updateCate(row.cat_id)"
            >编辑</el-button
          >
          <el-button
            icon="el-icon-delete"
            size="mini"
            type="danger"
            @click="deleteCate(row.cat_id)"
            >删除</el-button
          >
        </template>
      </tree-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <el-dialog
      title="添加分类"
      :visible.sync="cateDialog"
      width="50%"
      @close="addCateClose"
    >
      <el-form
        :model="addCateForm"
        :rules="addCateRules"
        ref="cateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="{ expandTrigger: 'hover', ...cascaderProps }"
            @change="parentCateChange"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="cateDialog = false">取消</el-button>
        <el-button type="primary" @click="submitAddCate">确认</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="修改名称"
      :visible.sync="updateCateNameDialog"
      width="50%"
      @close="updateCateClose"
    >
      <el-form
        :model="updateCateInfo"
        :rules="addCateRules"
        ref="updateCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="updateCateInfo.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="updateCateNameDialog = false">取消</el-button>
        <el-button type="primary" @click="submitupdatedCate">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getCategories,
  addCategories,
  deleteCategories,
  getCateById,
  updateCategories
} from '../api/goods'
export default {
  data() {
    return {
      cateList: [],
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      cateDialog: false,
      total: 0,
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isok'
        },
        {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'edit'
        }
      ],
      addCateForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      addCateRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      parentCateList: [],
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      selectedKeys: [],
      updateCateNameDialog: false,
      updateCateInfo: {}
    }
  },
  created() {
    this._getCategories()
  },
  methods: {
    async _getCategories() {
      const data = await getCategories(this.queryInfo)
      this.total = data.total
      this.cateList = data.result
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this._getCategories()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this._getCategories()
    },
    async showCateDialog() {
      await this.getParentCateLsit()
      this.cateDialog = true
    },
    async getParentCateLsit() {
      const data = await getCategories({ type: 2 })
      this.parentCateList = data
    },
    parentCateChange() {
      if (this.selectedKeys.length > 0) {
        this.addCateForm.cat_pid = this.selectedKeys[
          this.selectedKeys.length - 1
        ]
        this.addCateForm.cat_level = this.selectedKeys.length
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    addCateClose() {
      this.$refs.cateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    },
    submitAddCate() {
      this.$refs.cateFormRef.validate(async valid => {
        if (!valid) return
        await addCategories(this.addCateForm)
        await this._getCategories()
        this.cateDialog = false
      })
    },
    async deleteCate(id) {
      const result = await this.$confirm(
        '此操作将删除数据,是否继续？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (result !== 'confirm') {
        this.$message.info('已取消删除操作')
        return
      }
      await deleteCategories(id)
      this.queryInfo.pagenum = 1;
      await this._getCategories()
    },
    async updateCate(id) {
      const data = await getCateById(id)
      this.updateCateInfo = data
      this.updateCateNameDialog = true
    },
    updateCateClose() {
      this.$refs.updateCateFormRef.resetFields()
      this.updateCateInfo = {}
      this.updateCateNameDialog = false
    },
    async submitupdatedCate() {
      this.$refs.updateCateFormRef.validate(async valid => {
        if (!valid) return
        await updateCategories(this.updateCateInfo.cat_id, {
          cat_name: this.updateCateInfo.cat_name
        })
        await this._getCategories()
        this.updateCateNameDialog = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.el-icon-success {
  color: lightgreen;
}

.el-icon-error {
  color: red;
}
.tree-table {
  margin: 10px 0;
}
.el-cascader {
  width: 100%;
}
</style>
