import React, { Suspense, lazy } from "react";
import { inject, observer } from "mobx-react";
import {
  Icon,
  Drawer,
  Tag,
  message,
  Input,
  Result,
  Modal,
  Skeleton,
  Button,
  TimePicker,
  DatePicker,
  Spin,
  Badge,
  Select,
  Divider,
  Progress,
  Col,
  Row,
  Switch,
  Card,
  Avatar,
  Tabs,
  Pagination,
} from "antd";
import get from "@util/getValue";
import axios from "axios";
import "./index.less";
import { API_SERVER } from "../../constant/apis";
import { MD5 } from "@util/md5";
import DemoLiquid from "./bullet";
import headImg1 from "./pic/3b74ee7e7e5605d063975c501319c136.jpg";
import WrappedNatrual from "./model";
import ReactEcharts from "echarts-for-react";
import {
  formatDate,
  jsGetAge,
  convertDateFromString,
  now,
} from "../../util/date";

const { Search } = Input;
const { TabPane } = Tabs;

const { Option } = Select;
const { Meta } = Card;

@inject("userStore", "leaveStore")
@observer
class Audit extends React.Component {
  constructor(props) {
    super(props);
    this.date = new Date();
    this.state = {
      loading: true,
      visDrawer: true,
      drawerInfo: { title: "审核" },
      Protein_percent: 0,
      Corben_percent: 0,
      fat_percent: 0,
      energy_percent: 0,
      searchValue: "",
      foodlist: [],
      spinning: false,
      visible: false,
      visiblenumber: -1,
      nutrition: [],
      portein: 0,
      energy: 0,
      fat: 0,
      suger: 0,
      corbain: 0,
      bmr: 0,
      goal: "",
      porteineed: 0,
      energyneed: 0,
      fatneed: 0,
      sugerneed: 0,
      user: null,
    };

    console.log(JSON.stringify(this.props.userStore.currUser));
  }

