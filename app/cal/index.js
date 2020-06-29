import React, { Suspense, lazy } from "react";
import { inject, observer } from "mobx-react";
import {
  Badge,
  Icon,
  Tag,
  message,
  Calendar,
  Input,
  Result,
  Modal,
  Skeleton,
  Button,
  TimePicker,
  DatePicker,
  Spin,
} from "antd";
import { Link } from "react-router-dom";
import "./index.less";
import * as DT from "@util/date";
import { toJS } from "mobx";
import get from "@util/getValue";
import MobileSelect from "mobile-select";
import MDatePicker from "react-mobile-datepicker";
import moment from "moment";
import { USER_MOMENT_TYPE } from "@constant/data";
import WrappedNormalLoginForm from "./Formdemo";

function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

var caluLine = (line) => {
  let m = moment(new Date());
  // let m = moment({ year :2019, month :2, day :5})
  let date = m.date();
  let day = m.day();
  let month = m.month();
  let year = m.year();
  let mf = moment({ year: year, month: month, day: 1 }); // 每月第一天
  let mday = mf.day(); //每月第一天是星期几
  let dd = date + mday - 8; //剩余天
  if (dd % 7 == 0) {
    line = dd / 7;
  } else {
    line = parseInt(dd / 7) + 1;
  }
  return line;
};

@inject("userStore", "calStore")
@observer
class Cal extends React.Component {
  constructor(props) {
    super(props);
    this.date = new Date();
    this.state = {
      loading_cal: false,
      loading_del: false,
      add_flag: true,
      mini: false,
      cardList: [],
      ModalText: "Content of the modal",
      visible: false,
      confirmLoading: false,
      refresh: 2,
      value: moment(this.date),
      selectedValue: moment("2017-01-25"),
    };
    console.log(JSON.stringify(this.props.userStore.currUser));
  }
  handleOk = (e) => {
    //点击对话框OK按钮触发的事件
    console.log();
    this.setState({
      ModalText: "The modal will be closed after two seconds",
      confirmLoading: false,
      visible: true,
    }); //上面的代码可以忽略
    let demo = this.refs.getFormVlaue; //通过refs属性可以获得对话框内form对象
    demo.validateFields((err, values) => {
      if (!err) {
        console.log(values); //这里可以拿到数据
      }
    });
  };
  handleCancel = () => {
    //点击取消按钮触发的事件
    console.log("Clicked cancel button");
    this.setState({
      visible: false,
      refresh: 2,
    });
    console.log(this.state.refresh);
  };

  getListData = (value) => {
   // console.log(value);
    let yearmonth = moment(value).format("YYYY/MM/DD");
    // console.log(yearmonth);
    let listData = [];
    this.state.cardList.map((item, key) => {
      if (moment(item.time).format("YYYY/MM/DD") === yearmonth) {
        console.log(yearmonth, "==>", item, "??", key);
        if (item.type === "excercise") {
          listData.push({ color: "lime",text:"训练"+item.ex_item+item.count });
          
        }
        if (item.type === "step") {
          listData.push({ color: "gold",text:"步数"+item.count });
        }
        if (item.type === "heart") {
          listData.push({ color: "red",text:"心率"+item.count });
        }
        if (item.type === "temperature") {
          listData.push({ color: "orange",text:"体温"+item.count});
        }
        if (item.type === "pressure") {
          listData.push({ color: "purple",text:"血压"+item.count });
        }
      }
    });
    // console.log(listData || []);
    return listData || [];
  };

  dateCellRender = (value) => {
    //console.log(value);
    // this.doDetail(value);
    
    const listData = this.getListData(value);
    return (
      <ul className="events">
        {listData.map((item, index) => (
          <Badge key={index + item} color={item.color} text={item.text} />
        ))}
      </ul>
    );
  };

  getMonthData = (value) => {
    
  };

