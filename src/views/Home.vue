<template>
  <el-container class="home_container">
    <el-header>
      <div>
        <img src="http://98c.top/img/32.jpg" alt="" />
        <span>后台管理系统</span>
      </div>
      <el-button type="info" @click="loginOut">退出登录</el-button>
    </el-header>
    <el-container>
      <el-aside :width="!collapse ? '200px' : '64px'">
        <div class="toggle_menu" @click="toggleMenu"></div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409bef"
          unique-opened
          :collapse="collapse"
          router
          :collapse-transition="false"
          :default-active="$route.path"
        >
          <el-submenu
            v-for="(item, index) in menuList"
            :key="item.id"
            :index="`${index}`"
          >
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{ item.authName }}</span>
            </template>
            <el-menu-item
              v-for="child in item.children"
              :key="child.id"
              :index="'/' + child.path"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ child.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menuList: [],
      collapse: false
    }
  },
  created() {
    this.getMenuList()
    console.log(this.$route.path)
  },
  methods: {
    async getMenuList() {
      const { data } = await this.$http.get('menus')
      if (data.meta.status !== 200) {
        this.$message.error(data.meta.msg)
      } else {
        this.menuList = data.data
      }
    },
    loginOut() {
      window.sessionStorage.removeItem('token')
      this.$router.push('/login')
    },
    toggleMenu() {
      this.collapse = !this.collapse
    }
  }
}
</script>

<style lang="scss" scoped>
.home_container {
  height: 100%;
}
.el-header {
  background: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    img {
      width: 50px;
      border-radius: 50%;
      height: 50px;
      margin-right: 15px;
    }
  }
}
.el-aside {
  background: #333744;
}
.el-main {
  background: #ccc;
}
.el-menu {
  border-right: none;
}
.toggle_menu {
  height: 24px;
  background: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
