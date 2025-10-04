import React from 'react'
import Select from 'react-select'
import validator from 'validator'
import {
  getPrinterList,
  getCategoryList,
  getItems,
  sumitNewMenuItem,
  updateMenuItemStatus,
  uploadImageUrlToServer,
  updateItemPrice,
  updateItemStaffPrice,
  setPrinterByItemId
} from './tunnel'
import ImageResize from 'image-resize';

import {IP} from './../../constanst'

export default class ItemList extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      showAddNewItem: false,
      categoryOptions: [],
      printerOptions: [],
      menuItem: [],
      itemCode: '',
      itemName: '',
      itemEnglishName: '',
      price: '',
      staffPrice: '',
      selectedCategory: '',
      selectedPrinter: '',
      meat: ''
    }
  }

  reloadPage = () => {
    getPrinterList(res => {
      if(res.status){
        this.setState(() => ({
          printerOptions: res.printerList.map(x => ({label: x.name, value: x.id}))
        }))
      }else{
        alert(res.msg)
      }
    })
    getCategoryList(res => {
      if(res.status){
        this.setState(() => ({
          categoryOptions: res.categoryList.map(x => ({label: `${x.name} - ${x.food_type}`, value: x.id})).sort((a,b) => a.order_number - b.order_number)
        }))
      }else{
        alert(res.msg)
      }
    })
    getItems(res => {
      if(res.status){
        console.log(res.items);
        this.setState(() => ({
          menuItem: res.items
        }))
      }else{
        alert(res.msg)
      }
    })
  }

  componentDidMount(){
    this.reloadPage()
  }

  toggleShowAddNewItem = () => {
    this.setState(() => ({
      showAddNewItem: !this.state.showAddNewItem,
      itemCode: '',
      itemName: '',
      itemEnglishName: '',
      price: '',
      staffPrice: '',
      selectedCategory: '',
      selectedPrinter: '',
      meat: ''
    }))
  }

  onValueChange = e => {
    const value = e.target.value
    const name = e.target.name
    this.setState(() => ({
      [name]: value
    }))
  }

  onPriceChange = e => {
    const value = e.target.value
    const name = e.target.name
    if(validator.isInt(value) || value.trim() === ''){
      this.setState(() => ({
        [name]: value
      }))
    }
  }

  onSelectedCategory = (e) => {
    const value = e.value
    this.setState(() => ({
      selectedCategory: value
    }))
  }

  onSelectedPrinter = (e) => {
    const value = e.value
    this.setState(() => ({
      selectedPrinter: value
    }))
  }

  onSelectedMeat = (e) => {
    const value = e.value
    this.setState(() => ({
      meat: value
    }))
  }

  submit = () => {
    const {itemCode, itemName, itemEnglishName, price, staffPrice, selectedCategory, selectedPrinter, menuItem, meat} = this.state

    let found = menuItem.find(x => x.code === itemCode.trim())
    if(found){
        alert('รหัสซ้ำกับรายการอื่นๆ กรุณาลองใหม่อีกครั้ง')
        return
    }

    if(!itemCode.match(/^\d{4}$/)){
      alert('รูปแบบรหัสไม่ถูกต้อง กรุณาใส่เป็นหมายเลย 4 หลัก')
      return
    }

    if(itemName.trim() === ''){
      alert('กรุณาระบุชื่อรายการ')
      return
    }

    if(itemEnglishName.trim() === ''){
      alert('กรุณาระบุชื่อรายการภาษาอังกฤษ')
      return
    }

    if(price.trim() === ''){
      alert('กรุณาระบุราคาอาหารให้ถูกต้อง')
      return
    }

    if(staffPrice.trim() === ''){
      alert('กรุณาระบุราคาพนักงานให้ถูกต้อง')
      return
    }

    if(selectedCategory === ''){
      alert('กรุณาเลือกหมวดรายการ')
      return
    }

    if(selectedPrinter === ''){
      alert('กรุณาเลือกเครื่องพิมพ์')
      return
    }

    sumitNewMenuItem({
      itemCode, itemName, itemEnglishName, price, staffPrice, selectedCategory, selectedPrinter,
      username: this.props.user.username,
      meat
    }, res => {
      if(res.status){
        alert('ข้อมูลถูกบันทึก')
        this.toggleShowAddNewItem()
        this.componentDidMount()
      }else{
        alert(res.msg)
      }
    })

  }

  updateStatus = (code, status) => {
    updateMenuItemStatus({code, status}, res => {
      if(res.status){
        getItems(res => {
          if(res.status){
            this.setState(() => ({
              menuItem: res.items
            }))
          }else{
            alert(res.msg)
          }
        })
      }
    })
  }

  uploadImageUrl = e => {
    const imageFile = e.target.files[0]
    const name = e.target.files[0].name
    const code = e.target.name
    var imageResize = new ImageResize({
      format: 'png',
      width: 500,
      quantity: 1
    });
    let dataURLtoFile = (dataurl, filename) => {
      let arr = dataurl.split(',')
      let mime = arr[0].match(/:(.*?);/)[1]
      let bstr = atob(arr[1])
      let n = bstr.length
      let u8arr = new Uint8Array(n)

      while(n--){
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new File([u8arr], filename, { type: mime})
    }
    imageResize.play(URL.createObjectURL(imageFile)).then(res => {
      let file = dataURLtoFile(res,name)
      console.log(file);
      uploadImageUrlToServer({file, code}, res => {
        if(res.status){
          getItems(res => {
            if(res.status){
              this.setState(() => ({
                menuItem: res.items
              }))
            }else{
              alert(res.msg)
            }
          })
        }else{
          alert(res.msg)
        }
      })
      // this.setState(() => ({
      //   bankTransferFile: {file, url: URL.createObjectURL(file)}
      // }))
    })
  }

  render(){
    const meatOptions = [
      {label: 'ไก่', value: 'ไก่'},
      {label: 'หมู', value: 'หมู'},
      {label: 'เนื้อ', value: 'เนื้อ'},
      {label: 'กุ้ง', value: 'กุ้ง'},
      {label: 'หมึก', value: 'หมึก'},
      {label: 'ปู', value: 'ปู'},
      {label: 'ทะเล', value: 'ทะเล'},
      {label: 'หอย', value: 'หอย'},
      {label: 'ผัก', value: 'ผัก'},
      {label: 'ปลา', value: 'ปลา'},
      {label: 'อื่นๆ', value: 'อื่นๆ'},

    ]
    return(
      <div className="row">
        <div className="col-12">
          <div className="row">
            <div className="col-12">
              <button onClick={this.toggleShowAddNewItem} className="btn btn-link">+ รายการอาหาร</button>
            </div>
          </div>
          {this.state.showAddNewItem &&
            <div className="row">
              <div className="col-12 col-md-3 mb-3">
                <div className="form-group">
                  <label>รหัสอาหาร</label>
                  <input name="itemCode" onChange={this.onPriceChange} value={this.state.itemCode} type="text" className="form-control" />
                </div>
              </div>
              <div className="col-12 col-md-3 mb-3">
                <div className="form-group">
                  <label>ชื่อภาษาไทย</label>
                  <input name="itemName" onChange={this.onValueChange} value={this.state.itemName} type="text" className="form-control" />
                </div>
              </div>
              <div className="col-12 col-md-3 mb-3">
                <div className="form-group">
                  <label>ชื่อภาษาอังกฤษ</label>
                  <input name="itemEnglishName" onChange={this.onValueChange} value={this.state.itemEnglishName} type="text" className="form-control" />
                </div>
              </div>
              <div className="col-12 col-md-3 mb-3">
                <div className="form-group">
                  <label>ราคาลูกค้า</label>
                  <input name="price" onChange={this.onPriceChange} value={this.state.price} type="text" className="form-control" />
                </div>
              </div>
              <div className="col-12 col-md-2 mb-3">
                <div className="form-group">
                  <label>ราคาพนักงาน</label>
                  <input name="staffPrice" onChange={this.onPriceChange} value={this.state.staffPrice} type="text" className="form-control" />
                </div>
              </div>
              <div className="col-12 col-md-3 mb-3">
                <div className="form-group">
                  <label>เลือกหมวดอาหาร</label>
                <Select onChange={this.onSelectedCategory} options={this.state.categoryOptions} />
                </div>
              </div>
              <div className="col-12 col-md-3 mb-3">
                <div className="form-group">
                  <label>เลือกเครื่องพิมพ์</label>
                <Select onChange={this.onSelectedPrinter} options={this.state.printerOptions} />
                </div>
              </div>
              <div className="col-12 col-md-3 mb-3">
                <div className="form-group">
                  <label>เลือกประเภทเนื้อสัตว์</label>
                <Select onChange={this.onSelectedMeat} options={meatOptions} />
                </div>
              </div>
              <div className="col-12 col-md-2 mb-3 text-center">
                <button onClick={this.submit} className="btn btn-success">บันทึก</button>
              </div>
              <div className="col-12 col-md-2 mb-3 text-center">
                <button onClick={this.toggleShowAddNewItem} className="btn btn-danger">ปิด</button>
              </div>
            </div>
          }
          <div className="row">
            <div className="col-12">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>รหัส</th>
                    <th>ชื่อ</th>
                  <th>รูป</th>
                  <th>Status</th>
                    <th>หมวด</th>
                  <th>เครื่องพิมพ์</th>
                    <th>ราคา</th>
                    <th>ราคาพนักงาน</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    this.state.menuItem.map(x => <ItemTr printerOptions={this.state.printerOptions} reloadPage={this.reloadPage} item={x} uploadImageUrl={this.uploadImageUrl} updateStatus={this.updateStatus} />)
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    )
  }
}


