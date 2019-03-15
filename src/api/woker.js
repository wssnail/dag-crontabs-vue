import request from '@/utils/request'

export function getWoker() {
  return request({
    url: '/celeryworker/',
    method: 'get',
  })
}
