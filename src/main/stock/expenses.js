import React from 'react'
import Select from 'react-select';
import validator from 'validator'
import numeral from 'numeral'
import moment from 'moment'
import {Bar} from 'react-chartjs-2';
import { addNewExpense, getExpenseByMonth, getExpensePastMonth,deleteExpense, submitNewMonthlyPayment, getMonthlyPayment } from './tunnel'

export default class ExpensesPage extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      page: 'expense'
    }
  }
  render(){
    const expenseBtn = this.state.page === 'expense' ? 'btn btn-dark' : 'btn btn-secondary';
    const monthlyExpenseBtn = this.state.page === 'monthlyExpense' ? 'btn btn-dark' : 'btn btn-secondary';
    return (
      <div className="row mx-1">
        <div className="col">
          <button onClick={() => this.setState(() => ({page:'expense'}))} className={expenseBtn}>รายการค่าใช้จ่าย</button>
        </div>
        <div className="col">
          <button onClick={() => this.setState(() => ({page:'monthlyExpense'}))} className={monthlyExpenseBtn}>รายการจ่ายประจำเดือน</button>
        </div>
        <div className="col-12">
          {
            this.state.page === 'expense' && <Expenses user={this.props.user} />
          }
          {
            this.state.page === 'monthlyExpense' && <MonthlyExpense user={this.props.user} />
          }
        </div>
      </div>
    )
  }
}

class MonthlyExpense extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      showAddMonthlyExpense: false,
      monthlyPaymentList: []
    }
  }

  componentDidMount() {
    getMonthlyPayment(res => {
      if(res.status){
        this.setState(() => ({
          monthlyPaymentList: res.monthlyPaymentList
        }))
      }
    })
  }

  completeAdded = () => {
    this.setState(() => ({showAddMonthlyExpense: false}))
    this.componentDidMount()
  }

  render(){
    return(
      <div className="row">
        <div className="col-12">
          <button onClick={() => this.setState(() => ({showAddMonthlyExpense: !this.state.showAddMonthlyExpense}))} className="btn btn-link">+ สร้างรายจ่ายประจำเดือนใหม่</button>
        </div>
        { this.state.showAddMonthlyExpense &&
          <div className="col-12">
            <AddNewMonthlyExpense completeAdded={this.completeAdded} />
          </div>
      }
      <div className="col-12">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>รายการ</th>
              <th>วันที่ต้องชำระ</th>
              <th>สถาณะ</th>
            </tr>
          </thead>
          <tbody>
            {
              this.state.monthlyPaymentList.map(x => (
                <tr>
                  <td>{x.detail}</td>
                  <td>{x.payDay}</td>
                  <td>{x.status}</td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
      </div>
    )
  }
}


class AddNewMonthlyExpense extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      detail: '',
      payDay: ''
    }
  }
  payDayOnChange = e => {
    this.setState(() => ({
      payDay: e.value
    }))
  }
  textOnChange = e => {
    const {id, value} = e.target
    console.log(id, value);
    this.setState(() => ({
      [id]: value
    }))
  }

  submitNewMonthlyExpense = () => {
    const { payDay, detail } = this.state
    if(detail.trim() === ''){
      alert('กรุณาใส่ข้อมูลรายการค่าใช้จ่ายที่ชำระประจำเดือน')
      return
    }
    if(payDay === ''){
      alert('กรุณาระบุวันที่ต้องชำระ')
      return
    }
    submitNewMonthlyPayment({payDay, detail}, res => {
      if(res.status){
        alert('ข้อมูลถูกบันทึก')
        this.props.completeAdded()
      }else{
        alert(res.msg)
      }
    })
  }
  render(){
    let dateValue = [];
    for(let x = 1; x < 31; x++){
      dateValue = [ ...dateValue, {label: x, value: x}]
    }
    return (
      <div className="row mx-1">
        <div className="col-12 col-md-4">
          <div className="form-group">
            <label for="detail">รายการ</label>
            <input value={this.state.detail} id="detail" onChange={this.textOnChange} type="text" className="form-control" />
            <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="form-group">
            <label for="payDay">วันที่กำหนดจ่ายประจำเดือน</label>
            <Select options={dateValue} onChange={this.payDayOnChange} />
          </div>
        </div>
        <div className="col-12 col-md-4">
          <button onClick={this.submitNewMonthlyExpense} className="btn btn-success">บันทึก</button>
        </div>
      </div>
    )
  }
}



