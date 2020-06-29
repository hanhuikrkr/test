import { observable, action, runInAction } from 'mobx'
import axios from 'axios'
import { message } from 'antd'
import * as urls from '@constant/urls'

class Leave {

	@action
  async uploadFile(file) {
    let forms = new FormData()
    forms.append('file',file)
    const r = await axios.post(urls.API_CONTENT_UPLOAD, forms)
    if (r && r.data.code === 200) {
      console.log(r.data.data.path)
    }
    return r
  }

  @action
  async APPLY_CONTENT_POST(params) {
    const r = await axios.post(urls.API_LEAVE_APPLY_LEAVE, params)
    
    return r
  }
  @action
  async APPLY_ANNOUNCE_POST(params) {
    const r = await axios.post(urls.API_ANNOUNCE_POS_LIST, params)
    
    return r

  }
  @action
  async APPLY_FOOD_POST(params) {
    const r = await axios.post(urls.API_FOOD_POST, params)
    
    return r
  }
  @action
  async APPLY_TRANSLETE_POST(params) {
    const r = await axios.get(urls.API_BAIDUTRANS_POST, params)
    
    return r
  }
  @action
  async GET_NUTRIATION(params) {
    const r = await axios.post(urls.API_GET_NUTRIATION, params)
    
    return r
  }
  @action
  async POST_NUTRIATION(params) {
    const r = await axios.post(urls.API_POST_NUTRIATION, params)
    
    return r
  }

}

export default new Leave()
