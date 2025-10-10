export interface CheckOutI {
  status: string
  session: Session
  message: string
}

export interface Session {
  url: string
  success_url: string
  cancel_url: string
}
