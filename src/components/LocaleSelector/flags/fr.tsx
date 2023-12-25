import React from 'react'

const FlagFr = ({ ...props }: React.ComponentProps<'svg'>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      viewBox="0 0 512 512"
      xmlSpace="preserve"
      {...props}
    >
      <circle style={{ fill: '#F0F0F0' }} cx={256} cy={256} r={256} />
      <path
        style={{ fill: '#D80027' }}
        d="M512,256c0-110.071-69.472-203.906-166.957-240.077v480.155C442.528,459.906,512,366.071,512,256z"
      />
      <path
        style={{ fill: '#0052B4' }}
        d="M0,256c0,110.071,69.473,203.906,166.957,240.077V15.923C69.473,52.094,0,145.929,0,256z"
      />
      <g />
      <g />
      <g />
      <g />
      <g />
      <g />
      <g />
      <g />
      <g />
      <g />
      <g />
      <g />
      <g />
      <g />
      <g />
    </svg>
  )
}

export default FlagFr