  monthCellRender = (value) => {
    const num = this.getMonthData(value);
    return num ? (
      <div className="notes-month">
        <section>{num}</section>
        <span>Backlog number</span>
      </div>
    ) : null;
  };
  onSelect = (cal) => {
    console.log(cal);
    this.setState({
      cal,
      selectedValue: cal,
      visible: true,
    });
  };
  checkdata = (value) => {
    console.log(1111);
    this.setState({
      add_flag: false,
    });
  };
  onChange=(value)=>{
   
    this.setState({
      
    })
  }
  onPanelChange = (value) => {
    console.log(value);
    this.setState({ value:value,refresh:1 });
   // this.updateCal();
    
  };
  componentDidMount = () => {
    console.log("================componentDidMount========================");
    let user = this.props.userStore.currUser;
    let email = get(user, "email", "");
    let month = moment(this.state.value).format("YYYY/MM");
    console.log(month);
    console.log(email);
    this.props.calStore
      .getCardByMonth({ month: month, uid: email })
      .then((r) => {
        console.log(r.data.data);
        this.setState({
          cardList: r.data.data,
        });
        console.log(this.state.cardList);
      });
  };
  //////////////////////////////////////!!!!!!??????????????????????????
  updateCal=()=>{
    console.log("================updateCal========================");
    let user = this.props.userStore.currUser;
    let email = get(user, "email", "");
    let month = moment(this.state.value).format("YYYY/MM");
    console.log(month);
    console.log(email);
    this.props.calStore
      .getCardByMonth({ month: month, uid: email })
      .then((r) => {
        console.log(r.data.data);
        this.setState({
          cardList: r.data.data,
        });
        console.log(this.state.cardList);
      });
  }
  // shouldComponentUpdate = () => {
  //   console.log(
  //     "===================shouldComponentUpdate====================="
  //   );
  //   let refreshflag=(this.state.refresh<0&&this.state.visible!==true)?false:true;
  //   console.log(refreshflag);
  //   return refreshflag;
  // };
  componentDidUpdate = () => {
    console.log(
      "====================componentDidUpdate======================"
    );
    let user = this.props.userStore.currUser;
    let email = get(user, "email", "");
    let month = moment(this.state.value).format("YYYY/MM");
    //console.log(month);
    //console.log(email);
      console.log(this.state.refresh)
    if (this.state.refresh>0) {
      this.props.calStore
        .getCardByMonth({ month: month, uid: email })
        .then((r) => {
          console.log(r.data.data);
          this.setState({
            cardList: r.data.data,
            refresh: this.state.refresh-1,
          });
         
        });
    }
  };
  render() {
    const {
      value,
      selectedValue,
      visible,
      confirmLoading,
      ModalText,
      add_flag,
    } = this.state;
    let user = this.props.userStore.currUser;
    let email = get(user, "email", "");
    //cardvalue!!!!

    // if(r.data.data!==this.state.cardList)
    // {
    //   this.setState({
    //     cardList:r.data.data,

    //   });
    // }

    return (
      <div>
        
        <Calendar
          value={value}
          onSelect={this.onSelect}
          onPanelChange={this.onPanelChange}
          dateCellRender={this.dateCellRender}
          monthCellRender={this.monthCellRender}
          onChange={this.onChange}
        ></Calendar>
        <div>
          <Modal
            title={selectedValue.format("YYYY/MM/DD")}
            visible={visible}
            onOk={this.handleOk}
            confirmLoading={confirmLoading}
            onCancel={this.handleCancel}
            footer={[
              <Button key="cancel" onClick={this.handleCancel}>
                返回
              </Button>,
              <Button key="check" onClick={this.checkdata}>
                查看本日数据(暂无)
              </Button>,
            ]}
            destroyOnClose
          >
            <WrappedNormalLoginForm
              ref="getFormVlaue"
              date={selectedValue}
              addflag={add_flag}
              user={email}
              updatecal={this.updateCal}
            />
          </Modal>
        </div>
        {console.log(selectedValue.format("YYYY-MM-DD"))}
      </div>
    );
  }
}

export default Cal;
