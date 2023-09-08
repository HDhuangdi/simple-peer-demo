import http from "@/http";

export function sendTextMessageBatchAPI(params) {
  return http.post("/ctapi/data_center/tool/sendSms/sendMessage", params, {
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export function getTextMessageContentAPI() {
  return http.get("/api/get");
}
