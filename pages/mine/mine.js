//mainjs
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    like: '喜欢内容',
    add: '添加内容',
    userInfo: {},
    hasUserInfo: false,
    sessionid: wx.getStorageSync('sessionid'),
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(app.globalData.userInfo)
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        },

      })
    }
  },

  authorization: function (e) {
    var that = this;
    wx.login({
      success: function (r) {
        var code = r.code;//登录凭证  
        console.log(code)
        if (code) {
          //2、调用获取用户信息接口  
          wx.getUserInfo({
            success: function (res) {
              console.log(res)
              //3.请求自己的服务器，解密用户信息 获取unionId等加密信息  
              wx.request({
                url: 'https://127.0.0.1:8060/authorization',//自己的服务接口地址  
                method: 'POST',
                header: {
                  'content-type': 'application/x-www-form-urlencoded'
                },
                data: { 
                  encryptedData: res.encryptedData,
                  iv: res.iv,
                  rawData: res.rawData, 
                  signature: res.signature,
                  code: code
                   },
                success: function (data) {
                  wx.setStorageSync('sessionid', data.data.sessionid)
                    console.log(data)
                  //4.解密成功后 获取自己服务器返回的结果  
                  if (data.data.status == 1) {
                    that.setData({
                      sessionid: data.data.sessionid,
                      userInfo: res.userInfo,
                      hasUserInfo: true
                    })
                  } else {
                    console.log('解密失败')
                  }
                },
                fail: function () {
                  console.log('系统错误')
                  
                }
              })
            },
            fail: function () {
              console.log('获取用户信息失败')
            }
          })

        } else {
          console.log('获取用户登录态失败！' + r.errMsg)
        }
      },
      fail: function () {
        console.log('登陆失败')
      }
    })
  },

  tolikes: function (e) {
    console.log('jklk')
    wx.navigateTo({
      url: 'page/home/home'
    })
  },
  toaddcontent: function(){
    wx.navigateTo({
      url: '../../pages/addcontent/addcontent'
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})
