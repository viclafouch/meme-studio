import React from 'react'

const Sad = ({ ...props }: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg viewBox="0 0 100 100" {...props}>
      <g>
        <circle
          strokeMiterlimit="10"
          strokeWidth="6"
          stroke="#000"
          fill="#e0e0e0"
          r="40"
          cy="50"
          cx="50"
        />
        <circle r="7.5" cy="38.4" cx="33.5" />
        <circle r="7.5" cy="38.4" cx="66.5" />
        <path
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeWidth="5"
          stroke="#000"
          fill="none"
          d="M31.9 71.6c2.6-7.6 9.7-13 18.1-13s15.6 5.4 18.1 13"
        />
      </g>
    </svg>
  )
}

export default Sad
