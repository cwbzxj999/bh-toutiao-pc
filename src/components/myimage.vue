<template>
<!-- 记着全局注册 -->
  <div class="my-image">
      <!-- 按钮 -->
      <div class="btn_box" @click="open">
          <img :src="value||btnImage" alt="">
      </div>
      <!-- 对话框 -->
       <el-dialog :visible.sync="dialogVisible" width="750px">
           <el-tabs v-model="activeName" type="card">
            <el-tab-pane label="素材库" name="image">
                <!-- 按钮 -->
                <el-radio-group @change="toggleList" v-model="reqParams.collect" size="small">
                    <el-radio-button :label="false">全部</el-radio-button>
                    <el-radio-button :label="true">收藏</el-radio-button>
                </el-radio-group>
                <!-- 列表 -->
                <div class="img_list">
                    <div class="img_item" :class="{selected:selectedImageUrl === item.url}" v-for="item in images" :key="item.id" @click="selectedImage(item.url)">
                    <img :src="item.url" alt />
                    </div>
                </div>
                <!-- 分页 -->
                 <el-pagination
                    background
                    layout="prev, pager, next"
                    :total="total"
                    :page-size="reqParams.per_page"
                    :current-page="reqParams.page"
                    @current-change="pager"
                ></el-pagination>
            </el-tab-pane>
            <el-tab-pane label="上传图片" name="upload">
                <el-upload
                class="avatar-uploader"
                action="http://ttapi.research.itcast.cn/mp/v1_0/user/images" :headers="headers" :show-file-list="false" :on-success="handleSuccess" name="image">
                <img v-if="uploadImageUrl" :src="uploadImageUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </el-tab-pane>
        </el-tabs>
        <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmImage">确 定</el-button>
        </span>
      </el-dialog>
  </div>
</template>

<script>
import local from '@/utils/local'
import defaultImage from '../assets/default.png'
export default {
  // 子组件接收
  props: ['value'],
  data () {
    return {
      // 对话框隐藏
      dialogVisible: false,
      // 当前激活的选项卡name的值
      activeName: 'image',
      // 请求素材参数
      reqParams: {
        // false全部 true 收藏
        collect: false,
        page: 1,
        per_page: 8
      },
      total: 0,
      // 素材列表
      images: [],
      // 选中的图片地址
      selectedImageUrl: null,
      // 上传图片的地址
      uploadImageUrl: null,
      // 请求头
      headers: {
        Authorization: `Bearer ${local.getUser().token}`
      },
      // 按钮默认图片
      btnImage: defaultImage
    }
  },
  methods: {
    open () {
      this.dialogVisible = true
      this.getImages()
    },
    // 切换列表
    toggleList () {
      this.reqParams.page = 1
      this.getImages()
    },
    async getImages () {
      const {
        data: { data }
      } = await this.$http.get('user/images', { params: this.reqParams })
      this.images = data.results
      // 赋值总条数
      this.total = data.total_count
    },
    pager (newPage) {
      this.reqParams.page = newPage
      this.getImages()
    },
    // 选中图片
    selectedImage (url) {
      this.selectedImageUrl = url
    },
    handleSuccess (res) {
      this.uploadImageUrl = res.data.url
      this.$message.success('上传成功')
    },
    // 点击确认上传图片后
    confirmImage () {
      if (this.activeName === 'image') {
        // 说明是素材库
        if (!this.selectedImageUrl) {
          return this.$message.warning('请选择一张照片')
        }
        // this.btnImage = this.selectedImageUrl
        // 提交给父组件
        this.$emit('input', this.selectedImageUrl)
        this.dialogVisible = false
      } else {
        if (!this.uploadImageUrl) {
          return this.$message.warning('请上传一张图片')
        }
        // this.btnImage = this.uploadImageUrl
        // 提交给父组件
        this.$emit('input', this.uploadImageUrl)
        this.dialogVisible = false
      }
    }
  }
}
</script>

<style scoped lang="less">
.my-image{
    display: inline-block;
    margin-right: 20px;
    .btn_box{
        width: 150px;
        height: 150px;
        border:1px dashed #ddd;
        img{
            width: 100%;
            height: 100%;
            display: block;
        }
    }
}
.dialog-footer{
    text-align: center;
    width: 100%;
    display: block
}
.img_list {
  padding-top: 20px;
  .img_item {
    width: 150px;
    height: 120px;
    border: 1px dashed #ddd;
    display: inline-block;
    margin-right: 20px;
    margin-bottom: 20px;
    position: relative;
    img {
      width: 100%;
      height: 100%;
    }
    &.selected::after{
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,.3) url("../assets/selected.png") no-repeat center / 50px 50px
    }
  }
}
</style>
