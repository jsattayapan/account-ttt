import React from 'react'
import { Vehicle } from './assets/vehicle'

import { SubMenuComponent } from './view-props'

export class Assets extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      currentPage: 'ยานพาหนะ',
    }
  }
  changePage = page => {
    this.setState(() => ({currentPage: page }))
  }
  render(){
    const menuDisplays = [
      'ยานพาหนะ'
    ]
    return (
      <div className="row">
        <SubMenuComponent name='Assets' currentPage={this.state.currentPage} menuDisplays={menuDisplays} changePage={this.changePage} />
        <div className="col-12">
          {
            this.state.currentPage === 'ยานพาหนะ' && <Vehicle />
          }
        </div>
      </div>
    )
  }
}
