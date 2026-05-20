export const apiRequests_for_Schema = {
    IP: { type: String, required: true },
    URL: { type: String, required: true },
    date: { type: Date, required: true, expires: '6s' }, // 6s
    body: { type: Object, required: true } //TODO  delete body
}