class ItemTr extends React.Component {
  constructor(props){
    super(props)
    const x = this.props.item
    this.state = {
      showEditPrice: false,
      setPrice: x.price,
      showEditStaffPrice: false,
      setStaffPrice: x.staff_price,
      printerId: ''
    }
  }

  inputChange = e => {
    const {value, name} = e.target
    this.setState(() => ({
      [name]: value
    }))
  }

  openEditPrice = () => {
    this.setState(() => ({
      showEditPrice: true
    }))
  }


  openEditStaffPrice = () => {
    this.setState(() => ({
      showEditStaffPrice: true
    }))
  }

  onSelectedPrinter

  updateStaffPrice = () => {
    const code = this.props.item.code
    const price = this.state.setStaffPrice
    if(isNaN(price)){
      alert('กรุณาใส่ราคาให้ถูกต้อง')
      return
    }

    updateItemStaffPrice({code, price: parseInt(price)}, res => {
      if(res.status){
        this.setState(() => ({
          showEditStaffPrice: false
        }), () => {
          this.props.reloadPage()
        })
      }else{
        alert(res.msg)
      }
    })

  }

  updatePrice = () => {
    const code = this.props.item.code
    const price = this.state.setPrice
    if(isNaN(price)){
      alert('กรุณาใส่ราคาให้ถูกต้อง')
      return
    }

    updateItemPrice({code, price: parseInt(price)}, res => {
      if(res.status){
        this.setState(() => ({
          showEditPrice: false
        }), () => {
          this.props.reloadPage()
        })
      }else{
        alert(res.msg)
      }
    })

  }

