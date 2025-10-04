import React, { useState, useEffect } from "react";
import './loadingScreen.css'

const LoadingScreen = (props) => {
  
     
  return (
    <div style={styles.loadingScreen}>
      <div style={styles.spinner}></div>
      <h1>กำลังโหลดข้อมูล กรุณารอสักครู่...</h1>
      <ul style={styles.loadingList}>
        {
            props.loadingStatus.map(item => <li>{item.icon} {item.title}</li>) 
        }
      </ul>
    </div>
  ) ;
};


const styles = {
  loadingScreen: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0, 0, 0, 0.8)",
    color: "white",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    fontSize: "1.5rem",
  },
  spinner: {
    width: "50px",
    height: "50px",
    border: "5px solid rgba(255, 255, 255, 0.3)",
    borderTop: "5px solid white",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    marginBottom: "20px",
  },
  loadingList: {
    listStyle: 'none'
  }
};

export default LoadingScreen;
