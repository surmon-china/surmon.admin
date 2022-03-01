/**
 * @desc IP location
 * @author Surmon <https://github.com/surmon-china>
 */

import React from 'react'
import { IPLocation as IPLocationType } from '@/constants/general'
import { countryCodeToEmoji } from '@/transforms/emoji'
import { Placeholder, PlaceholderProps } from '../Placeholder'
import styles from './style.module.less'

export interface IPLocationProps {
  data?: IPLocationType | null
  fullname?: boolean
  className?: string
  placeholder?: PlaceholderProps['placeholder']
}

export const IPLocation: React.FC<IPLocationProps> = (props) => {
  return (
    <Placeholder data={props.data} placeholder={props.placeholder}>
      {(location) => {
        const texts = props.fullname
          ? [location.country, location.region, location.city]
          : [location.country_code || location.country, location.city]

        const emoji = location.country_code && countryCodeToEmoji(location.country_code)

        return (
          <span className={props.className}>
            {emoji ? <span className={styles.emoji}>{emoji}</span> : null}
            {texts.filter(Boolean).join(' · ')}
          </span>
        )
      }}
    </Placeholder>
  )
}
