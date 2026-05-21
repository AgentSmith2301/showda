export const apiRequests_for_Schema = {
    IP: { type: String, required: true },
    URL: { type: String, required: true },
    date: { type: Date, required: true, expires: '6s' }, // 6s
    body: { type: Object, required: true } //TODO  delete body
}

export const schema_For_Sessions = {
    userId: { type: String, required: true },
    deviceId: { type: String, required: true },
    iat: { type: Date, required: true },
    exp: { type: Date, required: true },
    deviceName: { type: String, required: true },
    ip: { type: String, required: true }
}



