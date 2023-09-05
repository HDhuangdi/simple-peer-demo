import http from "@/http";


export function sendTextMessageBatchAPI(params) {
  return http.post("/api/data_center/tool/sendSms/sendMessage", params, {
    headers: {
      "Content-Type": "application/json",
    },
  });
}