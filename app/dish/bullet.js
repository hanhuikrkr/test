import React from 'react';
import { Liquid } from '@ant-design/charts';
const DemoLiquid = () => {
  const config = {
    title: {
      visible: true,
      text: '水波图',
    },
    description: {
      visible: true,
      text: '水波图 - 百分比显示',
    },
    min: 0,
    max: 10000,
    value: 5639,
    statistic: {
      formatter: value => `${((100 * value) / 10000).toFixed(1)}%`,
    },
  };
  return <Liquid {...config} />;
};
export default DemoLiquid;