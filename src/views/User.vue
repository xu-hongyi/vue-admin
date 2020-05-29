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
                @click="setRole(row)"
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
        <el-button type="primary" @click="_addUser">确 定</el-button>
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

    <el-dialog title="分配角色" :visible.sync="setRoleDialog" width="50%" @close="setRoleDialogClose">
      <div class="role_container">
        <p>当前用户：{{ userInfo.username }}</p>
        <p>当前角色：{{ userInfo.role_name }}</p>
        <p>
          分配新角色：
          <el-select v-model="selectRoleId">
            <el-option
              v-for="item in rolesList"
              :value="item.id"
              :key="item.id"
              :label="item.roleName"
            ></el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialog = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  getUserList,
  updateSwitchUser,
  addUser,
  getUser,
  updateUser,
  deleteUser,
  setRole
} from '../api/user/user'
import { getRoleList } from '../api/power'
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
      },
      setRoleDialog: false,
      userInfo: {},
      rolesList: [],
      selectRoleId: ''
    }
  },
  created() {
    this._getUserList()
  },
  methods: {
    async _getUserList() {
      const { total, users } = await getUserList(this.queryInfo)
      this.total = total
      this.userList = users
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this._getUserList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this._getUserList()
    },
    async handleSwitchChange(info) {
      await updateSwitchUser(info.id, info.mg_state)
    },
    serchUserList() {
      this.queryInfo.pagenum = 1
      this._getUserList()
    },
    handleDialogClose() {
      this.$refs.addFormRef.resetFields()
    },
    _addUser() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        await addUser(this.addForm)
        this.dialogVisible = false
        this._getUserList()
      })
    },
    async showEditDialog(id) {
      const data = await getUser(id)
      this.editForm = data
      this.editDialog = true
    },
    submitEdit() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        await updateUser(this.editForm.id, {
          email: this.editForm.email,
          mobile: this.editForm.mobile
        })
        this.editDialog = false
        this._getUserList()
      })
    },
    editFormClose() {
      this.$refs.editFormRef.resetFields()
    },
    async deleteUser(id) {
      const result = await this.$confirm(
        '此操作将删除用户数据,是否继续？',
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
      await deleteUser(id)
      const curPagesize = this.total % this.queryInfo.pagesize
      if (curPagesize === 1) {
        this.queryInfo.pagenum <= 1
          ? (this.queryInfo.pagenum = 1)
          : this.queryInfo.pagenum--
      }
      await this._getUserList()
    },
    async setRole(userInfo) {
      this.userInfo = userInfo
      const data = await getRoleList()
      this.rolesList = data
      this.setRoleDialog = true
    },
    async saveRoleInfo() {
      if (!this.selectRoleId) {
        this.$message.error('请选择要分配的角色')
        return
      }
      await setRole(this.userInfo.id, { rid: this.selectRoleId })
      await this._getUserList()
      this.setRoleDialog = false
    },
    setRoleDialogClose(){
      this.userInfo = {};
      this.selectRoleId = ''
    }
  }
}
</script>

<style lang="scss" scoped>
.role_container{
  > p{
    margin: 20px 0;
  }
}
</style>
