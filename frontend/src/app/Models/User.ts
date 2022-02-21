//align the User type with the server
export interface User {
  _id: string;
  jwt: string;
  firstName: string;
  lastName: string;
  //Check it with Hieu
  // win: number;
  // loss: number;
  message: string;
}
