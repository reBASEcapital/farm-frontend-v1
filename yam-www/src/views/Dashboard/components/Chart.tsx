import React, { useState } from 'react';

import {
  FlexibleXYPlot,
  XAxis,
  YAxis,
  AreaSeries,
  LineSeries,
  Crosshair,
  HorizontalGridLines,
  VerticalGridLines,
  GradientDefs
} from 'react-vis';

interface Props {
  chartKey: string | number,
  data?: Array<any>
}
const Chart: React.FC<Props> = ({
  chartKey,
  data
}) => {
  const [crosshairValues, setCrosshairValues] = useState([]);
  const axisStyle = {
    ticks: {
      fontSize: '12px',
      color: '#333'
    },
    title: {
      fontSize: '14px',
      color: '#333'
    }
  };

  const gridLineStyle = {
    opacity:0.25,
    stroke: "#000",
    strokeWidth:1
  };

  
  const _onMouseLeave = () => {
    setCrosshairValues([]);
  };
  const _onNearestX = (value, {index}) => {
    setCrosshairValues([value]);
  };

  return (
    <FlexibleXYPlot color="#000" yPadding={60} xType="time" onMouseLeave={_onMouseLeave} height={200} margin={{left: 70}}>
      <HorizontalGridLines style={gridLineStyle} />
      <VerticalGridLines style={gridLineStyle} />
      <XAxis
        style={axisStyle}
        tickLabelAngle={-45}
      />
      <YAxis  />
      <Crosshair
          values={crosshairValues}
          className={'test-class-name'}
        />
      <GradientDefs>
        <linearGradient id="CoolGradient" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#05376C" stopOpacity={0.4}/>
          <stop offset="100%" stopColor="#010F29" stopOpacity={0.3} />
        </linearGradient>
      </GradientDefs>
      <AreaSeries
        color={'url(#CoolGradient)'}
        colorRange={["#EF5D28", "#FF9833"]}
        key={chartKey}
        data={data} 
        onNearestX={_onNearestX}
      />
      <LineSeries
        color="#01B798"
        data={data} 
      />
      
    </FlexibleXYPlot>
  );
}

export default Chart;