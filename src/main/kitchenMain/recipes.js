import React from 'react'
import Select from 'react-select'
import { saveNewRecipe, getRecipes } from './tunnel.js'
export default class Recipe extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      showAddNewRecipe: false,
      recipeList: [],
      selectedRecipe: ''
    }
  }
  componentDidMount(){
    getRecipes(res => {
      if(res.status){
        this.setState(() => ({
          recipeList: res.recipeList
        }))
      }
    })
  }

  toggleNewRecipeButton = () => {
    console.log(this.state.showAddNewRecipe);
    this.setState(() => ({
      showAddNewRecipe: !this.state.showAddNewRecipe
    }))
  }
  refreshRecipePage = () => {
    this.setState(() => ({
      showAddNewRecipe: false
    }))
    this.componentDidMount()
  }

  backToRecipeList = () => {
    this.setState(() => ({
      showAddNewRecipe: false,
      selectedRecipe: ''
    }))
    this.componentDidMount()
  }

  openRecipe = recipe => {
    this.setState(() => ({
      selectedRecipe: recipe
    }))
  }

  render(){
    return (
      <div className="row">
        {
          ( !this.state.showAddNewRecipe && this.state.selectedRecipe === '' ) &&
          <div className="col-12">
            <button onClick={this.toggleNewRecipeButton}  className="btn btn-link">+ เพิ่มสูตรใหม่</button>
            <br />
              <table className="table">
                <thead>
                  <tr>
                    <td>ประเภท</td>
                    <td>ชื่อเมนู</td>
                    <td>คำบรรยาย</td>
                  </tr>
                </thead>
                <tbody>
                  {
                    this.state.recipeList.map(x =>
                      <tr onClick={() => this.openRecipe(x)}>
                        <td>{x.catagory}</td>
                        <td>{x.name}</td>
                        <td>{x.description}</td>
                      </tr>
                    )
                  }
                </tbody>
              </table>
          </div>
        }
        {
          this.state.showAddNewRecipe &&
          <div className="col-12">
            <div className="row">
              <div className="col-12">
                <button onClick={this.backToRecipeList}  className="btn btn-link">{'< กลับ'}</button>
                </div>
              <div className="col-12">
                <AddNewRecipe refreshRecipePage={this.backToRecipeList} />
              </div>
            </div>
          </div>
        }

        {
          this.state.selectedRecipe !== '' &&
          <RecipeDisplay backToRecipeList={this.backToRecipeList} recipe={this.state.selectedRecipe} />
        }

      </div>
    )
  }
}

const RecipeDisplay = props => (
  <div className="col-12">
    <div className="row">
      <div className="col-12">
        <button onClick={props.backToRecipeList}  className="btn btn-link">{'< กลับ'}</button>
      </div>
      <div className="col-12">
        <h3>{props.recipe.name} </h3>
        <p style={{color:'grey'}}>{props.recipe.catagory}</p>
        <p>{props.recipe.description}</p>
      </div>
      <hr />
      <div className="col-12">
        <h5>วัตถุดิบ</h5>
        <ul>
          {
            props.recipe.ingredientList.map(x => <li>{x.name} {x.quantity} {x.unit}</li>)
          }
        </ul>
      </div>
      <div className="col-12">
        <h5>ขั้นตอนการทำ</h5>
        <ol>
          {
            props.recipe.stepList.sort((a,b) => a.arrangeInt - b.arrangeInt).map(x => <li>{x.text}</li>)
          }
        </ol>
      </div>
    </div>
  </div>
)

