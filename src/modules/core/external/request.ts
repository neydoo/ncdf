
import axios, { AxiosRequestConfig, Method} from 'axios';


export default class ExternalService {
  protected token;
  /**
   * @todo change request to axios
   * @todo refactor and remove this method.
   *
   * @param method
   * @param url
   * @param data
   */
  public sendRequest = async (method: Method, url: string, data: any = {}): Promise<any> => {
    const options: AxiosRequestConfig = {
      url,
      method,
      data,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      },
    };

    const response =  await axios(options);

    return response.data;
  }

  public sendNonTokenRequests = async (method: Method, url: string, data: any = {}): Promise<any> => {
    const options = {
      url,
      method,
      data,
      headers: {
        'Content-Type': 'application/json'
      },
    };
    const response =  await axios(options);

    return response.data;
  }
}