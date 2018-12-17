import { $init, $digest } from '../../utils/common.util'
var app = getApp();
var baseUrl = app.globalData.host;
var contentid ; 
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
    var that =this
    var uploadImages = this.data.images
    var imgLength = uploadImages.length
    wx.request({
      url: baseUrl +'/addContentText',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        title: e.detail.value.title,
        content: e.detail.value.content,
        sessionid: wx.getStorageSync('sessionid'),
      },
      success: function(data){
        contentid = data.data.contentid;
          that.startUpload();
      }
    })
    
  },
  /**
 *  用户上传图片
 */
  startUpload: function(){
    var uploadImages = this.data.images
    var imgLength = uploadImages.length
    for (var i = 0; i < imgLength; i++){
      this.uploadImg(i)
    }
  },
  uploadImg: function(index) {
    var imgList = this.data.images
    console.log(index)
    console.log(imgList)
    const uploadTask = wx.uploadFile({
      url: baseUrl + '/addUpload',
      filePath: imgList[index],
      name: 'fileData',
      header: {
        "Content-Type": "multipart/form-data"
      },
      formData: {
        contentid : contentid,
      },
      
      success: function (res) {
        console.log(res)
      },
      fail(res) {
        console.log(res)
      },
      complete(res) {
        // console.log(res)  
      }
    })

    // uploadTask.onProgressUpdate((res) => {
    //   console.log('上传进度', res.progress)
    //   console.log('已经上传的数据长度', res.totalBytesSent)
    //   console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
    // })
  },

//   if(data.data.status == 1){
//   console.log('jjlklk')
//   wx.showToast({
//     title: '已提交发布！',
//     duration: 3000
//   });
//   wx.navigateBack({
//     delta: 1
//   })
// }else {
//   console.log('发布失败')
// }
  upload: function(){
    var that = this 
    for (var i = 0; i < this.data.images.length; i++) {
      wx.uploadFile({
        url: baseUrl+'/addContent',
        header: {
          "Content-Type": "multipart/form-data"
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