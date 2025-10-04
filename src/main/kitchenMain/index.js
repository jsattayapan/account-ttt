import React from 'react'

import Recipe from './recipes'

export default class KitchenMain extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      currentPage: 'สูตรอาหาร'
    }
  }
  linkClicked = (page) => {
    this.setState(() => ({currentPage:page}))
  }
  render(){
    return(
      <div className="row">
        <div className="col-12">
          <div className="row">
            <MenuItem currentPage={this.state.currentPage} onClick={() => this.linkClicked('สูตรอาหาร')} name="สูตรอาหาร" />
          </div>
        </div>
        <div className="col-12">
          {this.state.currentPage === 'สูตรอาหาร' && <Recipe />}
        </div>
      </div>
    )
  }
}

function MenuItem (props) {
  console.log(props.currentPage, props.name);
  return(
    <div onClick={props.onClick} className={`align-center ${props.currentPage === props.name ? 'menu-item-select' : 'menu-item'}`}>
    {props.name}
    </div>
  )
}
