import React, { useState, useEffect } from "react";
import  {
} from '../../tunnel'
import PasswordScreen from './loginScreen'
import MainReport from './mainReport'
import Select from 'react-select'
import moment from 'moment'

export const JepDailyReport = prop => {
  // constructor(props){
  //   super(props)
  //   this.state = {
  //     date: ''
  //   }
  // }

  let [isLogIn, setLogin] = useState(false);





  return isLogIn ? <MainReport /> :<PasswordScreen setLogin={setLogin} />;

}

export default JepDailyReport
