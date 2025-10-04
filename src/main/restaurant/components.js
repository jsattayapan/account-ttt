import React from 'react'

export const TitleBar = props => {
  return (
    <div className="col-12">
      <div className="row">
        <div className="col-8">
          <h3>{props.title}</h3>
        </div>
      </div>
    </div>
  )
}
