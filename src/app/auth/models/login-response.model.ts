export interface ILoginResponseModel {
    tokenType:    string;
    accessToken:  string;
    expiresIn:    number;
    refreshToken: string;
}
