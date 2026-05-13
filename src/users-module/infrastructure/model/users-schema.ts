// export const  usersForSchema = {
//     id: {type: String, required: true,unique: true},
//     login: {type: String, required: true},
//     email: {type: String, required: true},
//     createdAt: {type: Date, required: true}
// }

export const  usersForSchema = {
    login: {type: String, required: true},
    email: {type: String, required: true},
    hash: {type: String, required: true},
    salt: {type: String, required: true},
    createdAt: {type: Date, required: true},
    emailConfirmation: {   
        confirmationCode: {type: String, required: true},
        expirationDate: {type: Date}, 
        isConfirmed: {type: Boolean, default: false}
    }
}

