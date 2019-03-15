import request from '@/utils/request'

export function getIntervals() {
  return request({
    url: '/intervals/',
    method: 'get',
  })

}
