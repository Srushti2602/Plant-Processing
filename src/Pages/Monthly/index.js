import React, { useEffect, useState } from 'react';
import { Typography, Menu, Button, Space, Card, Modal } from "antd";
import { Pie, Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, PointElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { LineController, LineElement } from 'chart.js';
ChartJS.register(LineController, LineElement, PointElement, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Monthly() {
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [chartType, setChartType] = useState('line');
  const [data, setData] = useState({});
  const [parameters, setParameters] = useState([]);
  const [showDialogue, setShowDialogue] = useState(true);
  const colors = {
    "Water consumption (m3)": 'rgba(0, 0, 139, 0.5)', // Dark Blue
    "Natural gas consumption (m3)": 'rgba(139, 69, 19, 0.5)', // Dark Brown
    "Grid Electricity Consumption (KWh)": 'rgba(255, 0, 0, 0.5)', // Red
    "Steam Consumption (Tons)": 'rgba(128, 0, 128, 0.5)', // Purple
    "Food waste (Kg)": 'rgba(0, 128, 0, 0.5)', // Green
    "Solar KWh": 'rgba(255, 165, 0, 0.5)', // Orange
    "Water Reycled (m3)": 'rgba(128, 128, 128, 0.5)' // Grey
  };

  useEffect(() => {
    fetch('/data.json')
      .then(response => response.json())
      .then(data => {
        setData(data["Location-1"]);
        setParameters(data["Location-1"].map(item => item.undefined));
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const generateChartData = () => {
    const chartData = {
      labels: parameters,
      datasets: [{
        label: selectedMonth,
        data: parameters.map(param => {
          const entry = data.find(d => d.undefined === param);
          return entry ? parseFloat(entry[selectedMonth]) : 0;
        }),
        backgroundColor: parameters.map(param => colors[param]),
        borderColor: parameters.map(param => colors[param]),
        borderWidth: 1,
      }],
    };

    return chartData;
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `${selectedMonth || ''} Data`,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            if (chartType === 'pie') {
              return `${context.label}: ${context.parsed.y}`;
            } else {
              const label = context.dataset.label || '';
              const value = context.parsed.y;
              const difference = context.dataIndex !== 0 ? value - context.dataset.data[context.dataIndex - 1] : 0;
              const sign = difference >= 0 ? '+' : '-';
              const absDifference = Math.abs(difference).toFixed(2);
              const diffText = context.dataIndex !== 0 ? `${sign}${absDifference}` : '';
              const trendText = context.dataIndex !== 0 ? `${sign === '+' ? 'Up' : 'Down'}: ${diffText}` : '';
              return `${label}: ${value}\n${trendText}`;
            }
          },
        },
      },
    },
  };

  const pieOptions = {
    ...chartOptions,
    maintainAspectRatio: true,
    aspectRatio: 2 
  };

  const renderChart = () => {
    const chartData = generateChartData();
    switch (chartType) {
      case 'line':
        return <Line data={chartData} options={chartOptions} />;
      case 'bar':
        return <Bar data={chartData} options={chartOptions} />;
      case 'pie':
        return <Pie data={chartData} options={pieOptions} />;
      default:
        return <Line data={chartData} options={chartOptions} />;
    }
  };

  return (
    <div>
      <Typography.Title level={4}>Monthly Analysis</Typography.Title>
      <Menu mode="horizontal" selectedKeys={[selectedMonth]} onClick={e => setSelectedMonth(e.key)}>
        {Object.keys(data[0] || {}).filter(key => key.includes("2023")).map(month => (
          <Menu.Item key={month}>{month}</Menu.Item>
        ))}
      </Menu>
      <Modal
        title="Welcome Message"
        visible={showDialogue}
        onOk={() => setShowDialogue(false)}
        onCancel={() => setShowDialogue(false)}
        footer={[
          <Button key="submit" type="primary" onClick={() => setShowDialogue(false)}>
            Close
          </Button>
        ]}
      >
        <Typography.Text> Select the month for which you want to visualize the charts for then you shall be able to see the chart. When you hover over the data points you can see the analysis along with the value . This helps you decide if there was an increase or decrease from the past !</Typography.Text>
      </Modal>
      {!showDialogue && selectedMonth && (
        <>
          <Space style={{ marginTop: 16 }}>
            <Button onClick={() => setChartType('line')} type={chartType === 'line' ? 'primary' : 'default'}>Line Chart</Button>
            <Button onClick={() => setChartType('bar')} type={chartType === 'bar' ? 'primary' : 'default'}>Bar Chart</Button>
            <Button onClick={() => setChartType('pie')} type={chartType === 'pie' ? 'primary' : 'default'}>Pie Chart</Button>
          </Space>
          <Card style={{ marginTop: 16 }}>
            {renderChart()}
          </Card>
        </>
      )}
    </div>
  );
}

export default Monthly;
