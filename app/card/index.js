import React from "react";
import { inject, observer } from "mobx-react";
import {
  Icon,
  Tag,
  message,
  Input,
  Modal,
  Slider,
  Drawer,
  Button,
  TimePicker,
  DatePicker,
  Spin,
  Form,
  Pagination,
  Carousel,
  Card,
  Col,
  Row,
  Avatar,
  Affix,
  Menu,
  Dropdown,
  Table,
  Tabs
} from "antd";

import { computed, toJS } from "mobx";
import { Redirect } from "react-router-dom";
import "react-html5-camera-photo/build/css/index.css";
import { Link } from "react-router-dom";
import getPosition from "@util/pos";
import * as DT from "@util/date";
import EXIF from "@util/small-exif";
import fileToBlobScaled from "@util/fileToBlobScaled";
import { CLOCK_STATUS as clock_status, cardMinute } from "@constant/data";
import { API_SERVER } from "../../constant/apis";
import * as urls from "@constant/urls";
import "./index.less";
import { Item } from "antd-mobile/lib/tab-bar";
import get from '@util/getValue'


var _timeHandle;
const { TabPane } = Tabs;
const { TextArea } = Input;
const { confirm } = Modal;
const { Meta } = Card;
const { SubMenu } = Menu;


@inject("userStore", "confStore")
@observer
class homepage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      olddata: [],
      newdata: [],
      loading: false,
      current: 'mail',
      tabs: [],
    };

  }

  @computed
  get currUser() {
    return this.props.userStore.currUser;
  }

  getcolumns = () => {
    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
      },
      {
        title: 'Age',
        dataIndex: 'age',
      },
      {
        title: 'Address',
        dataIndex: 'address',
      },
    ];

    return (columns)
  }

  getdata = () => {
    const data = [];
    for (let i = 0; i < 46; i++) {
      data.push({
        key: i,
        name: `Edward King ${i}`,
        age: 32,
        address: `London, Park Lane no. ${i}`,
      });
    }
    return (data)
  }
  start = () => {
    this.setState({ loading: true });
    // ajax request after empty completing
    setTimeout(() => {
      this.setState({

        loading: false,
      });
    }, 1000);
  };
  handleClick = e => {
    console.log('click ', e);
    this.setState({
      current: e.key,
    });
  };
  componentDidMount() {
    this.props.userStore.showbase().then((r) => {
      console.log(r);
      let params = r.data;
      let tabsN = [];
      console.log(params)
      params.map((item, index) => {
        console.log(item)
        tabsN.push(item.Tables_in_finaldoc_db);
      })
      console.log(tabsN)
      this.setState({
        tabs: tabsN,
      })
    })

  }

  componentWillUnmount() {

  }

  render() {
    const { uid, rest, comp, clockInSche, page } = this.state;

    if (!this.currUser) {
      return <Redirect to="/login" />;
    }
    const { loading, selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };

    return (
      <>
        <div>
          <Tabs defaultActiveKey="1" style={{ width: "100%" }}>
            {
              this.state.tabs.map((item, index) => {
                return (
                  <TabPane
                    tab={
                      <span>

                        {item}
                      </span>
                    }
                    key={index}
                  >


                  </TabPane>
                )
              })
            }
          </Tabs>
        </div>


       
      <div style={{ marginBottom: '160px', paddingBottom: '160px' }} >
        <div style={{ marginBottom: 16 }}>
          <Button type="primary" onClick={this.start} loading={loading}>
            Reload
          </Button>

        </div>
        <Table pagination={false} columns={this.getcolumns()} dataSource={this.getdata()} />
      </div>
      </>
    );
  }
}

export default homepage;
