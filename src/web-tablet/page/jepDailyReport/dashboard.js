import React, { useState } from "react";
import "./dashboard.css"; // Add this CSS for styling
import moment from "moment";

const Dashboard = (props) => {
  const data = {
    sales: {
      total:
        props.data.morning.cash +
        props.data.morning.card +
        props.data.morning.transfer +
        props.data.morning.ThaiChana +
        props.data.morning.gWallet +
        props.data.morning.halfHalf +
        props.data.morning.room +
        props.data.afternoon.cash +
        props.data.afternoon.card +
        props.data.afternoon.transfer +
        props.data.afternoon.ThaiChana +
        props.data.afternoon.gWallet +
        props.data.afternoon.halfHalf +
        props.data.afternoon.room,
    },
    customers: {
      icons: ["👤 ลูกค้า", "🪑 เปิดโต๊ะ", "คนไทย", "ต่างชาติ"], // Replace these with appropriate icons
      details: [
        props.data.morning.guests + props.data.afternoon.guests,
        props.data.morning.tables + props.data.afternoon.tables,
        props.data.morning.thaiGuest + props.data.afternoon.thaiGuest,
        props.data.morning.englishGuest + props.data.afternoon.englishGuest,
      ],
    },
    transactions: {
      total: props.data.morning.qtyFood + props.data.afternoon.qtyFood + props.data.morning.qtyBeverage + props.data.afternoon.qtyBeverage,
      details: [
        { icon: "🍴 อาหาร", count: props.data.morning.qtyFood + props.data.afternoon.qtyFood }, // Replace with actual icons
        { icon: "🍹 เครื่องดื่ม", count: props.data.morning.qtyBeverage + props.data.afternoon.qtyBeverage },
        { icon: "❌ ยกเลิก", count: props.data.morning.cancel + props.data.afternoon.cancel },
      ],
    },
  };

  const morningSalesData = [
    { icon: "💷 เงินสด", count: props.data.morning.cash }, // Replace with actual icons
    { icon: "💳 บัตรเครดิต", count: props.data.morning.card },
    { icon: "🔄 โอนเงิน", count: props.data.morning.transfer },
    { icon: "🏠 เข้าบัญชีห้อง", count: props.data.morning.room },
    { icon: "🟦 ไทยชนะ", count: props.data.morning.ThaiChana },
    { icon: "🟪 GWallet", count: props.data.morning.gWallet },
    { icon: "🟩 คนละครึ่ง", count: props.data.morning.halfHalf },
  ];

  const afternoonSalesData = [
    { icon: "💷 เงินสด", count: props.data.afternoon.cash }, // Replace with actual icons
    { icon: "💳 บัตรเครดิต", count: props.data.afternoon.card },
    { icon: "🔄 โอนเงิน", count: props.data.afternoon.transfer },
    { icon: "🏠 เข้าบัญชีห้อง", count: props.data.afternoon.room },
    { icon: "🟦 ไทยชนะ", count: props.data.afternoon.ThaiChana },
    { icon: "🟪 GWallet", count: props.data.afternoon.gWallet },
    { icon: "🟩 คนละครึ่ง", count: props.data.afternoon.halfHalf },
  ];

  const [selectedToggle, setSelectedToggle] = useState("Morning");
  const [salesData, setSalesData] = useState(morningSalesData);

  const handleToggle = (toggle) => {
    setSelectedToggle(toggle);
    if (toggle === "Morning") {
      setSalesData(morningSalesData);
    } else {
      setSalesData(afternoonSalesData);
    }
  };

  moment.locale('th');

  return (
    <div className="dashboard">
      <div className="thamd-cards">
        {/* Sales Card */}
        <div className="thamd-card">
          <div>
            <h3>ยอดขาย</h3>
            <h1>{data.sales.total.toLocaleString()}</h1>
          </div>
          <div>
            <div className="toggle-container">
              <button
                className={`toggle-button ${
                  selectedToggle === "Morning" ? "active" : ""
                }`}
                onClick={() => handleToggle("Morning")}
              >
                Morning
              </button>
              <button
                className={`toggle-button ${
                  selectedToggle === "Afternoon" ? "active" : ""
                }`}
                onClick={() => handleToggle("Afternoon")}
              >
                Afternoon
              </button>
            </div>
            <div className="thamd-details">
              {salesData.map((item, index) => (
                <p key={index}>
                  {item.icon} {item.count.toLocaleString()} บาท
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Transactions Card */}
        <div className="thamd-card">
          <div>
            <h3>รายการขาย & ลูกค้า</h3>
            <h1>{data.transactions.total}</h1>
          </div>
          <div className="thamd-details">
            {data.transactions.details.map((item, index) => (
              <p key={index}>
                {item.icon} {item.count} รายการ
              </p>
            ))}
            {data.customers.details.map((item, index) => (
              <p key={index}>
                {data.customers.icons[index]} {item.toLocaleString()}
              </p>
            ))}
          </div>
        </div>

        {/* Customers Card */}
        <div className="thamd-card">
        <h3>วันที่</h3>
            <div style={{display: 'flex', flexDirection:'column', alignItems: 'end'}}>
              <h2>{moment(props.selectedDate).format('dddd DD, MMM YYYY')}</h2>
              <input
        type="date"
        id="datePicker"
        value={props.selectedDate}
        onChange={(e) => {
          props.loadDataByDate(e.target.value)
        }}
        // style={{ display: "none" }}
      />
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
