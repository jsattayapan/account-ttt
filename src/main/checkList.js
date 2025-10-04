import React from 'react'
import { Property } from './checkList/property'

import { SubMenuComponent } from './view-props'

export class CheckList extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      currentPage: 'Property',
    }
  }
  changePage = page => {
    this.setState(() => ({currentPage: page }))
  }
  render(){
    const menuDisplays = [
      'Property'
    ]
    return (
      <div className="row">
        <SubMenuComponent name='Assets' currentPage={this.state.currentPage} menuDisplays={menuDisplays} changePage={this.changePage} />
        <div className="col-12">
          {
            this.state.currentPage === 'Property' && <Property />
          }
        </div>
      </div>
    )
  }
}
