import request from "@/utils/request"

export function Tasks(method,data = null) {
  return request({
    method: method,
    url:"tasks/",
    data:data
  })
}

// export function postTasks() {
//   return request({
//     method: "post",
//     url:"crontabs/"
//   })
// }
