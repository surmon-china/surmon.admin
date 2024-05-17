/**
 * @desc Page top loading bar with axios
 * @author Surmon <https://github.com/surmon-china>
 */

import React, { useRef } from 'react'
import { onMounted } from 'veact'
import type { AxiosInstance } from 'axios'
import LoadingBar, { IProps, LoadingBarRef } from 'react-top-loading-bar'

export interface AxiosTopLoadingBarProps extends IProps {
  axios: AxiosInstance
}

export const AxiosTopLoadingBar: React.FC<AxiosTopLoadingBarProps> = (props) => {
  const { axios, ...componentProps } = props
  const ref = useRef<LoadingBarRef>(null)

  // https://github.com/klendi/react-top-loading-bar
  // https://gist.github.com/eshaan7/c9d55f809a6c480150815e330f6120f1
  onMounted(() => {
    axios.interceptors.request.use((config) => {
      ref.current?.continuousStart()
      return config
    })

    axios.interceptors.response.use(
      (response) => {
        ref.current?.complete()
        return response
      },
      (error) => {
        ref.current?.complete()
        return Promise.reject(error)
      }
    )
  })

  return <LoadingBar {...componentProps} ref={ref} />
}
