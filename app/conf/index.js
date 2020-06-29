import React, { Suspense, lazy } from 'react'
import { inject, observer } from 'mobx-react'
import './index.less'
import { toJS } from "mobx";
import get from '@util/getValue'
import * as DT from '@util/date'
import { InputNumber } from 'antd';
import { API_SERVER } from '../../constant/apis'
import { formatDate, jsGetAge, convertDateFromString, now } from '../../util/date';
@inject('userStore')
@observer
class Conf extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      height: 1,
      weight: 1,
    }
    console.log(JSON.stringify(this.props.userStore.currUser))
  }

  doLogout = () => {
    this.props.userStore.logout()
    window.location.replace(`/`)
  }

  doCardSet = () => {
    window.location.replace(`/#cset`)
  }
  heightChange = (value) => {
    console.log('changed', value);
    this.setState({
      height: value
    })
  }
  weightChange = (value) => {
    console.log('changed', value);
    this.setState({
      weight: value
    })
  }
  canpost = () => {
    let user = this.props.userStore.currUser
    let params = {
      height:this.state.height,
      weight:this.state.weight,
      email: get(user, 'email', '')
    }
    this.props.userStore.postHeightWeight(params).then((data)=>{
      console.log(data);
    })

  }
  render() {

    let user = this.props.userStore.currUser
    let name = get(user, 'name', '')
    let sex = get(user, 'sex', '') === 1 ? '男' : '女'


    let face = get(user, 'face', '')
    console.log(user)
    let birth = new Date(get(user, 'birth_date', ''))
    console.log(birth)
    let age = jsGetAge(birth)
    console.log(age)
    let height = get(user, 'height', '')
    let weight = get(user, 'weight', '')
    let goal = get(user, 'goal', '')
    // console.log(age);

    return (
      <div className='g-main'>
        <div className="m-head">
          <span className="head-title">
            双葉·个人
          </span>

        </div>
        <div className="m-hd">
          <div className="m-face">

            <img src={(API_SERVER + '/' + face)} alt="" />
          </div>
          <div className="m-hd-info">
            <span className="m-name">{name}</span>

          </div>
        </div>

        <div className="m-bd">
          <div className="m-info">

            <div className="m-row">
              <div className="m-col">
                <label>年龄</label>

              </div>
              <div className="m-col">

                <div className="m-val-wrap">
                  <span className="m-mul-bd">{age}</span>
                  <span className="m-mul-unit">岁</span>
                </div>
              </div>
            </div>

            <div className="m-row">
              <div className="m-col">
                <label>性别</label>

              </div>
              <div className="m-col">

                <div className="m-val-wrap">
                  <span className="m-mul-bd">{sex}</span>
                  <span className="m-mul-unit">性</span>
                </div>
              </div>
            </div>
            <div className="m-row">
              <div className="m-col">
                <label>身高</label>

              </div>
              <div className="m-col">

                <div className="m-val-wrap">
                  <InputNumber min={1} max={300} defaultValue={height} onChange={this.heightChange} />
                  <span className="m-mul-unit">cm</span>
                </div>
              </div>
            </div>
            <div className="m-row">
              <div className="m-col">
                <label>体重</label>

              </div>
              <div className="m-col">

                <div className="m-val-wrap">
                  <InputNumber min={1} max={1000} defaultValue={weight} onChange={this.weightChange} />
                  <span className="m-mul-unit">KG</span>
                </div>
              </div>
            </div>
            <div className="m-row">
              <div className="m-col">
                <label>目标</label>

              </div>
              <div className="m-col">

                <div className="m-val-wrap">
                  <span className="m-mul-unit">我想要</span>
                  <span className="m-mul-bd">{goal}</span>

                </div>
              </div>
            </div>
          </div>


        </div>

        <div className="m-group">
          <div className="m-menu" onClick={this.canpost}>个人信息设置</div>
        </div>


        <div className="m-group m-last">
          <div className="m-menu" onClick={this.doLogout}>退出登入</div>
        </div>
      </div>
    )
  }
}


export default Conf
