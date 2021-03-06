/*
* Licensed Materials - Property of ROOTCLOUD
* THIS MODULE IS "RESTRICTED MATERIALS OF ROOTCLOUD"
* (c) Copyright ROOTCLOUD Inc. 2020 All Rights Reserved
*
* The source code for this program is not published or
* otherwise divested of its trade secrets
*/

import { createStoreBindings } from 'mobx-miniprogram-bindings'
import { rootcloud } from "../../utils/store";
import jwtDecode from 'jwt-decode';

Page({
  data: {
    userInfo: {}
  },
  onLoad() {
    this.storeBindings = createStoreBindings(this, {
      store: rootcloud,
      fields: ['authenticated'],
      actions: ['logout']
    });
  },
  onUnload() {
    this.storeBindings.destroyStoreBindings()
  },
  onShow() {
    const token = rootcloud.token;
    if(token) {
      const userInfo = jwtDecode(token);
      this.setData({
        userInfo
      });
    }
    if (rootcloud.authenticated) {
      this.getUserInfo();
    }
  },

  getUserInfo() {
    let app = getApp();
    app.request("GET", `/account-manage/v1/user/${this.data.userInfo.user.id}`)	 
      .then(res => {
        const userInfo = Object.assign(this.data.userInfo, res.data);
        this.setData({
          userInfo
        });
      })
  }
});