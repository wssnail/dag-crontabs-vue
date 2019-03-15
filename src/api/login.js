import request from '@/utils/request'

export function login(username, password) {
  var loginReturn = request({
    url: '/api-token-auth/',
    method: 'post',
    data: {
      username,
      password
    }
  });
  // console.log(loginReturn);
  return loginReturn
}

export function getInfo(token) {
  // console.log(token);
  return request({
    url: '/getuser/',
    method: 'get',
    // params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
