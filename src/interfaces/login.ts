
export interface SuccessLogin {
   message: string,
   user: UserResponse,
   token: string
}
export interface FailedLogin {
   message: string,
   statusMsg: string
}
export interface UserResponse {
   name: string,
   email: string,
   role: string,
}


