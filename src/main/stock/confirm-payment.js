import React from 'react'
import moment from 'moment'
import numeral from 'numeral'
import Select from 'react-select';
import Swal from 'sweetalert2'
import { submitReceiptFile, clearPaymentByPurchaseId, getConfirmPurchase, getConfirmPurchaseById, getSuppliers, submitPaymentToPurchase, deletePurchaseOrder } from './tunnel'
export default class ConfirmPayment extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      poList: [],
      showDetail: false,
      purchase: {},
      suppliers: [],
    }
  }
  componentDidMount(){
    getConfirmPurchase(res => {
      if(res.status){
        this.setState(() => ({poList: res.poList}))
      }else{
        alert(res.msg)
      }
    })
    getSuppliers(res => {
      if(res.status){
        this.setState(() => ({suppliers: res.suppliers}))
      }else{
        alert(res.msg)
      }
    })
  }


  poClick = id => {
    getConfirmPurchaseById({id}, res => {
      if(res.status){
        console.log(res.purchase);
        this.setState(() => ({
          showDetail: true,
          purchase: res.purchase
        }))
      }else{
        alert(res.msg)
      }
    })
  }

  backPage = () => {
    this.setState(() => ({
      showDetail: false,
      purchase: {}
    }))
  }

  render(){
    return(
      <div>
        {!this.state.showDetail &&
        <div className="row mt-4">
          <div className="col-12">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>บริษัท/ร้านค้า</th>
                  <th>สั่งซื้อโดย</th>
                  <th>สถาณะ</th>
                  <th>ค้างชำระ</th>
                  <th>จ่ายแล้ว</th>
                </tr>
              </thead>
              <tbody>
                {this.state.poList.map(x => (
                  <tr onClick={() => this.poClick(x.id)}>
                    <td>{x.supplier}</td>
                    <td>{x.requester}</td>
                    <td>{x.status}</td>
                    <td>{x.total - x.paid}</td>
                    <td>{x.paid}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>}

        {this.state.showDetail &&
          <PurchaseDetail
            purchase={this.state.purchase}
            reloadById={this.poClick}
            user={this.props.user}
            setPurchase={purchase => this.setState(() => ({purchase}))}
            suppliers={this.state.suppliers.reduce((result, i) => ([...result, {value: i.id, label: i.name}]), [])} />
        }
      </div>
    )
  }
}

export class PurchaseDetail extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      amount: 0,
      type: '',
      reference: '',
      creditSupplier:'',
      imageFile: '',
      receiptFile: ''
    }
  }

  submitReceiptFile = () => {
    let { receiptFile } = this.state
    let purchaseId = this.props.purchase.id
    let reloadById = this.props.reloadById
    if( receiptFile === ''){
      Swal.fire({
        icon: 'error',
        title: 'กรุณาเลือกไฟล์'
      })
      return
    }
    console.log(receiptFile);
    submitReceiptFile({
      poId: purchaseId,
      receiptFile
    }, res => {
      if(res.status){
        Swal.fire({
          icon: 'success',
          title: 'ข้อมูลถูกบันทึก!'
        })
        reloadById(purchaseId)
      }else{
        Swal.fire({
          icon: 'error',
          title: res.msg
        })
      }
    })
  }

  setType = type => {
    this.setState(() => ({
      amount: 0,
      type: type,
      reference: '',
      creditSupplier:'',
      imageFile: ''
    }))
  }


    receiptFileOnChanage = e => {
      let {files} = e.target
      this.setState(() => ({
        receiptFile: files[0]
      }))
      console.log(this.props);
    }

  valueOnChange = e => {
    let amount = e.target.value;
    let name = e.target.name;
    this.setState(() => ({
      [name]: amount
    }))
  }

  onSelectSupplier = supplier => {
    this.setState(() => ({creditSupplier: supplier.value}))
  }

  fileOnChange = e => {
    let file = e.target.files[0]
    this.setState(() => ({
      imageFile: file
    }))
  }

  cancelPurchaseOrder = () => {
    if(window.confirm('ยืนยันที่จะลบรายการซื้อของนี้')){
      deletePurchaseOrder({poId: this.props.purchase.id}, res => {
        if(res.status){
          alert('รายการนี้ถูกลบแล้ว')
          this.props.backPage()
        }else{
          alert(res.msg)
        }
      })
    }
  }

  submitPayment = () => {
    const amount = parseInt(this.state.amount)
    if(this.state.type === ''){
      alert('กรุณาเลือกประเภทการจ่ายเงิน')
      return
    }
    if(amount < 1){
      alert('กรุณาใส่จำนวนเงินที่มากกว่า 0 บาท')
      return
    }
    if(amount > this.props.purchase.total - this.props.purchase.payments.reduce((sum, i) => (sum+i.amount), 0)){
      alert('กรุณาใส่จำนวนเงินที่ไม่เกินยอดค้างชำระ')
      return
    }
    if(this.state.type === 'โอนเงิน'){
      if(this.state.imageFile === '') {
        alert('กรุณาอัพโหลดหลักฐานการโอนเงิน')
        return
      }
    }
    if(this.state.type === 'โอนเงินโดย MD'){
      if(this.state.imageFile === '') {
        alert('กรุณาอัพโหลดหลักฐานการโอนเงิน')
        return
      }
    }
    if(this.state.type === 'บัตรเครดิต'){
      if(this.state.reference === '') {
        alert('กรุณาใส่หมายเลขบัตร')
        return
      }
    }
    if(this.state.type === 'ร้านค้า'){
      if(this.state.creditSupplier === '') {
        alert('กรุณาเลือกร้านค้า')
        return
      }
    }



    submitPaymentToPurchase({
      purchaseId: this.props.purchase.id,
      username: this.props.user.username ,
      amount: this.state.amount,
      type: this.state.type,
      reference: this.state.reference,
      creditSupplier: this.state.creditSupplier,
      imageFile: this.state.imageFile
       }, res => {
      if(res.status){
        alert('รายการชำระเงินถูกบันทึกแล้ว')
        this.props.setPurchase(res.purchase)
        this.setState(() => ( {
          amount: 0,
          type: '',
          reference: '',
          creditSupplier:''
        }))
      }else{
        alert(res.msg)
      }
    })
  }

  resetPayment = async () => {
    let purchase = this.props.purchase
    const { value: password } = await Swal.fire({
      title: 'Enter your password',
      input: 'password',
      inputLabel: 'Password',
      inputPlaceholder: 'Enter your password',
      inputAttributes: {
        maxlength: 10,
        autocapitalize: 'off',
        autocorrect: 'off'
      }
    })

    if (password === 'Thisistay') {
      clearPaymentByPurchaseId({purchaseId: this.props.purchase.id},res => {
        if(res.status){
          Swal.fire({
              title: 'ลบข้อมูลสำเร็จ',
              icon: 'success'
          })
          purchase['payments'] = []
          purchase['paymentStatus'] = 'unpaid'
          this.props.setPurchase(purchase)
        }else{
          Swal.fire({
              title: res.msg,
              icon: 'error'
          })
        }
      })
    }else{
      Swal.fire({
          title: 'Wrong password',
          icon: 'error'
      })
    }
  }

  render(){
    return(
      <div>
        <div className="row mt-4">
          <div className="col-9">
            <div className="row">
              <div className="col-12">
                หมายเลขใบสั่งซื้อ: <b>{this.props.purchase.id}</b>
              </div>
              <div className="col-12">
                วันที่ออกใบ: <b>{moment(this.props.purchase.timestamp).format('DD/MM/YYYY')}</b>
              </div>
              <div className="col-12">
                ผู้ขอสั่งซื้อ: <b>{this.props.purchase.requester}</b>
              </div>
              <div className="col-12">
                Ref#: <b>{this.props.purchase.reference || 'N/A'}</b>
              </div>
              <div className="col-12">
                ร้านค้า: <b>{this.props.purchase.supplier}</b>
              </div>
              <div className="col-12">
                หมายเหตุ: <b>{this.props.purchase.remark}</b>
              </div>
              <div className="col-12">
                ชำระโดย: <b>{this.props.purchase.paymentType}</b>
              </div>
              <div className="col-12">
                ราคาสินค้า: <b>{this.props.purchase.includeVat == 1 ? 'รวม Vat แล้ว': this.props.purchase.includeVat == 2? 'ไม่ได้รวม Vat' : 'ไม่มี Vat'}</b>
              </div>
              {this.props.purchase.paymentType !== 'เงินสด' && <div className="col-12">
                ข้อมูลการชำระเงิน: <b>{this.props.purchase.paymentDetail}</b>
              </div>}
              <div className="col-12">
                <table className="table">
                  <thead>
                    <th>ราคาสินค้ารวม</th>
                    <th>Vat(7%)</th>
                    <th>ค่าบริการอื่นๆ</th>
                    <th>ส่วนลด</th>
                    <th>ยอดรวมที่ต้องชำระ</th>
                  </thead>
                  <tbody>
                    <td>{numeral(this.props.purchase.stockValue).format('0,0.00')}</td>
                    <td>{numeral(this.props.purchase.vat).format('0,0.00')}</td>
                    <td>{numeral(this.props.purchase.expenseValue).format('0,0.00')}</td>
                    <td>- {numeral(this.props.purchase.discount).format('0,0.00')}</td>
                    <td>{numeral(this.props.purchase.total).format('0,0.00')}</td>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="col-3">
            <div className="row">
              <div className="col-12 mb-3">
                <button onClick={this.props.backPage} className="btn btn-danger">กลับ</button>
              </div>
              {
                this.props.purchase.paymentStatus === 'unpaid' &&
                <div className="col-12">
                  <button className="btn btn-dark" onClick={this.cancelPurchaseOrder}>ยกเลิกใบสั่งของนี้</button>
                </div>
              }
              {
                this.props.purchase.approveFile !== null ?
                <div className="col-12 mb-3">
                  <a target="_blank" href={'http://192.168.100.75:2224/public/poApproveFile/'+this.props.purchase.approveFile} className="mt-2 btn btn-link" >ใบอนุมัติ</a>
                </div> :
                <div className="col-12 mb-3">
                      <span style={{color: 'red'}}>ไม่พบ P.O.</span>
                </div>
              }
              {
                this.props.purchase.receiptFile !== null &&
                <div className="col-12 mb-3">
                  <a target="_blank" href={'https://tunit3-samed.ap.ngrok.io/public/storagePurchaseReceipt/'+this.props.purchase.receiptFile} className="mt-2 btn btn-dark" >ใบ Receipt</a>
                </div>
              }
            </div>
          </div>
        </div>
        <div className='row mt-5'>
          <div className="col-12">
            <h3>รายการสินค้า</h3>
          </div>
          <div className="col-12">
            <table className="table table-striped">
                <colgroup>
                  <col style={{ width: '5%' }} />         {/* คอลัมน์ 1 */}
                  <col style={{ width: '10%' }} />          {/* คอลัมน์ 2 - ขยาย */}
                  <col style={{ width: '45%' }} />
                <col style={{ width: '10%' }} />
              <col style={{ width: '10%' }} />       {/* คอลัมน์ 3 */}
                <col style={{ width: '10%' }} />
<col style={{ width: '10%' }} />
                </colgroup>
              <thead className="table-light">
                <tr>
                  <th>#</th>
                <th>จำนวนที่สั่ง</th>
                  <th>รายการสินค้า</th>
                  <th>ราคา/หน่วย</th>
                  <th>Vat</th>
                  <th>ราคารวม</th>
                  <th>จำนวนที่รับของแล้ว</th>
                </tr>
              </thead>
              <tbody>
                {this.props.purchase.items.length !== 0 ?
                  this.props.purchase.items.map((x, index) => (
                    <tr>
                 <td>{index+1}</td>
                 <td>{numeral(x.quantity).format('0,0.00')}</td>
                      <td>{x.name} [{x.unit}]</td>
                      <td>{numeral(x.price).format('0,0.00')}</td>
                      <td>{x.vat === 'vat' ? 'V' : 'NV'}</td>
                      <td>{x.total ? numeral(x.total).format('0,0.00') : numeral(x.price * x.quantity).format('0,0.00')}</td>
                      <td>{numeral(x.received).format('0,0.00')}</td>
                    </tr>
                  )) :
                  <tr>
                    <td colspan='6'>ไม่พบรายการสินค้า</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
        <div className='row mt-5'>
          <div className="col-12">
            <h3>รายการบริการอื่นๆ</h3>
          </div>
          <div className="col-12">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>รายการ</th>
                  <th>จำนวนเงิน</th>
                </tr>
              </thead>
              <tbody>
                {this.props.purchase.expenses.length !== 0 ?
                  this.props.purchase.expenses.map(x => (
                    <tr>
                      <td>{x.detail}</td>
                      <td>{x.amount}</td>
                    </tr>
                  )) :
                  <tr>
                    <td colspan='2'>ไม่พบรายการ</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
        <div className="row mt-5">
          <div className="col-12">
            <h3>ข้อมูลการชำระเงิน</h3>
          </div>
          <div className="col-12 mt-5">
            <button onClick={this.resetPayment} className="btn btn-danger">Clear payment</button>
          </div>
        </div>
        <div className="row mt-2">
          <div className="col-12">
            ยอดค้างชำระ: {numeral(this.props.purchase.total - this.props.purchase.payments.reduce((sum, i) => (sum+i.amount), 0)).format('0,0.00')}
          </div>
        </div>
        {this.props.purchase.paymentStatus === 'unpaid' &&
          (this.props.purchase.receiptFile === null ?
          <div className="row mt-2 mb-2">
            <div className="col-12">
              <p>อัพโหลดใบชำระเงิน</p>
              <input onChange={this.receiptFileOnChanage} className="input-control  d-block" id="receiptFile" type='file' accept="image/*, application/pdf" />
              </div>
              {
                this.state.receiptFile !== '' &&
                <div className="col-12 mt- 2">
                  <button onClick={this.submitReceiptFile} className="btn btn-success">
                    บันทึก Receipt
                  </button>
                </div>
              }
            </div>
          :
          <div className="row mt-2 mb-2">
            <div className="col-2">
              ชำระเงินโดย: <b>{this.state.type}</b>
            </div>
          <div className="col-2">
            <button onClick={() => this.setType('เงินสด')} className="btn btn-warning">เงินสด</button>
          </div>
          <div className="col-2">
            <button onClick={() => this.setType('โอนเงิน')} className="btn btn-warning">โอนเงิน</button>
          </div>
          <div className="col-2">
            <button onClick={() => this.setType('โอนเงินโดย MD')} className="btn btn-warning">โอนเงินโดย MD</button>
          </div>
          <div className="col-2">
            <button onClick={() => this.setType('บัตรเครดิต')} className="btn btn-warning">บัตรเครดิต</button>
          </div>
          <div className="col-2">
            <button onClick={() => this.setType('ร้านค้า')} className="btn btn-warning">เข้าบัญชีร้านค้า</button>
          </div>
        </div>)
      }
        {
          this.state.type === 'เงินสด' &&
          <div className="row mt-2">
            <div className="col-4">
              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <span className="input-group-text" >จำนวนเงิน</span>
                </div>
                <input value={this.state.amount} onChange={this.valueOnChange} name="amount" type="text" className="form-control" aria-describedby="basic-addon3" />
              </div>
            </div>
            <div className="col-3">
              <button onClick={this.submitPayment} className="btn btn-success">บันทึก</button>
            </div>
          </div>
        }
        {
          this.state.type === 'โอนเงิน' &&
          <div className="row mt-2">
            <div className="col-4">
              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <span className="input-group-text" >จำนวนเงิน</span>
                </div>
                <input value={this.state.amount} onChange={this.valueOnChange} name="amount" type="text" className="form-control" aria-describedby="basic-addon3" />
              </div>
            </div>
            <div className="col-4">
              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <span className="input-group-text" >หลักฐานการโอนเงิน</span>
                </div>
                <input onChange={this.fileOnChange} type="file" className="form-control" aria-describedby="basic-addon3" />
              </div>
            </div>
            <div className="col-3">
              <button onClick={this.submitPayment} className="btn btn-success">บันทึก</button>
            </div>
          </div>
        }
        {
          this.state.type === 'โอนเงินโดย MD' &&
          <div className="row mt-2">
            <div className="col-4">
              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <span className="input-group-text" >จำนวนเงิน</span>
                </div>
                <input value={this.state.amount} onChange={this.valueOnChange} name="amount" type="text" className="form-control" aria-describedby="basic-addon3" />
              </div>
            </div>
            <div className="col-4">
              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <span className="input-group-text" >หลักฐานการโอนเงิน</span>
                </div>
                <input onChange={this.fileOnChange} type="file" className="form-control" aria-describedby="basic-addon3" />
              </div>
            </div>
            <div className="col-3">
              <button onClick={this.submitPayment} className="btn btn-success">บันทึก</button>
            </div>
          </div>
        }
        {
          this.state.type === 'บัตรเครดิต' &&
          <div className="row mt-2">
            <div className="col-4">
              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <span className="input-group-text" >จำนวนเงิน</span>
                </div>
                <input value={this.state.amount} onChange={this.valueOnChange} name="amount" type="text" className="form-control" aria-describedby="basic-addon3" />
              </div>
            </div>
            <div className="col-4">
              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <span className="input-group-text" >หมายเลขบัตร</span>
                </div>
                <input value={this.state.reference} onChange={this.valueOnChange} name="reference" type="text" className="form-control" aria-describedby="basic-addon3" />
              </div>
            </div>
            <div className="col-3">
              <button onClick={this.submitPayment} className="btn btn-success">บันทึก</button>
            </div>
          </div>
        }

        {
          this.state.type === 'ร้านค้า' &&
          <div className="row mt-2">
            <div className="col-4">
              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <span className="input-group-text" >จำนวนเงิน</span>
                </div>
                <input value={this.state.amount} onChange={this.valueOnChange} name="amount" type="text" className="form-control" aria-describedby="basic-addon3" />
              </div>
            </div>
            <div className="col-4">
              <Select options={this.props.suppliers} onChange={this.onSelectSupplier} />
            </div>
            <div className="col-3">
              <button onClick={this.submitPayment} className="btn btn-success">บันทึก</button>
            </div>
          </div>
        }

        <div className='row mt-5'>
          <div className="col-12">
            <table className="table">
              <thead>
                <tr>
                  <th>วันที่</th>
                  <th>ชำระโดย</th>
                  <th>จำนวนเงิน</th>
                  <th>บันทึกโดย</th>
                  <th>อ้างอิง</th>
                </tr>
              </thead>
              <tbody>
                {this.props.purchase.payments.map(x => (
                  <tr>
                    <td>{moment(x.timestamp).format('DD/MM/YYYY')}</td>
                    <td>{x.type}</td>
                    <td>{x.amount}</td>
                    <td>{x.short_name}</td>
                    <td>{x.type === 'ร้านค้า' ? x.creditSupplier : x.reference}</td>
                  </tr>
                ))}
              </tbody>
            </table>
              </div>
            </div>
      </div>
    )
  }
}
