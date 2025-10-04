
import React from 'react'
import Select from 'react-select'
import validator from 'validator';
import numeral from 'numeral'
import Swal from 'sweetalert2'
import {
  getNoneRecipeMenuItems,
  getRecipes,
  submitNewRecipe,
  getRecipe,
  getStockItems,
  submitIngredientToRecipe,
  deleteIngredientFromRecipe,
  deleteRecipe
} from './tunnel'

export default class Recipe extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      currentPage: 'main',
      recipeId: ''
    }
  }

  backBtn = () => {
    this.setState(() => ({
      currentPage: 'main',
      recipeId: ''
    }))
  }

  openRecipe = (recipeId) => {
    this.setState(() => ({
      currentPage: 'recipe',
      recipeId
    }))
  }

  render(){
    return(
      <div className="container">
        { this.state.currentPage === 'main' && <MainRecipe openRecipe={this.openRecipe} /> }
        { this.state.currentPage === 'recipe' && <AddNewRecipe backBtn={this.backBtn}  recipeId={this.state.recipeId} /> }
      </div>
    )
  }
}

class MainRecipe extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      recipeList: [],
      menuList: [],
      selectedMenu: ''
    }
  }

  componentDidMount(){
    getRecipes(res => {
      if(res.status){
        console.log(res);
        this.setState(() => ({
          recipeList: res.recipes
        }))
      }
    })
    getNoneRecipeMenuItems(res => {
      if(res.status){
        this.setState(() => ({
          menuList: res.menuList
        }))
      }
    })
  }


  selectOnChange = e => {
    this.setState(() => ({
      selectedMenu: e.value
    }))
  }

  submitNewRecipe = () => {
    let { selectedMenu} = this.state
    let { openRecipe } = this.props
    if(selectedMenu === ''){
      Swal.fire({
        icon: 'error',
        title:'กรุณาเลือกเมนู'
      })
      return
    }

    submitNewRecipe({menuCode: selectedMenu}, res => {
      if(res.status){
        openRecipe(res.recipeId)
      }else{
        Swal.fire({
          icon: 'error',
          title: res.msg
        })
      }
    })

  }

  render(){
    let options = this.state.menuList.map(menu => ({label: `[${menu.code}] - ${menu.name}`, value: menu.code}))
    let totalCost = this.state.recipeList.reduce((total, rep) => total + rep.cost , 0)
    let totalSale = this.state.recipeList.reduce((total, rep) => total + rep.price , 0)
    return (
      <div className="col-12">
        <div className="col-12 mt-3">
          <div className="row">
            <div className="col-10">
              <Select options={options} selected={this.state.selectedMenu} onChange={this.selectOnChange} />
            </div>
            <div className="col-2">
              <button onClick={this.submitNewRecipe} className="btn btn-success">สร้าง Recipe</button>
            </div>
          </div>
        </div>
        <div className="col-12 mt-3">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th style={{textAlign: 'center', background: '#71D3F5'}}>Total Sale</th>
                <th style={{textAlign: 'center', background: '#ABE332'}}>Total Cost</th>
                <th style={{textAlign: 'center', background: '#9894BD'}}>Cost (%)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{textAlign: 'center'}}>{numeral(totalSale).format('0,0.00')}</td>
                <td style={{textAlign: 'center'}}>{numeral(totalCost).format('0,0.00')}</td>
                <td style={{textAlign: 'center'}}>{numeral(totalCost*100/totalSale).format('0.00')}%</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="col-12">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th style={{width: '40%'}}>รายการ</th>
                <th style={{width: '15%', textAlign: 'right'}}>ต้นทุน</th>
                <th style={{width: '15%', textAlign: 'right'}}>ราคาขาย</th>
                <th style={{width: '20%', textAlign: 'right'}}>Cost per portion(%)</th>
                <th style={{width: '10%'}}></th>
              </tr>
            </thead>
            <tbody>
              {
                this.state.recipeList.map(x => (
                  <tr key={x.id}>
                    <td style={{width: '40%'}} >{x.name}</td>
                    <td style={{width: '15%', textAlign: 'right'}} >{numeral(x.cost).format('0,0.00')}</td>
                    <td style={{width: '15%', textAlign: 'right'}} >{numeral(x.price).format('0,0.00')}</td>
                    <td style={{width: '20%', textAlign: 'right'}} >{numeral(x.cost*100/x.price).format('0.00')}%</td>
                    <td style={{width: '10%'}}><button onClick={() => this.props.openRecipe(x.id)} className="btn btn-dark">ดูข้อมูล</button></td>
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


class AddNewRecipe extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      menuList: [],
      ingredientList: [],
      itemList: [],
      showAddIngredient: false,
      quantity: '',
      unit: '',
      price: '',
      total: 'xxx',
      selectedItem: '',
      recipe: ''
    }
  }

  deleteIngredientFromRecipe = (item) => {
    let {recipeId} = this.props
    let {itemId, name} = item
    let {loadRecipe} = this

    Swal.fire({
      title: 'ลบวัตถุดิบ?',
      text: name,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ปิด',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteIngredientFromRecipe({itemId, recipeId}, res => {
          if(res.status){
            loadRecipe(recipeId)
          }else{
            Swal.fire({
              icon: 'error',
              title: res.msg
            })
          }
        })
      }
})
  }

  submitIngredientToRecipe = () => {
    let {selectedItem, quantity} = this.state
    let {recipeId} = this.props
    let {loadRecipe} = this
    if(selectedItem === ''){
      Swal.fire({icon: 'error', title: 'กรุณาเลือกวัตถุดิบ'})
      return
    }
    if(quantity === ''){
      Swal.fire({icon: 'error', title: 'กรุณาใส่จำนวน'})
      return
    }
    submitIngredientToRecipe({
      recipeId,
      itemId:selectedItem,
      quantity
    }, res => {
      if(res.status){
        this.setState(() => ({
          showAddIngredient: false,
          quantity: '',
          unit: '',
          price: '',
          selectedItem: ''
        }))
        loadRecipe(recipeId)
      }else{
        Swal.fire({
          icon: 'error',
          title: res.msg
        })
      }
    })
  }

  componentDidMount() {
    getStockItems(res => {
      if(res.status){
        this.setState(() => ({
          itemList: res.itemList
        }))
      }
    })
    this.loadRecipe(this.props.recipeId)
  }

  deleteRecipe = () => {
    let {recipeId, backBtn} = this.props
    let { recipe } = this.state
    Swal.fire({
      title: 'ยืนยันลบสูตรายการนี้?',
      text: `${recipe.code} - ${recipe.name}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ปิด',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteRecipe({recipeId}, res => {
          if(res.status){
            backBtn()
          }else{
            Swal.fire({
              icon: 'error',
              title: res.msg
            })
          }
        })
      }
})
  }

  loadRecipe = recipeId => {
    getRecipe({recipeId}, res => {
      if(res.status){
        console.log(res);
        this.setState(() => ({
          recipe: res.recipe,
          ingredientList: res.ingredientList
        }))
      }
    })
  }


  switchShowAddIngredient = () => {
    this.setState(() => ({
      showAddIngredient: !this.state.showAddIngredient
    }))
  }


  textOnChange = e => {
    let { name, value } = e.target
    this.setState(() => ({
      [name]: value
    }))
  }

  floatOnChange = e => {
    let { name, value } = e.target
    let calculateTotal = this.calculateTotal
    if(validator.isFloat(value) || value === ''){
        this.setState(() => ({
            [name]: value
        }), () => {
          calculateTotal()
        })
    }
  }

  calculateTotal = () => {
    let { price, quantity } = this.state
    if(price === '' || quantity === ''){
      this.setState(() => ({
        total: 'xxx'
      }))
    }else{
      this.setState(() => ({
        total: numeral(parseFloat(price) * parseFloat(quantity)).format('0,0.00')
      }))
    }
  }

  selectOnChange = e => {
    this.setState(() => ({
      selectedItem: e.value,
      price: e.price,
      unit: e.unit
    }))
  }


  render(){
    let {recipe, itemList, selectedItem, price, unit, quantity, ingredientList, showAddIngredient} = this.state
    let options = ingredientList.reduce((result, i) => {
      return result.filter(x => x.id !== i.itemId)
    }, itemList).map(item => ({
      label: `${item.name} / ${item.unit}`,
      value: item.id,
      price: item.current_price,
      unit: item.unit
    }))

    let total = ingredientList.reduce((result, ing) => {
      return result += (ing.quantity * ing.current_price)
    }, 0)
    let seasoningCost = total * 0.1
    let totalCost = total + seasoningCost


    return(
      <div className="row">
        <div className="col-8 mt-3">
          { recipe !== '' && <h3>{recipe.code} - {recipe.name}</h3>}
        </div>
        <div className="col-2 mt-3">
          <button onClick={this.deleteRecipe} className="btn btn-danger">ลบ</button>
        </div>
        <div className="col-2 mt-3">
          <button onClick={this.props.backBtn} className="btn btn-danger">กลับ</button>
        </div>
        <div className="col-12 mt-3">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th style={{width: '30%'}} >รายการ</th>
                <th style={{width: '10%',textAlign: 'center'}} >จำนวน</th>
                <th style={{width: '15%',textAlign: 'center' }} >หน่วย</th>
                <th style={{width: '15%', textAlign: 'center'}} >ราคา/หน่วย</th>
                <th style={{width: '15%', textAlign: 'center'}} >ราคารวม</th>
                <th style={{width: '15%'}} ></th>
              </tr>
            </thead>
            <tbody>
              {
                ingredientList.map(ing => (
                  <tr>
                    <td style={{width: '30%'}}>{ing.name}</td>
                    <td style={{width: '10%',textAlign: 'center'}}>{ing.quantity}</td>
                    <td style={{width: '15%', textAlign: 'center'}}>{ing.unit}</td>
                    <td style={{width: '15%',  textAlign: 'center'}}>{ing.current_price}</td>
                    <td style={{width: '15%'}} className="m-1 text-center">{numeral(ing.quantity * ing.current_price).format('0,0.00')}</td>
                    <td style={{width: '15%'}} className="m-1 text-right"><button onClick={() => this.deleteIngredientFromRecipe(ing)} className="btn btn-danger">ลบ</button></td>
                  </tr>
                ))
              }
              { showAddIngredient ?
                <tr>
                  <td style={{width: '30%'}}><Select options={options} selected={selectedItem} onChange={this.selectOnChange} /></td>
                  <td style={{width: '10%',textAlign: 'center'}}><input onChange={this.floatOnChange} name="quantity" value={quantity} style={{width: '100%'}} className="m-1" type="text" /></td>
                  <td style={{width: '15%', textAlign: 'center'}}>{unit}</td>
                  <td style={{width: '15%',  textAlign: 'center'}}>{price}</td>
                  <td style={{width: '15%'}} className="m-1 text-center">{this.state.total}</td>
                  <td style={{width: '15%'}} className="m-1 text-right"><button onClick={this.submitIngredientToRecipe} className="btn btn-success">บันทึก</button></td>
                </tr>
                :
                <tr>
                  <td className="text-center" colSpan='6'><button onClick={this.switchShowAddIngredient} className="btn btn-success">+ วัตถุดิบ</button></td>
                </tr>
              }

            </tbody>
          </table>
        </div>
        <div className="col-md-4">
        </div>
        <div className="col-md-8">
          <table className="table table-bordered">
            <tbody>
              <tr>
                <td style={{background: '#ABE332', width: '80%'}}>Total</td>
                <td className="text-right"><b>{numeral(total).format('0,0.00')}</b></td>
              </tr>
              <tr>
                <td style={{background: '#ABE332', width: '80%'}}>Sesoning/Added Mixed 10%</td>
                <td className="text-right"><b>{numeral(seasoningCost).format('0,0.00')}</b></td>
              </tr>
              <tr>
                <td style={{background: '#ABE332', width: '80%'}}>Total Cost</td>
                <td className="text-right"><b>{numeral(totalCost).format('0,0.00')} </b></td>
              </tr>
              <tr>
                <td style={{background: '#ABE332', width: '80%'}}>Selling Price</td>
                <td className="text-right"><b>{recipe !== '' && numeral(recipe.price).format('0,0')}</b></td>
              </tr>
              <tr>
                <td style={{background: '#ABE332', width: '80%'}}>Cost per portion</td>
                <td className="text-right"><b>{numeral(totalCost*100/recipe.price).format('0,0.00')}%</b></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}
