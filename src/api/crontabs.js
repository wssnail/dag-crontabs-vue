import request from '@/utils/request'

export function Crontabs(method,data = null) {

  return request({
    url: '/crontabs/',
    method: method,
    data:data
  })
}