  getOtion = () => {
    const option = {
      series: [
        {
          name: "营养成分表(饼状图)",
          type: "pie",
          radius: "55%",
          data: [],
        },
      ],
    };
    this.state.nutrition.map((item, index) => {
      if (item.value > 10) {
        option.series[0].data.push({
          value: item.value,
          name: item.nutrientName,
        });
      }
    });

    return option;
  };
  getOtionbar = () => {
    const optionbar = {
      title: {
        text: "营养成分表(条形图)",
        subtext: "数据来自美国农业部USDA",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },

      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      yAxis: {
        type: "value",
        boundaryGap: [0, 0.01],
      },
      xAxis: {
        type: "category",
        data: [],
      },
      series: [
        {
          name: "营养含量",
          type: "bar",
          data: [],
        },
      ],
    };
    this.state.nutrition.map((item, index) => {
      if (item.value > 10) {
        optionbar.series[0].data.push(item.value);
        optionbar.xAxis.data.push(
          item.nutrientName + "(单位：" + item.unitName + ")"
        );
      }
    });
    return optionbar;
  };
  getPicbar = () => {
    const symbols = [
      "path://M36.7,102.84c-1.17,2.54-2.99,4.98-3.39,7.63c-1.51,9.89-3.31,19.58-1.93,29.95 c0.95,7.15-2.91,14.82-3.57,22.35c-0.64,7.36-0.2,14.86,0.35,22.25c0.12,1.68,2.66,3.17,4.67,5.4c-0.6,0.82-1.5,2.22-2.58,3.48 c-0.96,1.12-1.96,2.35-3.21,3.04c-1.71,0.95-3.71,2.03-5.51,1.9c-1.18-0.08-3.04-2.13-3.16-3.43c-0.44-4.72,0-9.52-0.41-14.25 c-0.94-10.88-2.32-21.72-3.24-32.61c-0.49-5.84-1.63-12.01-0.35-17.54c3.39-14.56,2.8-28.84,0.36-43.4 c-2.71-16.16-1.06-32.4,0.54-48.59c0.91-9.22,4.62-17.36,8.53-25.57c1.32-2.77,1.88-6.84,0.87-9.62C21.89-3.77,18.09-11,14.7-18.38 c-0.56,0.1-1.13,0.21-1.69,0.31C10.17-11.52,6.29-5.2,4.71,1.65C2.05,13.21-4.42,22.3-11.43,31.28c-1.32,1.69-2.51,3.5-3.98,5.04 c-4.85,5.08-3.25,10.98-2.32,16.82c0.25,1.53,0.52,3.06,0.77,4.59c-0.53,0.22-1.07,0.43-1.6,0.65c-1.07-2.09-2.14-4.19-3.28-6.44 c-6.39,2.91-2.67,9.6-5.23,15.16c-1.61-3.31-2.77-5.68-3.93-8.06c0-0.33,0-0.67,0-1c6.96-16.08,14.63-31.9,20.68-48.31 C-5.24-4.07-2.03-18.55,2-32.73c0.36-1.27,0.75-2.53,0.98-3.82c1.36-7.75,4.19-10.23,11.88-10.38c1.76-0.04,3.52-0.21,5.76-0.35 c-0.55-3.95-1.21-7.3-1.45-10.68c-0.61-8.67,0.77-16.69,7.39-23.19c2.18-2.14,4.27-4.82,5.25-7.65c2.39-6.88,11.66-9,16.94-8.12 c5.92,0.99,12.15,7.93,12.16,14.12c0.01,9.89-5.19,17.26-12.24,23.68c-2.17,1.97-5.35,4.77-5.17,6.94c0.31,3.78,4.15,5.66,8.08,6.04 c1.82,0.18,3.7,0.37,5.49,0.1c5.62-0.85,8.8,2.17,10.85,6.73C73.38-27.19,78.46-14.9,84.2-2.91c1.52,3.17,4.52,5.91,7.41,8.09 c7.64,5.77,15.57,11.16,23.45,16.61c2.28,1.58,4.64,3.23,7.21,4.14c5.18,1.84,8.09,5.63,9.82,10.46c0.45,1.24,0.19,3.71-0.6,4.18 c-1.06,0.63-3.15,0.27-4.44-0.38c-7.05-3.54-12.84-8.88-19.14-13.5c-3.5-2.57-7.9-4-12.03-5.6c-9.44-3.66-17.73-8.42-22.5-18.09 c-2.43-4.94-6.09-9.27-9.69-14.61c-1.2,10.98-4.46,20.65,1.14,31.19c6.62,12.47,5.89,26.25,1.21,39.49 c-2.52,7.11-6.5,13.74-8.67,20.94c-1.91,6.33-2.2,13.15-3.23,19.75c-0.72,4.63-0.84,9.48-2.36,13.84 c-2.49,7.16-6.67,13.83-5.84,21.82c0.42,4.02,1.29,7.99,2.1,12.8c-3.74-0.49-7.47-0.4-10.67-1.66c-1.33-0.53-2.43-4.11-2.07-6.01 c1.86-9.94,3.89-19.69,0.07-29.74C34.55,108.63,36.19,105.52,36.7,102.84c1.25-8.45,2.51-16.89,3.71-24.9 c-0.83-0.58-0.85-0.59-0.87-0.61c-0.03,0.16-0.07,0.32-0.09,0.48C38.53,86.15,37.62,94.5,36.7,102.84z",
      "path://M40.02-99c2.07,1.21,4.26,2.25,6.19,3.66c5.94,4.34,8.23,12.57,4.95,19.79 c-3.21,7.08-6.82,14.03-10.86,20.67c-2.17,3.56-1.25,5.38,1.99,6.36c2.94,0.89,6.36,1.91,9.15,1.21c5.51-1.4,8.33,1.23,10.66,5.29 c4.71,8.22,9.72,16.29,13.84,24.8C81.06-6.65,89,0.4,99.56,5.17C109.82,9.8,120,14.7,129.85,20.15c4.72,2.61,9.09,6.37,10.24,12.97 c-2.89-1.93-5.2-3.75-7.78-5.04c-0.99-0.5-2.6,0.22-4.83,0.5c-5.36-9.35-16.8-9.4-26.74-12.62C91.68,13.04,81.82,11.37,75.66,3 c-5.98-8.13-11.61-16.52-17.4-24.79c-0.46-0.66-0.98-1.27-1.66-2.16c-3.21,7.75-6.78,15-9.12,22.63c-1.15,3.76-0.64,8.37,0.26,12.33 c0.81,3.59,3.01,6.92,4.87,10.22c6.73,11.95,2.41,22.89-2.91,33.75c-0.35,0.72-0.86,1.43-1.46,1.97 c-7.11,6.38-14.48,12.5-21.24,19.22c-2.08,2.07-3.1,5.7-3.62,8.77c-1.92,11.44-3.81,22.92-4.93,34.46 c-0.5,5.16,1.06,10.49,1.28,15.75c0.23,5.7,0.39,11.47-0.15,17.13c-1.15,12.11-2.83,24.17-4.11,36.27c-0.18,1.72,0.8,3.53,1.13,5.33 c0.88,4.76-0.22,6.23-4.71,5.17c-4.53-1.06-8.86-2.94-14.27-4.8c1.98-1.62,2.84-2.83,3.94-3.12c5.42-1.44,7-5.2,6.39-10.23 c-1.39-11.39-3.15-22.73-4.24-34.14c-0.53-5.56,0.16-11.23,0.24-16.85c0.06-4.49,0.01-8.97,0.01-14.72 c-2.79,1.53-5.2,2.27-6.79,3.83c-4.26,4.19-8.39,8.56-12.11,13.22c-1.55,1.95-2.19,4.76-2.79,7.29c-0.47,1.99,0.6,5.02-0.48,6.05 c-2.17,2.08-5.2,3.79-8.13,4.38c-3.61,0.73-7.49,0.18-12.26,0.18c6.34-8.69,11.91-16.11,17.22-23.71c3.29-4.71,6.23-9.67,9.24-14.58 c2.15-3.5,3.76-7.4,6.3-10.57c5.38-6.73,6.74-14.28,6.72-22.64C0.88,68.3,1.36,57.91,2.26,47.58c0.69-7.85,2.15-15.67,3.7-23.41 c0.77-3.83,2.89-7.39,3.72-11.22c1.83-8.4-1.9-16-4.38-23.95C2.96-5.34-0.31,0.12-1.5,6c-1.96,9.72-7.34,17.44-12.26,25.57 c-4.39,7.25-8.79,14.52-12.75,22.01c-2.64,5-4.5,10.41-6.83,15.92c-4.82-5.28-4.65-10.59-0.94-16.97 C-21.4,30.4-12.08,6.78-6.17-18.12c1.4-5.88,1.24-12.11,2.23-18.12c1.2-7.27,4.15-9.56,11.39-9.69c8.65-0.14,13.86-4.77,14.48-13.51 c0.35-5.01,0.16-10.11-0.28-15.12c-0.82-9.3,2.49-16.57,10.17-21.69c2.08-1.39,4.78-1.87,7.2-2.76C39.35-99,39.69-99,40.02-99z",
      "path://M-57,41.03c3.65-4.15,7.17-8.43,10.98-12.42c6.53-6.83,13.31-13.41,19.84-20.23 c1.76-1.84,3.51-3.98,4.4-6.31c3.8-9.99,6.99-20.23,10.99-30.14c2.74-6.79,5.65-13.62,12.37-17.95c4.17-2.68,5.12-7.31,4.29-11.96 c-0.3-1.67-2.02-3.08-3.35-4.97c-2.57,5.59-4.62,10.03-7.21,15.66c-4.79-6.43-9.76-10.83-11.68-16.31 c-1.77-5.04-1.18-11.44,0.04-16.86c1.27-5.62,5.24-9.71,12.03-9.7c1.55,0,3.1-1.68,4.66-2.55c9.3-5.22,20.47-1.53,25.73,7.59 c4.06,7.04,4.84,14.6,5.57,22.26c0.65,6.82-0.32,7.59-8.26,8.11c0,1.97,0,3.96,0,5.95c8.01-0.17,8.01,0.43,12.02,7.52 c2.09,3.69,6.34,6.1,9.41,9.29c2.48,2.58,7.04,3.14,7.24,8c0.29,6.79,0.46,6.78-6.43,11.08c0,15.78-0.02,31.49,0.03,47.2 c0,1.23,0.29,2.51,0.71,3.67c1.64,4.59,3.27,9.19,5.13,13.7c0.79,1.92,1.88,3.83,3.26,5.36c7.54,8.36,15.45,16.41,22.75,24.96 c5.09,5.97,9.05,12.9,14.18,18.84c9.73,11.26,19.47,22.59,30.08,33c8.84,8.67,18.88,16.13,28.51,23.98 c2.52,2.06,5.48,3.58,8.27,5.36c-4.02,3.54-10.94,4.01-16.34,1.62c-4.76-2.11-9.63-4.03-14.6-5.56c-5.6-1.72-6.59-3.72-4.42-9.32 c0.47-1.22-0.12-3.8-1.11-4.5c-7.36-5.15-14.66-10.53-22.55-14.78c-8.49-4.57-15.35-10.3-19.59-19.04 c-4.29-8.84-11.6-14.85-19.48-20.29c-3.2-2.21-6.43-4.4-9.64-6.6c-0.53,0.17-1.05,0.33-1.58,0.5c-0.11,11.17,0.12,22.36-0.45,33.51 c-0.29,5.72-2.33,11.33-3,17.05c-1.68,14.31-3.04,28.65-4.51,42.98c-0.34,3.34,0.94,5.76,4.12,7.18c6.09,2.73,12.14,5.56,18.61,9.26 c-3.96,0.36-7.93,0.72-11.89,1.08c-4.92,0.45-9.91,0.53-14.76,1.42c-6.96,1.28-9.68-0.99-8.69-8.02c1.73-12.28,0.67-24.36-1.4-36.56 c-1.08-6.36-2.02-14.02,0.49-19.47c5.62-12.19,2.4-23.48,0.01-35.2c-2.05-10.04-3.8-20.14-5.9-30.17c-0.32-1.52-1.72-2.91-2.87-4.13 c-3.6-3.83-8.03-7.09-10.85-11.41c-6.61-10.14-2.6-19.6,3.74-28.13c5.27-7.1,6.85-14.1,2.15-21.95c-3.79-6.34-7.53-12.7-11.38-19 c-0.46-0.75-1.41-1.2-2.77-2.3c-3.27,7.28-6.98,13.9-9.24,20.98c-3.58,11.2-12.11,17.05-21.53,22.3c-1.86,1.04-3.57,2.44-5.53,3.21 c-4.29,1.67-6.09,3.88-4.9,9.01c0.69,2.96-1.31,6.55-2.1,9.86c-0.5,0.03-0.99,0.06-1.49,0.08c-0.18-2.57-0.36-5.14-0.66-9.41 c-3.45,4.38-6.11,7.75-9.33,11.84c-1.07-2.08-1.61-3.13-2.15-4.18C-57,43.7-57,42.36-57,41.03z",
    ];
    
    const bodyMax = 180;
    

    const markLineSetting = {
      symbol: "none",
      lineStyle: {
        opacity: 0.3,
      },
      data: [
        {
          type: "max",
          label: {
            formatter: "max: {c}",
          },
        },
        {
          type: "min",
          label: {
            formatter: "min: {c}",
          },
        },
      ],
    };
    const option = {
      tooltip: {},

      xAxis: {
        data: ["碳水摄入", "蛋白质摄入", "脂肪摄入"],
        axisTick: { show: false },
        axisLine: { show: false },
        axisLabel: { show: false },
      },
      yAxis: {
        max: bodyMax,
        offset: 20,
        splitLine: { show: false },
        name:"百分之"
      },
      grid: {
        top: "center",
        height: 230,
      },
      markLine: {
        z: -100,
      },
      series: [
        {
          name: "已摄入百分之",
          type: "pictorialBar",
          symbolClip: true,
          symbolBoundingData: bodyMax,
         
          data: [
            {
              value: (
                (this.state.energy / this.state.energyneed) *
                100
              ).toFixed(2),
              symbol: symbols[0],
            },
            {
              value: (
                (this.state.portein / this.state.porteineed) *
                100
              ).toFixed(2),
              symbol: symbols[1],
            },
            {
              value: ((this.state.fat / this.state.fatneed) * 100).toFixed(2),
              symbol: symbols[2],
            },
          ],
          markLine: markLineSetting,
          z: 10,
        },
        {
          name: "应摄入",
          type: "pictorialBar",
          symbolBoundingData: bodyMax,
          animationDuration: 0,
          itemStyle: {
            color: "#ccc",
          },
          data: [
            {
              value:  (this.state.energyneed).toFixed(2),
              symbol: symbols[0],
            },
            {
              value: (this.state.porteineed).toFixed(2),
              symbol: symbols[1],
            },
            {
              value: (this.state.fatneed).toFixed(2),
              symbol: symbols[2],
            },
          ],
        },
      ],
    };

    return option;
  };
  showModal = (number) => {
    console.log("?????");
    this.setState({
      visible: true,
      visiblenumber: number,
      nutrition: this.state.foodlist[number].foodNutrients,
    });
  };

