<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="serchUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="serchUserList"
            ></el-button> </el-input
        ></el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>

      <el-table :data="userList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"> </el-table-column>
        <el-table-column label="邮箱" prop="email"> </el-table-column>
        <el-table-column label="电话" prop="mobile"> </el-table-column>
        <el-table-column label="角色" prop="role_name"> </el-table-column>
        <el-table-column label="状态" prop="mg_state">
          <template v-slot="{ row }">
            <el-switch
              v-model="row.mg_state"
              @change="handleSwitchChange(row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template v-slot="{ row }">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showEditDialog(row.id)"
            ></el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="deleteUser(row.id)"
            ></el-button>
            <el-tooltip
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                size="mini"
                type="warning"
                icon="el-icon-setting"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        :hide-on-single-page="true"
      >
      </el-pagination>
    </el-card>
    <el-dialog
      title="添加用户"
      :visible.sync="dialogVisible"
      width="50%"
      @close="handleDialogClose"
    >
      <el-form
        :model="addForm"
        :rules="addFormRule"
        ref="addFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="修改用户"
      :visible.sync="editDialog"
      width="50%"
      @close="editFormClose"
    >
      <el-form
        :model="editForm"
        :rules="editFormRule"
        ref="editFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitEdit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    const checkEmail = (rule, value, callback) => {
      const regEmail = /^([A-Za-z0-9-_])+@([A-Za-z0-9-_])+(\.[A-Za-z0-9-_])+/
      if (regEmail.test(value)) {
        callback()
      } else {
        callback(new Error('请输入合法邮箱'))
      }
    }
    const checkMobile = (rule, value, callback) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        callback()
      } else {
        callback(new Error('请输入合法手机号'))
      }
    }
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      userList: [],
      total: 0,
      dialogVisible: false,
      editDialog: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editForm: {},
      addFormRule: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 10,
            message: '用户名长度在3-10之间',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            min: 5,
            max: 15,
            message: '用户名长度在5-15之间',
            trigger: 'blur'
          }
        ],
        email: [
          {
            required: true,
            message: '请输入邮箱',
            trigger: 'blur'
          },
          {
            validator: checkEmail,
            trigger: 'blur'
          }
        ],
        mobile: [
          {
            required: true,
            message: '请输入手机号',
            trigger: 'blur'
          },
          {
            validator: checkMobile,
            trigger: 'blur'
          }
        ]
      },
      editFormRule: {
        email: [
          {
            required: true,
            message: '请输入邮箱',
            trigger: 'blur'
          },
          {
            validator: checkEmail,
            trigger: 'blur'
          }
        ],
        mobile: [
          {
            required: true,
            message: '请输入手机号',
            trigger: 'blur'
          },
          {
            validator: checkMobile,
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      const { data } = await this.$http.get('users', {
        params: this.queryInfo
      })
      if (data.meta.status !== 200) {
        this.$message.error('获取用户信息失败')
      } else {
        this.userList = data.data.users
        this.total = data.data.total
      }
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    async handleSwitchChange(info) {
      const { data } = await this.$http.put(
        `users/${info.id}/state/${info.mg_state}`
      )
      if (data.meta.status !== 200) {
        info.mg_state = !info.mg_state
        this.$message.error('修改用户状态失败')
      } else {
        this.$message.success('更改状态成功')
      }
    },
    serchUserList() {
      this.queryInfo.pagenum = 1
      this.getUserList()
    },
    handleDialogClose() {
      this.$refs.addFormRef.resetFields()
    },
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data } = await this.$http.post('users', this.addForm)
        if (data.meta.status !== 201) {
          this.$message.error('添加用户失败')
        } else {
          this.$message.success('添加用户成功')
          this.dialogVisible = false
          this.getUserList()
        }
      })
    },
    async showEditDialog(id) {
      const { data } = await this.$http.get(`users/${id}`)
      if (data.meta.status !== 200) {
        this.$message.error('查询用户信息失败')
        return
      }
      this.editForm = data.data
      this.editDialog = true
    },
    submitEdit() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data } = await this.$http.put(`users/${this.editForm.id}`, {
          email: this.editForm.email,
          mobile: this.editForm.mobile
        })
        if (data.meta.status !== 200) {
          this.$message.error('修改用户失败')
        } else {
          this.$message.success('修改用户成功')
          this.editDialog = false
          this.getUserList()
        }
      })
    },
    editFormClose() {
      this.$refs.editFormRef.resetFields()
    },
    async deleteUser(id) {
      const result = await this.$confirm('此操作将删除用户数据,是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if(result !== 'confirm'){
        this.$message.info("已取消删除操作")
        return;
      }
      const {data} = await this.$http.delete(`users/${id}`)
      if(data.meta.status === 200){
        const curPagesize = this.total % this.queryInfo.pagesize;
        if(curPagesize === 1){
          this.queryInfo.pagenum <= 1 ? this.queryInfo.pagenum = 1 : this.queryInfo.pagenum --;
        }
        await this.getUserList()
        this.$message.success("删除成功")
        return;
      }
      this.$message.error("删除失败")
    }
  }
}
</script>

<style></style>
