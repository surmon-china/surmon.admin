// import React from 'react'
// import { Link } from 'react-router-dom'

// interface StatisticCardProps extends React.PropsWithChildren {
//   loading: boolean
//   title: string
//   suffix?: string
//   value: string | number
//   icon: React.ReactNode
//   extra?: React.ReactNode
// }

// export const StatisticCard: React.FC<StatisticCardProps> = (props) => {
//   getGA({
//     dateRanges: [
//       {
//         startDate: '2020-03-31',
//         endDate: 'today'
//       }
//     ],
//     dimensions: [
//       {
//         name: 'city'
//       }
//     ],
//     metrics: [
//       {
//         name: 'activeUsers'
//       }
//     ]
//   })
//     .then((res) => {
//       console.log('---------------ga', res)
//     })
//     .catch((error) => {
//       console.warn('---------------error', error)
//     })

//   return <div>GA 测试</div>
// }
