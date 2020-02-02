import { OptionEnum } from '../model'

export function showTypeConstant() {
  return [
    new OptionEnum('采集','collect'),
    new OptionEnum('批量','tool')
  ]
}