class Expenses extends React.Component{

  constructor(props){
    super(props)
    this.state = {
      graphReport: '',
      expenseList: [],
      report: '',
      month: new Date(),
      selectedDate: moment().format('DD/MM/YYYY'),
      showAddExpense: true
    }
  }


  monthChangeClick = input => {
    let currentMonth = this.state.month
    let newMonth = input ?
    new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1):
    new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1);
    getExpenseByMonth({month: newMonth}, res => {
      if(res.status){
        this.setState(() => ({
          expenseList: res.expenseList,
          report: res.report,
          month: newMonth,
          selectedDate: moment(newMonth).set({date: 1}).format('DD/MM/YYYY')
        }))
      }else{
        alert(res.msg)
      }
    })
  }

  deleteExpense = id => {
    console.log(id);
    let pwd = prompt("DELETE CODE: ")
    if(pwd != null){
      if(pwd === 'Thisistay'){
        deleteExpense({id}, res => {
          if(res.status){
            this.componentDidMount()
          }else{
            alert(res.msg)
          }
        })
      }else{
        alert('CODE ไม่ถูกต้อง')
      }
    }
  }

  componentDidMount(){
    getExpensePastMonth(res => {
      if(res.status){
        let list = res.pastMonth.reverse()
        let monthTitle = []
        let monthAmount = []
        list.forEach(x => {
          monthTitle = [ ...monthTitle, x.title ]
          monthAmount = [ ...monthAmount, x.total ]
        })
        this.setState(() => ({
          graphReport: {title: monthTitle, amount: monthAmount}
        }))
      }else{
        alert(res.msg)
      }
    })
    getExpenseByMonth({month: this.state.month}, res => {
      if(res.status){
        this.setState(() => ({
          expenseList: res.expenseList,
          report: res.report
        }))
      }else{
        alert(res.msg)
      }
    })
  }

  reload = (date) => {
    this.setState(() => ({
      month: new Date(date),
      selectedDate: moment(date).format('DD/MM/YYYY'),
      showAddExpense: false
    }))
    this.setState(() => ({
      showAddExpense: true
    }))
    this.componentDidMount()
  }

  changeSelectDate = (date) => {
      this.setState(() => ({
        selectedDate: date
      }))
  }

  render(){
    let dayListInMonth = []
    const { month, expenseList } = this.state

    for(let i = 1; i <= moment(month).daysInMonth(); i++){
      let date = moment(month).set({date: i})
      let expenseListInDate = expenseList.filter((x) => moment(x.completePaymentBy).format('DD/MM/YYYY') === date.format('DD/MM/YYYY'))
      const totalAmount = expenseListInDate.reduce((total, x) => total += x.amount, 0)
      dayListInMonth = [ ...dayListInMonth, { date: date.format('DD/MM/YYYY'), totalAmount}]
    }

    let expenseListInDate = expenseList.filter((x) => moment(x.completePaymentBy).format('DD/MM/YYYY') === this.state.selectedDate)

    return(
      <div className="row mx-1">
        <div className="col-8">
          {
            this.state.graphReport !== '' &&
            <Bar data={
        {labels: this.state.graphReport.title,
        datasets: [
          {
            label:'ค่าใช้จ่ายรายวัน',
            data: this.state.graphReport.amount,
          borderWidth: 1
          }
        ]}
        }
        width={100}
        height={250}
        options={{ maintainAspectRatio: false }} />
          }
        </div>
        <div className="col-4">
          {this.state.showAddExpense && <AddNewExpense user={this.props.user} reload={this.reload} />}
        </div>
        <div className="col-12">
          <div className="row mb-3">
            <div className="col-3 container-t">
              <div className="row mb-3">
                <div className="col-4 text-right">
                  <button onClick={() => this.monthChangeClick(false)} className="btn btn-warning">-</button>
                </div>
                <div className="col-4 text-center">
                  <button disabled className="btn btn-dark">{moment(this.state.month).format('MMM/YYYY')}</button>
                </div>
                <div className="col-4">
                  <button onClick={() => this.monthChangeClick(true)} className="btn btn-warning">+</button>
                </div>
              </div>
              <div className="row">
                <div className="col-12">
                  <table className="table">
                    <tbody>
                      {
                        dayListInMonth.map(x =>
                          <tr className="btn-link" onClick={() => this.changeSelectDate(x.date)}>
                            <td>{x.date}</td>
                            <td align="right">{numeral(x.totalAmount).format('0,0.00')}</td>
                          </tr>
                        )
                      }
                    </tbody>
                  </table>
                </div>
              </div>
              {  /* this.state.report !== '' &&
                <div className="row">
                  <div className="col-12">
                  <table className="table">
                    <tbody>
                      <tr>
                        <td>เงินสด</td>
                      <th>{numeral(this.state.report.totalCash).format('0,0.00')}</th>
                      </tr>
                      <tr>
                        <td>โอนเงิน</td>
                      <th>{numeral(this.state.report.totalTransfer).format('0,0.00')}</th>
                      </tr>
                      <tr>
                        <td>บัตรเครดิต</td>
                      <th>{numeral(this.state.report.totalCard).format('0,0.00')}</th>
                      </tr>
                      <tr>
                        <td>รวม</td>
                      <th>{numeral(
                          this.state.report.totalCash +
                          this.state.report.totalTransfer +
                          this.state.report.totalCard
                        ).format('0,0.00')}</th>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
             */}
            </div>
            <div className="col-8 mt-1 ml-1">
              <h3>วันที่: {this.state.selectedDate}</h3>
              <table className="table">
                <thead>
                  <tr>
                    <th>วันที่</th>
                    <th>รายการค่าใช้จ่าย</th>
                    <th>จำนวนเงิน</th>
                    <th>ชำระเงินโดย</th>
                    <th>Ref#</th>
                    <th>บันทึกโดย</th>
                  <th>

                  </th>
                  </tr>
                </thead>
                {
                  expenseListInDate.length !== 0 ?
                  expenseListInDate.map(x => (
                    <tr>
                      <td>{moment(x.completePaymentBy).format('DD/MM/YYYY')}</td>
                      <td>{x.detail}</td>
                    <td>{numeral(x.amount).format('0,0.00')}</td>
                      <td>{x.type}</td>
                      <td>{x.reference}</td>
                    <td>{x.createBy} ({moment(x.timestamp).format('DD/MM/YYYY')})</td>
                  <td>
                    <button onClick={() => this.deleteExpense(x.id)} className="btn btn-danger">ลบ</button>
                  </td>
                    </tr>
                  ))
                  :
                  <tr>
                    <td colSpan="4">ไม่พบข้อมูล</td>
                  </tr>
                }
              </table>
            </div>
          </div>
        </div>


      </div>
    )
  }
}

