import React, { useState } from "react";
import "./tabForm.css"; // Add this CSS for styling
import SoldItems from "./soldItems";
import CancelItems from "./cancelItems";
import VipTables from "./vipTables";
import RoomTables from "./roomTables";
import CustomerTables from "./customerTables";
import TableInfoScreen from "./tableInfoScreen";

const TabsForm = (props) => {
  const [activeTab, setActiveTab] = useState("รายการขาย");
  const [showTableInfo, setShowTableInfo] = useState(null)

  const tabs = ["รายการขาย", "รายการยกเลิก", "โต๊ะ VIP & Comp.", "โต๊ะโอนเข้าบัญชีห้อง", "โต๊ะลูกค้า"];

  const handleOpenTableInfo = (id) => {
    setShowTableInfo(id)
  }

  return (
    <div className="tabs-form">
        {showTableInfo ? <TableInfoScreen id={showTableInfo} closeTableInfoSceen={() => handleOpenTableInfo(null)} /> : null}
      {/* Tabs Navigation */}
      <div className="tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`tabzz ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === "รายการขาย" && (
          <SoldItems data={props.soldItemData} />
        )}
        {activeTab === "รายการยกเลิก" && (
          <CancelItems data={props.cancelOrderData} />
        )}

        {activeTab === "โต๊ะ VIP & Comp." && (
          <VipTables handleOpenTableInfo={handleOpenTableInfo} data={props.customerTableData.tables.filter(table => table.method === 'complimentary')} />
        )}

        {activeTab === "โต๊ะโอนเข้าบัญชีห้อง" && (
          <RoomTables handleOpenTableInfo={handleOpenTableInfo} data={props.customerTableData.tables.filter(table => table.method === 'room')} />
        )}

        {activeTab === "โต๊ะลูกค้า" && (
          <CustomerTables handleOpenTableInfo={handleOpenTableInfo} data={props.customerTableData.tables.filter(table => (table.method !== 'room' && table.method !== 'complimentary'))} />
        )}



      </div>
    </div>
  );
};

export default TabsForm;
