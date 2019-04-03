import request from "@/utils/request"

export function Tasks(method,data = null) {
  if(method === 'get'){
    return request({
      method: method,
      url:"tasks/",
      params:data
    })
  }else{
    return request({
      method: method,
      url:"tasks/",
      data:data
    })
  }

}

// export function postTasks() {
//   return request({
//     method: "post",
//     url:"crontabs/"
//   })
// }
