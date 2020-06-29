import { observable, action, runInAction } from 'mobx'
import axios from 'axios'
import { message } from 'antd'
import * as urls from '@constant/urls'
import token from 'util/token.js'

class User {
	@observable
	currUser = undefined

	@action
	async register(user) {
		const r = await axios.post(urls.API_USER_REGISTER, user)
		if (r && r.status === 200) {
			return r.data
		}
	}

	@action
	async login(params) {
		
		if (params.email==='106shiyanshi'&&params.pwd==='106shiyanshi') {
			runInAction(() => {
				token.saveUser(params)
				this.currUser = params
				
			})
			return params
		} else {
			message.error('网络错误', 0.7)
		}
	}

	@action
	logout() {
		token.removeUser()
	}
	@action
	async postHeightWeight(params) {
	  const r = await axios.post(urls.API_USER_H_W, params)
	  
	  return r
	}
	
	@action
	async showbase() {
		const r = await axios.post(urls.API_CAL_TABLES,null )
		if (r && r.status === 200) {
			return r.data
		}
	}
  
}

export default new User()
