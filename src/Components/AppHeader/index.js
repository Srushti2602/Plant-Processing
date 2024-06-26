import { BellFilled, MailOutlined } from "@ant-design/icons";
import { Badge, Space, Image, Typography } from "antd";

function AppHeader() {
  return (
    <div className="AppHeader">
      <Space>
        <Image width={80} src="images/f2.jpg" />
        <Typography.Title className="titleStyle">Food Processing Dashboard</Typography.Title>
      </Space>
      <Space>
        <Badge>
          <MailOutlined style={{ fontSize: 24 }} />
        </Badge>
        <Badge count={20}>
          <BellFilled style={{ fontSize: 24 }} />
        </Badge>
      </Space>
    </div>
  );
}

export default AppHeader;
