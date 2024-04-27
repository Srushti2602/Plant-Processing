import React, { useEffect, useState } from 'react';
import { Typography, Menu, Card, Switch, Modal, Button } from "antd";
import { Line, Bar } from 'react-chartjs-2';

function Resources() {
  const [selectedParameter, setSelectedParameter] = useState(null);
  const [data, setData] = useState([]);
  const [months, setMonths] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [showLineChart, setShowLineChart] = useState(true);
  const [showDialog, setShowDialog] = useState(true);

  useEffect(() => {
    fetch('/data.json')
      .then(response => response.json())
      .then(data => {
        console.log("Fetched data:", data);
        const parametersData = data["Location-1"];
        setData(parametersData);
        
        if (parametersData.length > 0) {
          const firstEntry = parametersData[0];
          setMonths(Object.keys(firstEntry).filter(key => key.includes("2023")));
        }
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    if (!selectedParameter || data.length === 0 || months.length === 0) return;

    const parameterData = data.find(d => d.undefined === selectedParameter);
    if (!parameterData) return;

    const dataset = {
      label: selectedParameter,
      data: months.map(month => parseFloat(parameterData[month]) || 0),
      fill: false,
      backgroundColor: 'rgba(54, 162, 235, 0.5)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 2,
    };

    setChartData({
      labels: months,
      datasets: [dataset],
    });
  }, [selectedParameter, data, months]);

  const getUnit = (parameter) => {
    if (!parameter) return '';  // Return empty string if parameter is not valid or not yet selected
    const unitPattern = /\((.*?)\)$/; // Regex to extract content within parentheses
    const match = parameter.match(unitPattern);
    return match ? match[1] : '';
  };
  

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
      title: {
        display: true,
        text: `${selectedParameter || ''} Data`,
      },
      tooltip: {
        callbacks: {
          beforeBody: (context) => {
            const dataIndex = context[0].dataIndex;
            // Do not show difference for the first data point
            if (dataIndex === 0) return '';
            
            const currentValue = context[0].parsed.y;
            const previousValue = context[0].dataset.data[dataIndex - 1];
            const difference = currentValue - previousValue;
            
            // Determine if the value went up or down
            if (difference > 0) {
              return `Up: +${difference.toFixed(2)}`;
            } else if (difference < 0) {
              return `Down: ${difference.toFixed(2)}`; // Negative value already includes minus sign
            } else {
              return `No change: ${difference.toFixed(2)}`;
            }
          },
          footer: (context) => {
            const currentValue = context[0].parsed.y;
            const total = context[0].dataset.data.reduce((sum, value) => sum + value, 0);
            const percentageOfTotal = ((currentValue / total) * 100).toFixed(2);
            return `Percentage of total: ${percentageOfTotal}%`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Month',
        },
      },
      y: {
        title: {
          display: true,
          text: `Value (${getUnit(selectedParameter)})`, // Dynamically include units
        },
      },
    },
  };
  

  const handleCloseDialog = () => {
    setShowDialog(false);
  };

  return (
    <div>
      <Typography.Title level={4}>Customer Utilities Consumption</Typography.Title>
      <Menu mode="horizontal" selectedKeys={[selectedParameter]} onClick={e => setSelectedParameter(e.key)}>
        {data.map(entry => (
          <Menu.Item key={entry.undefined}>{entry.undefined}</Menu.Item>
        ))}
      </Menu>
      <Modal
        title="Important Information"
        visible={showDialog}
        onOk={handleCloseDialog}
        onCancel={handleCloseDialog}
        footer={[
          <Button key="close" type="primary" onClick={handleCloseDialog}>
            Close
          </Button>
        ]}
      >
        <Typography.Text>Please select a consumption parameter from nav bar to view the charts. You can you the toggle button to switch between line and bar graph.Hover over the data points and you can analyse the percentage of total usage at that point and also analyse if there was a increase or decrease in it . </Typography.Text>
      </Modal>
      <div style={{ margin: '16px 0' }}>
        <Switch
          checkedChildren="Line"
          unCheckedChildren="Bar"
          checked={showLineChart}
          onChange={() => setShowLineChart(!showLineChart)}
        />
      </div>
      {selectedParameter && chartData && (
        <Card style={{ marginTop: 16 }}>
          {showLineChart ? (
            <Line data={chartData} options={chartOptions} />
          ) : (
            <Bar data={chartData} options={chartOptions} />
          )}
        </Card>
      )}
    </div>
  );
}

export default Resources;
