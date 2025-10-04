import moment from 'moment'

export const displaySchedule = timetable => {
    if(timetable === null || timetable === undefined){
      return '-'
    }
    if(timetable.dayOff !== null){
      return timetable.remark
    }
    if(timetable.breakTime === null){
      return `${moment(timetable.startTime).format('kk:mm')} - ${moment(timetable.endTime).format('kk:mm')}`
    }else{
      return `${moment(timetable.startTime).format('kk:mm')} - ${moment(timetable.breakTime).format('kk:mm')}, ${moment(timetable.continueTime).format('kk:mm')} - ${moment(timetable.endTime).format('kk:mm')}`
    }
  }
