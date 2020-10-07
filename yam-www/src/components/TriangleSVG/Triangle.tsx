import React from 'react'


const Triangle: React.FC = () => {
  return (
    <div
      className="svg-container col-12 col-lg-6 mt-6 mt-lg-0 mb-3 mb-lg-0 pl-lg-7 pb-lg-3 pos-abs-lg-vertical-center pos-right hero__image">
      <svg width="480" height="305" viewBox="0 0 960 500" preserveAspectRatio="xMidYMid" className="svg-content">
        <defs>
          <clipPath id="clip-upper">
            <rect id="rect-clip-upper" width="960" height="305" x="-480" y="-305"/>
          </clipPath>
          <clipPath id="clip-lower">
            <rect id="rect-clip-lower" width="960" height="195" x="-480" y="0"/>
          </clipPath>
        </defs>
        <g clipPath="url(#clip-upper)" transform="translate(480,305)"/>
        <g clipPath="url(#clip-lower)" transform="translate(480,305)"/>
      </svg>
    </div>
  )
}


export default Triangle