  onSelectedPrinter = (e) => {
    const value = e.value
    console.log(e);
    setPrinterByItemId({printerId: e.value, itemCode: this.props.item.code}, res => {
      if(!res.status){
        alert(res.msg)
      }

    })
    this.setState(() => ({
      printerId: value
    }))
  }

  render() {
    const x = this.props.item
    return (
      <tr>
        <td>{x.code}</td>
        <td>{x.name}<p>{x.english_name}</p></td>
        
      <td>{x.imageUrl !== null ? <img src={`${IP}/public/storageMenuImage/${x.imageUrl}`} width="100" /> : <input name={x.code} type="file" accept="image/*" onChange={this.props.uploadImageUrl}/> }</td>
      <td>{x.status === 'available' ?
        <button onClick={() => this.props.updateStatus(x.code, 'unavailable')} className="btn btn-success">กำลังขาย</button>:
        <button onClick={() => this.props.updateStatus(x.code, 'available')} className="btn btn-danger">ไม่ได้ขาย</button>}</td>
        <td>{x.cat_name} - {x.food_type}</td>
        <td>
          <Select
            defaultValue={{ label: x.printerName, value: 0 }}
           onChange={this.onSelectedPrinter} options={this.props.printerOptions} />
        </td>
      {
        !this.state.showEditPrice ? <td>{x.price} <br /><button onClick={this.openEditPrice} className="btn btn-warning">แก้ไข</button></td> :
        <td>
          <input type="text" value={this.state.setPrice} onChange={this.inputChange} name='setPrice' /><br />
        <button className="btn btn-success" onClick={this.updatePrice}>Update</button>
        </td>


      }
      {
        !this.state.showEditStaffPrice ? <td>{x.staff_price} <br /><button onClick={this.openEditStaffPrice} className="btn btn-warning">แก้ไข</button></td> :
        <td>
          <input type="text" value={this.state.setStaffPrice} onChange={this.inputChange} name='setStaffPrice' /><br />
        <button className="btn btn-success" onClick={this.updateStaffPrice}>Update</button>
        </td>
      }
      </tr>
    )
  }
}