  handleOk = (item) => {
    console.log(item);
    let Nutrial = item.foodNutrients;
    let p = 0;
    let e = 0;
    let s = 0;
    let f = 0;
    Nutrial.map((item, index) => {
      if (item.nutrientId === 1008) {
        e = item.value;
      }
      if (item.nutrientId === 1085) {
        f = item.value;
      }
      if (item.nutrientId === 1003) {
        p = item.value;
      }
      if (item.nutrientId === 1063) {
        s = item.value;
      }
    });
    let params = {
      user: this.state.user,
      portein: this.state.portein + p,
      energy: this.state.energy + e,
      fat: this.state.fat + f,
      suger: this.state.suger + s,
    };
    this.props.leaveStore.POST_NUTRIATION(params).then((data) => {
      console.log(data.data);
    });
    this.setState({
      visible: false,
      portein: this.state.portein + p,
      energy: this.state.energy + e,
      fat: this.state.fat + f,
      suger: this.state.suger + s,
    });
  };

  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  //随机salt加盐
  randomString = (length) => {
    var chars = "0123456789".split("");

    if (!length) {
      length = Math.floor(Math.random() * chars.length);
    }

    var str = "";
    for (var i = 0; i < length; i++) {
      str += chars[Math.floor(Math.random() * chars.length)];
    }
    return str;
  };

