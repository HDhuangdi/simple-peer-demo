import http from "@/http";

export function sendTextMessageBatchAPI(params) {
  return http.post(
    "https://jsczh.hzcjtz.com:8006/data_center/tool/sendSms/sendMessage",
    params,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}

export function getMessageContentAPI() {
  return http.get("/api/get");
}
