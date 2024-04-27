import React, { useEffect, useState } from 'react';
import { Typography, Space, Card, Row, Col, Statistic } from "antd";
import { ShoppingCartOutlined, ShoppingOutlined, UserOutlined, DollarCircleOutlined } from "@ant-design/icons";
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

function Dashboard() {
  const orders = 300;
  const usage = 250;
  const customers = 1200;
  const revenue = 5000000;

  const [consumptionData, setConsumptionData] = useState({
    labels: [],
    datasets: []
  });

  useEffect(() => {
    // Replace with the actual path to your data.json or with your API call
    fetch('/data.json')
      .then(response => response.json())
      .then(data => {
        const utilities = Object.keys(data["Location-1"][0]).filter(key => key !== 'undefined');
        const totals = utilities.map(utility => {
          return data["Location-1"].reduce((sum, record) => sum + parseFloat(record[utility] || 0), 0);
        });

        setConsumptionData({
          labels: utilities,
          datasets: [{
            data: totals,
            backgroundColor: [
              'rgba(0, 0, 139, 0.5)',  // Dark Blue
              'rgba(139, 69, 19, 0.5)',  // Dark Brown
              'rgba(255, 0, 0, 0.5)',    // Red
              'rgba(128, 0, 128, 0.5)',  // Purple
              'rgba(0, 128, 0, 0.5)',    // Green
              'rgba(255, 165, 0, 0.5)',  // Orange
              'rgba(128, 128, 128, 0.5)' // Grey
            ],
            borderColor: [
              'rgba(0, 0, 139, 1)',
              'rgba(139, 69, 19, 1)',
              'rgba(255, 0, 0, 1)',
              'rgba(128, 0, 128, 1)',
              'rgba(0, 128, 0, 1)',
              'rgba(255, 165, 0, 1)',
              'rgba(128, 128, 128, 1)'
            ],
            borderWidth: 1,
            hoverOffset: 4,
            cutout: '70%',
          }]
        });
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <Row gutter={[20, 20]}>
      <Col span={18}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Typography.Title level={4}>Dashboard</Typography.Title>
          <Space wrap size={60} direction="horizontal">
            <DashboardCard
              icon={<ShoppingCartOutlined style={{ color: "green" }} />}
              title={"Orders"}
              value={orders}
            />
            <DashboardCard
              icon={<ShoppingOutlined style={{ color: "blue" }} />}
              title={"Usage"}
              value={usage}
            />
            <DashboardCard
              icon={<UserOutlined style={{ color: "purple" }} />}
              title={"Customers"}
              value={customers}
            />
            <DashboardCard
              icon={<DollarCircleOutlined style={{ color: "red" }} />}
              title={"Revenue"}
              value={revenue}
            />
          </Space>
          <Card style={{ width: '90%', margin: '16px auto 0px', marginTop: 16 }}>
            <Doughnut data={consumptionData} options={{ maintainAspectRatio: false }} />
          </Card>
          <Card style={{ width: '90%', margin: '16px auto 0px', marginTop: 16 }}>
            <Typography.Text>The donut chart in this context represents the total utility consumption for the entire year in a food processing plant. Each segment of the donut chart corresponds to a different utility, such as water consumption, natural gas consumption, grid electricity consumption, etc. The size of each segment represents the proportion of that utility's consumption relative to the total consumption for the year.

For example, if the water consumption segment occupies a larger portion of the donut chart compared to other segments, it indicates that water consumption contributes a significant portion to the total utility consumption for the year. Conversely, if the segment for natural gas consumption is relatively small, it suggests that natural gas consumption contributes less to the total consumption compared to other utilities.

Overall, the donut chart provides a visual representation of how different utilities contribute to the overall consumption pattern, allowing stakeholders to identify which utilities have the most significant impact and potentially prioritize cost-saving strategies or resource optimization efforts accordingly.</Typography.Text>
            
            <Typography.Text><p>Dark Blue: Represents water consumption.</p>
  <p>Dark Brown: Represents natural gas consumption.</p>
  <p>Red: Represents grid electricity consumption.</p>
  <p>Purple: Represents steam consumption.</p>
  <p>Green: Represents food waste.</p>
  <p>Orange: Represents solar electricity production.</p>
  <p>Grey: Represents water recycled.</p></Typography.Text>
          </Card>
        </Space>
      </Col>
      <Col span={6}>
        <Card>
          <Typography.Text>
            Welcome to our Food Processing Plant Dashboard!
            <br /><br />
            In the top-right corner, you'll find the email and notification section, where you can stay updated with the latest information.
            <br /><br />
            To the left, our sidebar offers easy navigation between different sections: Dashboard, Usage, Monthly Analysis, and Resource Analysis.
            <br /><br />
            The Dashboard provides insights into daily packed orders in tons, order usage in tons, customer connections to the plant, and revenue generated for the financial year.
            <br /><br />
            In the Usage section, you can view a table detailing resource consumption.
            <br /><br />
            For deeper insights, head to the Monthly Analysis section. Here, you can navigate through different months and choose from three visualization options: line, pie, or bar graphs. Select the month for which you want to select the chart first!
            <br /><br />
            In the Resource Analysis section, delve into specific resources to analyze their monthly consumption patterns. Select the resource and then get the visualize the chart.
            <br /><br />
            Explore our Dashboard for comprehensive insights into our Food Processing Plant's operations and performance!
          </Typography.Text>
        </Card>
      </Col>
    </Row>
  );
}

function DashboardCard({ icon, title, value }) {
  return (
    <Card>
      <Space direction="horizontal">
        {icon}
        <Statistic title={title} value={value} />
      </Space>
    </Card>
  );
}

export default Dashboard;