class AddNewRecipe extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      recipeName: '',
      description: '',
      showNewIngredient: false,
      recipeCatagory: '',
      ingredientName: '',
      ingredientQuantity: '',
      ingredientUnit: '',
      ingredientList: [],
      stepText: '',
      stepList: [],
    }
  }

  submitNewRecipe = () => {
    const { recipeName, description, recipeCatagory, ingredientList, stepList } = this.state
    if(recipeName.trim() === ''){
      alert('กรุณาใส่ชื่อเมนู')
      return
    }
    if(description.trim() === ''){
      alert('กรุณาใส่คำบรรยายเมนูนี้')
      return
    }
    if(recipeCatagory.trim() === ''){
      alert('กรุณาเลือกประเภทอาหาร')
      return
    }
    if(ingredientList.length === 0){
      alert('กรุณาเพิ่มวัตถุดิบ')
      return
    }
    if(stepList.length === 0){
      alert('กรุณาเพิ่มขั้นตอนในการทำ')
      return
    }
    saveNewRecipe({recipeName, description, recipeCatagory, ingredientList, stepList}, res => {
      if(res.status){
        alert('ข้อมูลถูกบันทึก')
        this.props.refreshRecipePage()
      }else{
        alert(res.msg)
      }
    })
  }

  toggleNewIngredientButton = () => {
    this.setState(() => ({
      showNewIngredient: !this.state.showNewIngredient
    }))
  }

  toggleNewStepButton = () => {
    this.setState(() => ({
      showAddNewStep: !this.state.showAddNewStep
    }))
  }

  saveNewIngredient = () => {
    const {ingredientName, ingredientQuantity, ingredientUnit, ingredientList} = this.state
    if(ingredientName.trim() === '' || ingredientQuantity.trim() === '' || ingredientUnit.trim() === ''){
      alert('กรุณาใส่ข้อมูลให้ครบ')
      return
    }
    let found = ingredientList.filter(x => (x.name === ingredientName && x.quantity === ingredientQuantity && x.unit === ingredientUnit))
    if(found.length === 0){
      let newList = [...this.state.ingredientList, {name: ingredientName, quantity: ingredientQuantity, unit: ingredientUnit}]
      this.setState(() => ({
        showNewIngredient: false,
        ingredientName: '',
        ingredientQuantity: '',
        ingredientUnit: '',
        ingredientList: newList
      }))
    }else{
      alert('รายการวัตถุดิบซ้ำ')
    }
  }

  foodTypeOnChange = (input) => {
    this.setState(() => ({
      recipeCatagory: input.value
    }))
  }

  saveNewStep = () => {
    const {stepText} = this.state
    if(stepText.trim() === ''){
      alert('กรุณาใส่ข้อมูลให้ครบ')
      return
    }
    this.setState(() => ({
      stepList: [ ...this.state.stepList, {text: stepText}],
      stepText: ''
    }))
  }

  textOnChange = e => {
    const value = e.target.value
    const name = e.target.name
    this.setState(() => ({
      [name]: value
    }))
  }

  deleteIngredient = (name, quantity, unit) => {
    let newList = this.state.ingredientList.filter(x => !(x.name === name && x.quantity === quantity && x.unit === unit))
    this.setState(() => ({
      ingredientList: newList
    }))
  }

  deleteStep = i => {
    let newList = this.state.stepList.filter((x, y) => y !== i)
    this.setState(() => ({
      stepList: newList
    }))
  }

  render(){
    const foodTypeOptions = [
      {label: 'อาหารไทย', value: 'อาหารไทย'},
      {label: 'อาหารฝรั่ง', value: 'อาหารฝรั่ง'},
      {label: 'ของหวาน', value: 'ของหวาน'},
    ]
    return (
      <div className="row">
        <div className="col-12">
          <h3>รายละเอียดสูตรอาหาร</h3>
        </div>
        <div className="col-12 col-md-6">
          <div className="form-group">
            <label>ชื่อ: </label>
            <input type="text" className="form-control" value={this.state.recipeName} name="recipeName" onChange={this.textOnChange} />
          </div>
        </div>
        <div className="col-12 col-md-6">
          <div className="form-group">
            <label>คำบรรยาย: </label>
            <input type="text" className="form-control" value={this.state.description} name="description" onChange={this.textOnChange} />
          </div>
        </div>
        <div className="col-12 col-md-6">
          <div class="form-group">
              <label for="exampleInputEmail1">ประเภทอาหาร:</label>
            <Select onChange={this.foodTypeOnChange} options={foodTypeOptions} />
            </div>
        </div>
        <div className="col-12">
          <h3>วัตถุดิบ</h3>
          <table className="table">
            <thead>
              <tr>
                <th>วัตถุดิบ</th>
                <th>จำนวน</th>
                <th>หน่วย</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {
                this.state.ingredientList.map(x =>
                  <tr>
                    <td>{x.name}</td>
                    <td>{x.quantity}</td>
                    <td>{x.unit}</td>
                    <td><button onClick={() => this.deleteIngredient(x.name, x.quantity, x.unit)} className="btn btn-danger">x</button></td>
                  </tr>
                )
              }
            </tbody>
          </table>
        </div>
        {
          this.state.showNewIngredient ?
          <div className="col-12 col-md-4">
            <div className="form-group">
              <label>ชื่อวัตถุดิบ: </label>
              <input type="text" className="form-control" name="ingredientName" value={this.state.ingredientName} onChange={this.textOnChange} />
            </div>
            <div className="form-group">
              <label>จำนวน: </label>
              <input type="text" className="form-control" name="ingredientQuantity" value={this.state.ingredientQuantity} onChange={this.textOnChange} />
            </div>
            <div className="form-group">
              <label>หน่วย: </label>
              <input type="text" className="form-control" name="ingredientUnit" value={this.state.ingredientUnit} onChange={this.textOnChange} />
            </div>
            <button onClick={this.saveNewIngredient} className="btn btn-secondary">
              + บันทึกวัตถุดิบ
            </button>
            &nbsp;
            &nbsp;
            <button onClick={this.toggleNewIngredientButton} className="btn btn-danger">
              ปิด
            </button>
          </div>
          :
          <div className="col-12">
            <button onClick={this.toggleNewIngredientButton} className="btn btn-secondary">
              + วัตถุดิบ
            </button>
          </div>
        }
        <div className="col-12">
          <h3>ขั้นตอนการทำ</h3>
          <ol>
            {
              this.state.stepList.map((x, i) => <li>{x.text} <button onClick={() => this.deleteStep(i)} className="btn btn-sm btn-danger">x</button></li>)
            }
          </ol>
        </div>
        <div className="col-8">
          <div className="form-group">
            <label>วิธีทำ: </label>
            <input type="text" className="form-control" name="stepText" value={this.state.stepText} onChange={this.textOnChange} />

          </div>
        </div>
        <div className="col-4">
          <div className="form-group">
            <label>&nbsp;</label>
          <button onClick={this.saveNewStep} className="btn btn-secondary form-control">เพิ่ม</button>
          </div>
        </div>
        <div className="col-12 mb-3">
          <button onClick={this.submitNewRecipe} className="btn btn-success btn-block">
            บันทึกสูครอาหารใหม่
          </button>
        </div>
      </div>
    )
  }
}
