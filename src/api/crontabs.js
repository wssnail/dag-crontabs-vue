import request from '@/utils/request'

export function Crontabs(method,data = null) {

  switch(method)
  {
    case 'get':
      return request({
        url: '/crontabs/',
        method: 'get',
        params:data
      });
      break;
    case 'post':
      return request({
        url: '/crontabs/',
        method: 'post',
        data:data
      });
      break;

  }


}
