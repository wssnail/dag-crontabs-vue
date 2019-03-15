import request from "@/utils/request"

export function getTasks() {
  return request({
    method: "get",
    url:"crontabs/"
  })
}
