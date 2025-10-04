import React, {useEffect, useState} from "react";
import "./mainReport.css"; // Add this CSS for styling
import Dashboard from "./dashboard";
import TabsForm from "./tabForm";
import LoadingScreen from './loadingScreen'
import moment from "moment";
import { restaurantGetDailyShift, getSoldItemsByDate, getCancelOrderByDate, getCustomerTablesByDate } from "../../tunnel";
import Swal from "sweetalert2";

const MainReport = () => {
    const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(today.getDate() - 1);

    let [dashboardData, setDashboardData] = useState(null)
    let [soldItemData, setSoldItemData] = useState(null)
    let [cancelOrderData, setCancelOrderData] = useState(null)
    let [customerTableData, setCustomerTableData] = useState(null)

    let [loadingStatus, setLoadingStatus] = useState([])

    let [selectedDate, setSelectedDate] = useState(yesterday)


    useEffect(() => {
        loadDataByDate(selectedDate);
        }, []);



    const updateLoadingStatus = (title, icon) => {

        let newList = loadingStatus
        const index = newList.findIndex(obj => obj.title === title);

        if (index !== -1) {
          // Update icon if title exists
          newList[index].icon = icon;
        } else {
          // Add new object if title doesn't exist
          newList.push({ title, icon: icon });
        }
        setLoadingStatus(newList)
    }


    const checkIfLoading = () => {
        if(!loadingStatus.some(obj => obj.icon === '⏬')){
            setLoadingStatus([])
        }
    }


    const loadDataByDate = date => {
        setLoadingStatus([
            {title: 'ประมวณข้อมูล', icon: '⏬'},
            {title: 'รายการขาย', icon: '⏬'},
            {title: 'รายการยกเลิก', icon: '⏬'},
            {title: 'ข้อมูลโต๊ะ', icon: '⏬'},
        ])

        restaurantGetDailyShift({date}, res => {
            updateLoadingStatus('ประมวณข้อมูล', res.status ? '✅': '❌')
            if(res.status){
                setDashboardData(res);
                getSoldItemsByDate({date}, res => {
                    setSoldItemData(res.status ? res : res.msg);
                    updateLoadingStatus('รายการขาย', res.status ? '✅': '❌')
                    checkIfLoading()
                })

                getCancelOrderByDate({date}, res => {
                    setCancelOrderData(res.status ? res : res.msg);
                    updateLoadingStatus('รายการยกเลิก', res.status ? '✅': '❌')
                    checkIfLoading()
                })
                getCustomerTablesByDate({date}, res => {
                    setCustomerTableData(res.status ? res : res.msg);
                    updateLoadingStatus('ข้อมูลโต๊ะ', res.status ? '✅': '❌')
                    console.log(res);
                    checkIfLoading()
                })
                setSelectedDate(date)
            }else{
                Swal.fire({
                    title: 'ค้นหาล้มเหลว!',
                    text: res.msg + ' ' + moment(date).format('dddd DD, MMM YYYY'),
                    icon: 'error',
                    confirmButtonText: 'OK',
                  });
                  setLoadingStatus([])
            }
        })

    }




  return (dashboardData !== null && soldItemData !== null && cancelOrderData !== null && customerTableData !== null && loadingStatus.length === 0) ? (
    <div className="mainReport">
        <Dashboard data={dashboardData} loadDataByDate={loadDataByDate} selectedDate={selectedDate} />
        <TabsForm soldItemData={soldItemData} cancelOrderData={cancelOrderData} customerTableData={customerTableData} />

    </div>
  ): <LoadingScreen loadingStatus={loadingStatus} />
};

export default MainReport;
