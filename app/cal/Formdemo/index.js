import React, { Component } from "react";
import { Form, Icon, Input, Button, Checkbox, Select, TimePicker,Result } from "antd";
import { Link } from "react-router-dom";
import "./index.less";
import { inject } from "mobx-react";
import moment from "moment";
const { Option } = Select;
const FormItem = Form.Item;
//form代码，没有什么改进，把下面的提交按钮去掉就行
@inject("calStore")
class NormalLoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      visible: false,
      succ: false,
      regVal: null,
      callback:null,
      
    };
  }
  doSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      if (err) {
        return;
      }

      this.setState(
        {
          regVal: { ...this.state.regVal, ...values },
          loading: true,
        },
        () => {
          const health_data = { ...this.state.regVal };
          
          let datetime = moment(this.props.date).format("YYYY-MM-DD")+" "+moment(health_data.time).format("HH:mm");
          health_data["username"] = this.props.user;
          health_data["date"] = datetime;
          console.log(health_data);
          console.log(this.state);
          console.log(this.props.form)
          //???????????????????????????????????????//
          this.props.calStore.addHealthDaya(health_data).then((data) => {
            console.log(data)
            this.props.updatecal();
            if (data.status === 200) {
              this.setState({
                succ: true,
                callback:data.data.msg
              });
            }
          });
        }
      );
    });
  };
  clickSubmit = (e) => {
    console.log(e);
    if (e != "自由训练") {
      // 隐藏
      this.setState({ visible: false });
    } else {
      // 显示
      this.setState({ visible: true });
    }
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    console.log(this.props.date);
    console.log(this.props.addflag);
    console.log(this.props.user);
    const { succ} = this.state
    
    return (
      
      <div>
         {(!succ) &&
           <>
           <Form>
             <FormItem>
               {getFieldDecorator("type", {
                 rules: [{ required: true, message: "请选择您想添加的项目！" }],
               })(
                 <Select
                   size="large"
                   placeholder="请选择您想添加的项目..."
                   onChange={this.clickSubmit}
                 >
                   <Option value="自由训练">自由训练</Option>
                   <Option value="步数">步数</Option>
                   <Option value="心率">心率</Option>
                   <Option value="体温">体温</Option>
                   <Option value="血压">血压</Option>
                 </Select>
               )}
             </FormItem>
             <FormItem>
               {getFieldDecorator("time", {
                 rules: [{ required: true, message: "请选择您想添加的时间点！" }],
               })(
                 <TimePicker initialValue={moment(new Date(), 'HH:mm')}  format='HH:mm' size="large"/>
               )}
             </FormItem>
             {this.state.visible ? (
               <FormItem>
                 {getFieldDecorator("item", {
                   rules: [{ required: true, message: "请选择您训练的项目！" }],
                 })(
                   <Select size="large" placeholder="请选择您训练的项目...">
                     <Option value="自由卧推">自由卧推</Option>
                     <Option value="自由深度">自由深蹲</Option>
                     <Option value="器械卧推">器械卧推</Option>
                     <Option value="器械深蹲">器械深蹲</Option>
                     <Option value="固定抬腿">固定抬腿</Option>
                   </Select>
                 )}
               </FormItem>
             ) : null}
             <FormItem>
               {getFieldDecorator("count", {
                 rules: [{ required: true, message: "请输入次数！" }],
               })(
                 <Input
                   size="large"
                   prefix={
                     <Icon type="trophy" style={{ color: "rgba(0,0,0,.25)" }} />
                   }
                   placeholder="请输入次数"
                 />
               )}
             </FormItem>
             <FormItem>
               <div className="has-bottom btn-input">
                 <Link to="../add_data">
                   <Button
                     type="primary"
                     className="input-btn"
                     onClick={this.doSubmit}
                     block
                   >
                     增加当日数据
                   </Button>
                 </Link>
               </div>
             </FormItem>
           </Form>
         </>}
         {succ && (
          <Result
          status="success"
          title="成功添加本日数据！"
          subTitle={this.state.callback}
        />)}
      </div>
    
    );
  }
}

const WrappedNormalLoginForm = Form.create()(NormalLoginForm);

export default WrappedNormalLoginForm;
