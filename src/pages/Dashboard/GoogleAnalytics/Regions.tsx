import React from 'react'
import { useLocale } from '@/contexts/Locale'
import { countryCodeToEmoji, countryCodeToFullName } from '@/transforms/country'
import { GoogleAnalyticsTreeList } from './common/TreeList'
import { ReportRowItem } from './common/helper'

export interface GoogleAnalyticsRegionsProps {
  rows: ReportRowItem[]
}

export const GoogleAnalyticsRegions: React.FC<GoogleAnalyticsRegionsProps> = (props) => {
  const { language } = useLocale()
  return (
    <GoogleAnalyticsTreeList
      rows={props.rows}
      defaultExpanded={false}
      limit={8}
      strongLabel
      labelPrefix={(item) => countryCodeToEmoji(item.name)}
      labelSuffix={(item) => countryCodeToFullName(item.name, language) ?? ''}
    />
  )
}