  showDrawer = (type) => {
    const drawerInfo = { title: type };
    this.setState({
      visDrawer: true,
      drawerInfo,
    });
  };
  onSearch = (value) => {
    let food = {
      query: value,
      dataType: ["Foundation", "SR Legacy"],
      sortBy: "fdcId",
      sortOrder: "desc",
    };
    this.props.leaveStore.APPLY_FOOD_POST(food).then((data) => {
      console.log(data);
      this.setState({
        foodlist: data.data.foods,
        spinning: false,
      });
      console.log(this.state.foodlist);
    });
  };

  onClose = () => {
    this.setState({
      visDrawer: false,
    });
  };

  increase = (dish) => {
    let percent = this.state.percent + 10;
    if (percent > 100) {
      percent = 100;
    }
    this.setState({ percent });
  };

  decline = (dish) => {
    let percent = this.state.percent - 10;
    if (percent < 0) {
      percent = 0;
    }
    this.setState({ percent });
  };
  componentDidMount() {
    let user = this.props.userStore.currUser;
    let email = get(user, "email", "");
    let birth = new Date(get(user, "birth_date", ""));
    let age = jsGetAge(birth);
    let sex = get(user, "sex", "") === 1 ? "男" : "女";
    let weight = get(user, "weight", "");
    let height = get(user, "height", "");
    let goal = get(user, "goal", "");
    let goalnum = 0;
    if (goal === "增肌塑形") {
      goalnum = 1.2;
    }
    if (goal === "减肥减脂") {
      goalnum = 0.8;
    }
    if (goal === "保持身材") {
      goalnum = 1;
    }
    if (sex === "男") {
      let bmrnew = 66 + 13.7 * weight + 5 * height - 6.8 * age;
      this.setState({
        user: email,
        bmr: bmrnew,
        goal: goal,
        porteineed: weight * 1.1 * goalnum,
        energyneed: bmrnew * goalnum,
        fatneed:
          (bmrnew -
            (weight * 1.1 * goalnum + 1.25 * 1.3 * weight * goalnum) * 4) /
          9,
        sugerneed: 1.25 * 1.3 * weight * goalnum,
      });
    } else if (sex === "女") {
      let bmrnew = 655 + 9.6 * weight + 1.7 * height - 4.7 * age;
      this.setState({
        user: user,
        bmr: bmrnew,
        goal: goal,
        porteineed: weight * 1.1 * goalnum,
        energyneed: bmrnew * goalnum,
        fatneed:
          (bmrnew -
            (weight * 1.1 * goalnum + 1.25 * 1.3 * weight * goalnum) * 4) /
          9,
        sugerneed: 1.25 * 1.3 * weight * goalnum,
      });
    }
    let params = {
      user: email,
    };
    this.props.leaveStore.GET_NUTRIATION(params).then((data) => {
      console.log(data.data);
      let diet_dish = data.data.data[0];
      let p = diet_dish.PORTEINSUM;

      let e = diet_dish.ENERGYSUM;
      let s = diet_dish.SUGERSUM;
      let f = diet_dish.FATSUM;
      console.log(p, e, s, f);
      this.setState({
        portein: p,
        energy: e,
        fat: f,
        suger: s,
      });
    });
  }
  render() {
    return (
      <div>
        <div>
          <div>
            {" "}
            <Tabs defaultActiveKey="1" style={{ width: "100%" }}>
              <TabPane
                tab={
                  <span>
                    <Icon type="search" />
                    查询
                  </span>
                }
                key="1"
              >
                <div>
                  <div style={{ width: "100%", height: "100px" }}>
                    <img
                      src={headImg1}
                      style={{ width: "100%", objectFit: "cover" }}
                      alt=""
                    />
                  </div>
                  <div
                    style={{
                      textAlign: "center",
                      position: "relative",
                      top: "-50px",
                    }}
                  >
                    <h1 style={{ color: "white" }}>FOOD SEARCH</h1>
                  </div>

                  <Search
                    style={{ padding: "10px" }}
                    placeholder="请用英文查询"
                    onSearch={(value) => this.onSearch(value)}
                    enterButton
                  />
                </div>
                <Spin spinning={this.state.spinning} tip="Loading..."></Spin>
                <div>
                  {this.state.foodlist.map((item, index) => {
                    return (
                      <Col
                        xs={24}
                        sm={24}
                        md={12}
                        lg={12}
                        style={{ height: "40%" }}
                        key={index + item}
                      >
                        <Card
                          title={item.description}
                          extra={
                            <div>
                              <Button
                                type="default"
                                onClick={() => this.showModal(index)}
                              >
                                more
                              </Button>
                              {!(index === this.state.visiblenumber) && (
                                <div></div>
                              )}

                              {index === this.state.visiblenumber && (
                                <Modal
                                  title={item.description}
                                  visible={this.state.visible}
                                  onCancel={this.handleCancel}
                                  footer={[
                                    <Button
                                      key="cancel"
                                      onClick={this.handleCancel}
                                    >
                                      返回
                                    </Button>,
                                    <Button
                                      key="check"
                                      onClick={() => this.handleOk(item)}
                                    >
                                      添加100g
                                    </Button>,
                                  ]}
                                  destroyOnClose
                                >
                                  <div>
                                    <ReactEcharts
                                      option={this.getOtion()}
                                    ></ReactEcharts>
                                    <ReactEcharts
                                      style={{ height: "300px" }}
                                      option={this.getOtionbar()}
                                    ></ReactEcharts>
                                  </div>
                                </Modal>
                              )}
                            </div>
                          }
                        >
                          <p
                            style={{
                              fontSize: 14,
                              color: "rgba(0, 0, 0, 0.85)",
                              marginBottom: 16,
                              fontWeight: 500,
                            }}
                          >
                            商品简介：
                          </p>
                          <Card type="inner" title="主要属性">
                            {item.description}
                          </Card>
                          <Card
                            style={{ marginTop: 16 }}
                            type="inner"
                            title="更新时间"
                          >
                            {item.publishedDate}
                          </Card>
                        </Card>
                      </Col>
                    );
                  })}
                </div>
              </TabPane>
              <TabPane
                tab={
                  <span>
                    <Icon type="appstore" />
                    分类
                  </span>
                }
                key="2"
              >
                <div style={{ textAlign: "center" }}>
                  <h2>常见食物分类</h2>
                </div>
                <div>
                  <ul style={{ margin: "0px", padding: "0px" }}>
                    <Row>
                      <Col
                        xs={12}
                        sm={12}
                        md={8}
                        lg={6}
                        style={{ height: "40%" }}
                      >
                        <Card
                          cover={
                            <img
                              alt="example"
                              src={API_SERVER + "/pic/shu.png"}
                            />
                          }
                        >
                          <Meta
                            title="谷薯芋、杂豆、主食"
                            description="米饭，玉米，馒头，燕麦片，面包"
                          />
                        </Card>
                      </Col>
                      <Col
                        xs={12}
                        sm={12}
                        md={8}
                        lg={6}
                        style={{ height: "40%" }}
                      >
                        <Card
                          cover={
                            <img
                              alt="example"
                              src={API_SERVER + "/pic/meat_egg.png"}
                            />
                          }
                        >
                          <Meta
                            title="蛋类、肉类及制品"
                            description=" 鸡蛋，猪肉，鸡，火腿肠"
                          />
                        </Card>
                      </Col>
                      <Col
                        xs={12}
                        sm={12}
                        md={8}
                        lg={6}
                        style={{ height: "40%" }}
                      >
                        <Card
                          cover={
                            <img
                              alt="example"
                              src={API_SERVER + "/pic/milk.png"}
                            />
                          }
                        >
                          <Meta
                            title="奶类及制品"
                            description=" 酸奶，牛奶，奶酪，乳清"
                          />
                        </Card>
                      </Col>
                      <Col
                        xs={12}
                        sm={12}
                        md={8}
                        lg={6}
                        style={{ height: "40%" }}
                      >
                        <Card
                          cover={
                            <img
                              alt="example"
                              src={API_SERVER + "/pic/vagetable.png"}
                            />
                          }
                        >
                          <Meta
                            title="蔬果和菌藻"
                            description=" 苹果，番茄，白菜，蘑菇，木耳"
                          />
                        </Card>
                      </Col>
                      <Col
                        xs={12}
                        sm={12}
                        md={8}
                        lg={6}
                        style={{ height: "40%" }}
                      >
                        <Card
                          cover={
                            <img
                              alt="example"
                              src={API_SERVER + "/pic/beans.png"}
                            />
                          }
                        >
                          <Meta
                            title="坚果、大豆及制品"
                            description=" 豆浆，豆腐，核桃(干)，夏威夷果，巴旦木"
                          />
                        </Card>
                      </Col>
                      <Col
                        xs={12}
                        sm={12}
                        md={8}
                        lg={6}
                        style={{ height: "40%" }}
                      >
                        <Card
                          cover={
                            <img
                              alt="example"
                              src={API_SERVER + "/pic/drink.png"}
                            />
                          }
                        >
                          <Meta
                            title="饮料"
                            description="薄荷茶，咖啡，奶茶，可乐，乳酸菌饮料"
                          />
                        </Card>
                      </Col>
                      <Col
                        xs={12}
                        sm={12}
                        md={8}
                        lg={6}
                        style={{ height: "40%" }}
                      >
                        <Card
                          cover={
                            <img
                              alt="example"
                              src={API_SERVER + "/pic/oil.png"}
                            />
                          }
                        >
                          <Meta
                            title="食用油、油脂及制品"
                            description="色拉油，花生油，豆油，混合油(菜+棕)，葵花籽油"
                          />
                        </Card>
                      </Col>
                    </Row>
                  </ul>
                </div>
              </TabPane>
              <TabPane
                tab={
                  <span>
                    <Icon type="schedule" />
                    进度
                  </span>
                }
                key="3"
              >
                <div style={{ textAlign: "center" }}>
                  <h2>今日摄入的营养</h2>
                  <h3>根据您已经上传的消息，系统给您如下的推荐方案</h3>
                  <div style={{ backgroundColor: "#f6f6f6", fontSize: "15px" }}>
                    <span>您的BMR(基础代谢率)为：{this.state.bmr}cal</span>
                    <br></br>
                    <span>您的运动系数为：1.5 即 有规律的适当运动</span>
                    <br></br>
                    <span>
                      您的DEE(维持每日所需热量)为：
                      {(this.state.bmr * 1.5).toFixed(2)}cal
                    </span>
                    <br></br>
                    <span>您的目标为：{this.state.goal}</span>
                    <br></br>
                    <br></br>
                    <span>
                      因此，推荐的热量摄入为：{this.state.energyneed.toFixed(2)}
                      大卡
                    </span>
                    <br></br>
                    <span>
                      因此，推荐的碳水摄入为：{this.state.sugerneed.toFixed(2)}
                      克
                    </span>
                    <br></br>
                    <span>
                      因此，推荐的蛋白摄入为：{this.state.porteineed.toFixed(2)}
                      克
                    </span>
                    <br></br>
                    <span>
                      因此，推荐的脂肪摄入为：{this.state.fatneed.toFixed(2)}克
                    </span>
                    <br></br>
                  </div>

                  <div>
                    <Col xs={24} sm={24} md={8} lg={8}>
                      <Progress
                        style={{ padding: "20px" }}
                        type="circle"
                        strokeColor={{
                          "0%": "#108ee9",
                          "100%": "#87d068",
                        }}
                        percent={(
                          (this.state.energy / this.state.energyneed) *
                          100
                        ).toFixed(2)}
                      />
                      碳水摄入量
                    </Col>

                    <Col xs={24} sm={24} md={8} lg={8}>
                      <Progress
                        style={{ padding: "20px" }}
                        type="circle"
                        strokeColor={{
                          "0%": "#108ee9",
                          "100%": "#87d068",
                        }}
                        percent={(
                          (this.state.portein / this.state.porteineed) *
                          100
                        ).toFixed(2)}
                      />
                      蛋白质摄入量
                    </Col>

                    <Col xs={24} sm={24} md={8} lg={8}>
                      <Progress
                        style={{ padding: "20px" }}
                        type="circle"
                        strokeColor={{
                          "0%": "#108ee9",
                          "100%": "#87d068",
                        }}
                        percent={(
                          (this.state.fat / this.state.fatneed) *
                          100
                        ).toFixed(2)}
                      />
                      脂肪摄入量
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={12} style={{alignItems:"center"}}>
                    <ReactEcharts option={this.getPicbar()} style={{marginBottom:"100px"}}></ReactEcharts>
                    </Col>
                  </div>
                </div>
              </TabPane>
            </Tabs>
          </div>
        </div>
      </div>
    );
  }
}

export default Audit;
