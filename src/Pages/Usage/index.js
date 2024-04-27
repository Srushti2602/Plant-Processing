import React, { useEffect, useState } from 'react';
import { Typography, Table } from "antd";

function Usage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('/data.json')  // Assuming the file is in the public folder
      .then(response => response.json())
      .then(json => {
        // Assuming json is an array of objects as per your data structure
        const formattedData = json["Location-1"].map((item, index) => ({
          key: index,
          type: item.undefined, // since your items are using "undefined" as a label for type
          ...item
        }));
        setData(formattedData);
      })
      .catch(error => console.error('Error loading the data:', error));
  }, []);

  const columns = [
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Jan 2023',
      dataIndex: 'Jan 2023',
      key: 'Jan2023',
    },
    {
      title: 'Feb 2023',
      dataIndex: 'Feb 2023',
      key: 'Feb2023',
    },
    {
      title: 'March 2023',
      dataIndex: 'March 2023',
      key: 'March2023',
    },
    {
      title: 'April 2023',
      dataIndex: 'April 2023',
      key: 'April2023',
    },
    // Add other months similarly
    {
      title: 'May 2023',
      dataIndex: 'May 2023',
      key: 'May2023',
    },
    {
      title: 'June 2023',
      dataIndex: 'June 2023',
      key: 'June2023',
    },
    {
      title: 'July 2023',
      dataIndex: 'July 2023',
      key: 'July2023',
    },
    {
      title: 'August 2023',
      dataIndex: 'August 2023',
      key: 'August2023',
    },
    {
      title: 'September 2023',
      dataIndex: 'September 2023',
      key: 'September2023',
    },
    {
      title: 'October 2023',
      dataIndex: 'October 2023',
      key: 'October2023',
    },
    {
      title: 'November 2023',
      dataIndex: 'November 2023',
      key: 'November2023',
    },
    {
      title: 'December 2023',
      dataIndex: 'December 2023',
      key: 'December2023',
    }
  ];

  return (
    <div>
      <Typography.Title level={4}>Usage</Typography.Title>
      <Table columns={columns} dataSource={data} pagination={false} />
    </div>
  );
}

export default Usage;
