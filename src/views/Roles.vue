<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addDialog = true"
            >添加角色</el-button
          >
        </el-col>
      </el-row>

      <el-table :data="rolesList" border stripe>
        <el-table-column type="expand">
          <template v-slot="{ row }">
            <el-row
              v-for="(item, index) in row.children"
              :key="item.id"
              :class="['borderBottom', index === 0 ? 'borderTop' : '']"
            >
              <el-col :span="5">
                <el-tag
                  type="primary"
                  closable
                  @close="tagClose(row, item.id)"
                  >{{ item.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row
                  v-for="(two, index2) in item.children"
                  :key="two.id"
                  :class="['tag', index2 !== 0 ? 'borderTop' : '']"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="tagClose(row, two.id)"
                      >{{ two.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      class="tag"
                      v-for="three in two.children"
                      :key="three.id"
                      closable
                      @close="tagClose(row, three.id)"
                      >{{ three.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template v-slot="{ row }">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editRoles(row.id)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="_deleteRoles(row.id)"
              >删除</el-button
            >
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showRightsDialog(row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog
      title="添加角色"
      :visible.sync="addDialog"
      width="50%"
      @close="addDialogClose"
    >
      <el-form
        :model="roleForm"
        ref="addFormRef"
        label-width="70px"
        :rules="addRoleRules"
      >
        <el-form-item label="角色名" prop="roleName">
          <el-input v-model="roleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="roleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="addDialog = false">取 消</el-button>
        <el-button type="primary" @click="addDialogSubmit">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="添加角色"
      :visible.sync="editDialog"
      width="50%"
      @close="editDialogClose"
    >
      <el-form
        :model="editForm"
        ref="editFormRef"
        label-width="70px"
        :rules="addRoleRules"
      >
        <el-form-item label="角色名" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="editDialog = false">取 消</el-button>
        <el-button type="primary" @click="editDialogSubmit">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="分配权限"
      :visible.sync="rightsDialog"
      width="50%"
      @close="closeShowRightsDialog"
    >
      <el-tree
        :data="rightsList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defaultKeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer">
        <el-button @click="rightsDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitShowRightsDialog"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getRoleList,
  addRoles,
  getRoleById,
  updateRole,
  deleteRole,
  deleteRights,
  getRightsList,
  addRights
} from '../api/power'
export default {
  data() {
    return {
      rolesList: [],
      addDialog: false,
      roleForm: {
        roleName: '',
        roleDesc: ''
      },
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      roleId:'',
      editDialog: false,
      rightsDialog: false,
      defaultKeys:[],
      editForm: {},
      rightsList: [],
      addRoleRules: {
        roleName: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this._getRolesList()
  },
  methods: {
    async _getRolesList() {
      const data = await getRoleList()
      this.rolesList = data
    },
    addDialogClose() {
      this.$refs.addFormRef.resetFields()
    },
    async addDialogSubmit() {
      await addRoles(this.roleForm)
      this.addDialog = false
      this._getRolesList()
    },
    async editRoles(id) {
      const data = await getRoleById(id)
      this.editForm = data
      this.editDialog = true
    },
    async editDialogSubmit() {
      await updateRole(this.editForm.roleId, {
        roleName: this.editForm.roleName,
        roleDesc: this.editForm.roleDesc
      })
      await this._getRolesList()
      this.editDialog = false
    },
    editDialogClose() {
      this.$refs.editFormRef.resetFields()
    },
    async _deleteRoles(id) {
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
      await deleteRole(id)
      await this._getRolesList()
    },
    async tagClose(role, rightId) {
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
      const data = await deleteRights(role.id, rightId)
      role.children = data
    },
    async showRightsDialog(role) {
      const data = await getRightsList('tree')
      this.rightsList = data
      this.getLeadKeys(role, this.defaultKeys)
      this.roleId = role.id;
      this.rightsDialog = true
    },
    closeShowRightsDialog() {
      this.defaultKeys = []
      this.rightsDialog = false
    },
    async submitShowRightsDialog() {
      const keys = [...this.$refs.treeRef.getCheckedKeys(), ...this.$refs.treeRef.getHalfCheckedKeys()];
      const idStr = keys.join(',');
      await addRights(this.roleId, {rids: idStr})
      const data = await this._getRolesList()
      this.rightsList = data
      this.rightsDialog = false
    },
    getLeadKeys(node, keyArr){
      if(!node.children){
        return keyArr.push(node.id)
      }
      node.children.forEach((item) =>{
        this.getLeadKeys(item, keyArr)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.borderTop {
  border-top: 1px solid #ccc;
}
.borderBottom {
  border-bottom: 1px solid #ccc;
}
.tag {
  margin: 7px;
}
.el-row {
  display: flex;
  align-items: center;
}
</style>