class AddNewExpense extends React.Component{

  selectOption = [
    {value: 'เงินสด', label: 'เงินสด'},
    {value: 'บัตรเครดิต', label: 'บัตรเครดิต'},
    {value: 'โอนเงิน', label: 'โอนเงิน'},
    {value: 'โอนเงินโดย MD', label: 'โอนเงินโดย MD'},
  ]

  constructor(props){
    super(props)
    this.state = {
      showAddExpense: false,
      amount: 0,
      detail: '',
      type: '',
      reference: '',
      paymentAt: new Date(),
      imageFile: ''
    }
  }




  fileOnChange = e => {
    let file = e.target.files[0]
    this.setState(() => ({
      imageFile: file
    }))
  }

  toggleAddExpense = () => {
    this.setState(() => ({
      showAddExpense: !this.state.showAddExpense,
      amount: 0,
      detail: '',
      type: '',
      reference: ''}))
  }

  valueOnChange = e => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState(({
      [name]: value
    }))
  }

  amountOnChange = e => {
    const value = e.target.value
    if(validator.isFloat(value)){
      this.setState(() => ({
        amount: value
      }))
    }
  }

  onSelectMethod = type => {
    this.setState(() => ({type: type.value}))
  }



  paymentAtOnChange = e => {
    const value = e.target.value
    this.setState(() => ({
      paymentAt: value
    }))
  }

  submitNewExpense = () => {
    const amount = parseInt(this.state.amount)
    if(this.state.detail.trim() === ''){
      alert('กรุณาใส่รายละเอียดค่าใช้จ่าย')
      return
    }
    if(isNaN(amount)){
      alert('กรุณาใส่จำนวนเงินเป็นเลข')
    }
    if(amount < 1){
      alert('กรุณาใส่จำนวนเงินที่มากกว่า 0 บาท')
      return
    }
    if(this.state.type === ''){
      alert('กรุณาเลือกวิธีการจ่ายเงิน')
      return
    }
    if(this.state.type == 'บัตรเครดิต' && this.state.reference.trim() === ''){
      alert('กรุณาใส่หมายเลขอ้างอิง')
      return
    }
    if((this.state.type === 'โอนเงิน' || this.state.type === 'โอนเงินโดย MD') && this.state.imageFile === ''){
      alert('กรุณาอัพโหลดหลักฐานการโอนเงิน')
      return
    }


    let paymentAt = this.state.paymentAt
    addNewExpense({
      amount: this.state.amount,
      detail: this.state.detail,
      type: this.state.type,
      paymentAt: paymentAt,
      reference: this.state.reference,
      createBy: this.props.user.username,
      imageFile: this.state.imageFile
    }, res => {
      if(res.status){
        alert('ข้อมูลถูกบันทึกแล้ว')
        this.setState(() => ({
          showAddExpense: false,
          amount: 0,
          detail: '',
          type: '',
          reference: '',
          paymentAt:''
        }))
        this.props.reload(paymentAt)
      }else{
        alert(res.msg)
      }
    })
  }

  render(){
    return(
      <div className="row mt-3">
        <div className="col-12">
            <div className="row">
            <div className="col-12 border m-1 p-3">
              <div className="row">
                <div className="col-6">
                  <h4>เพิ่มค่าใช้จ่าย</h4>
                </div>
                <div className="col-6">
                  <button onClick={this.submitNewExpense} className="btn btn-success">บันทึก</button>
                </div>
                <div className="col-12 mt-3">
                  <div className="input-group mb-3">
                    <div className="input-group-prepend">
                      <span className="input-group-text" >รายการ</span>
                    </div>
                    <input value={this.state.detail} onChange={this.valueOnChange} name="detail" type="text" className="form-control" aria-describedby="basic-addon3" />
                  </div>
                </div>
                <div className="col-12">
                  <div className="input-group mb-3">
                    <div className="input-group-prepend">
                      <span className="input-group-text" >จำนวนเงิน</span>
                    </div>
                    <input value={this.state.amount} onChange={this.amountOnChange} name="amount" type="text" className="form-control" aria-describedby="basic-addon3" />
                  </div>
                </div>
                <div className="col-12">
                  <div className="input-group mb-3">
                    <div className="input-group-prepend">
                      <span className="input-group-text" >วันที่ชำระเงิน</span>
                    </div>
                  <input onChange={this.paymentAtOnChange} value={this.state.paymentAt} className="form-control" type="date" />
                  </div>
                </div>
                <div className="col-12 mb-3">
                  <Select options={this.selectOption} onChange={this.onSelectMethod} />
                </div>

                { (this.state.type === 'โอนเงิน' || this.state.type === 'โอนเงินโดย MD')  &&
                  <div className="col-12">
                    <div className="input-group mb-3">
                      <div className="input-group-prepend">
                        <span className="input-group-text" >หลักฐานการโอนเงิน</span>
                      </div>
                      <input onChange={this.fileOnChange} type="file" className="form-control" aria-describedby="basic-addon3" />
                    </div>
                  </div>
                }
                { this.state.type === 'บัตรเครดิต' &&
                  <div className="col-12">
                    <div className="input-group mb-3">
                      <div className="input-group-prepend">
                        <span className="input-group-text" >หมายเลขบัตร #</span>
                      </div>
                      <input onChange={this.valueOnChange} name="reference" type="text" className="form-control" aria-describedby="basic-addon3" />
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
