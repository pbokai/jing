
import { $init, $digest } from '../../utils/common.util'

var adds = {}; 
Page({
  data: {
    titleCount: 0,
    contentCount: 0,
    title: '',
    content: '',
    images: []

  },

  onLoad(options) {
    $init(this)
  },

  handleTitleInput(e) {
    const value = e.detail.value
    this.data.title = value
    this.data.titleCount = value.length
    $digest(this)
  },

  handleContentInput(e) {
    const value = e.detail.value
    this.data.content = value
    this.data.contentCount = value.length
    $digest(this)
  },

  chooseImage(e) {
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        const images = this.data.images.concat(res.tempFilePaths)
        this.data.images = images.length <= 9 ? images : images.slice(0, 9)
        console.log(images)
        $digest(this)
      }
    })
  },

  removeImage(e) {
    const idx = e.target.dataset.idx
    this.data.images.splice(idx, 1)
    $digest(this)
  },

  handleImagePreview(e) {
    const idx = e.target.dataset.idx
    const images = this.data.images

    wx.previewImage({
      current: images[idx],
      urls: images,
    })
  },

  submitForm: function(e) {
    
    console.log(e)
    adds = e.detail.value;
    adds.sessionid=wx.getStorageSync('sessionid')
    console.log(this.data.images)
    this.upload()
    
  },
  upload: function(){
    var that = this 
    
    for (var i = 0; i < this.data.images.length; i++) {
      wx.uploadFile({
        url: 'https:127.0.0.1:8060/addContent',
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        rejectUnauthorized: false,
        method: "POST",
        filePath: that.data.images[i],
        name: 'file',
        formData: adds,
        success: function (res) {
          console.log(res)
          if (res) {
            wx.showToast({
              title: '已提交发布！',
              duration: 3000
            });
          }
        }
      })
    }
    
    this.setData({
      title: '',
      content: '',
    })
    
  }


})