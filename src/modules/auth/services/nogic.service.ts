import ExternalService from "@ncdf/core/external/request";
import { Injectable } from "@nestjs/common";
import axios, { AxiosRequestConfig, Method} from 'axios';
import { getValueByPath } from "modules/utils/function";
import configuration from '../../config/app.config';

@Injectable()
export default class NogicService extends ExternalService {
  async postChangePassword(req, res) {
    return await axios({
        method: 'post',
        data: { password: req.body.password, password_confirmation: req.body.password_confirmation },
        url: `${configuration().nogic.url}auth/change-password`,
        headers: { 'Authorization': req.nogic_token }
    }).then((response: any) => {
        if (response.error) throw new Error(response.error.message);
        return response.data.message;
    }).catch(error => {
        throw new Error(error.response.data.error.message);
    });
  }

  async userCompany(user) {
    let userGroup  =  user.modules[0].name;
    console.log(`${configuration().nogic.url}users/${user.id}/${userGroup === 'Operator' ? 'operators' : 'service-companies'}`);
    return await axios({
        method: 'get',
        url: `${configuration().nogic.url}users/${user.id}/${userGroup === 'Operator' ? 'operators' : 'service-companies'}`,
        headers: { 'Authorization': user.token }
    }).then((response: any) => {
        if (response.error) throw new Error(response.error.message);
        let companies = response.data.data;
        console.log(companies);
        if (Array.isArray(companies) && companies.length > 0) {
            let company = companies[0];
            console.log(company);
            let companyTypeId = userGroup === 'Operator' ? company.operator_type : 6;
            return {
                name: company.org_name,
                email: company.email,
                phone: company.tel,
                address: company.address,
                nogic_unique_id: company.nogic_unique_id,
                nogic_id: company.id,
                company_type_id: companyTypeId,
                data: JSON.stringify(company)
            }
        } else {
            throw new Error();
        }
    }).catch(error => {
        throw new Error(getValueByPath(error, 'response.data.error.message', error));
    });
  }

  async login(req) {
    return await axios({
        method: 'post',
        data: { email: req.body.email, password: req.body.password },
        url: `${configuration().nogic.url}auth/login`
    }).then(async(response: any) => {
        if (response.error) throw new Error(response.error.message);

        const nogicUser = response.data.data;

        this._validateNogicUser(nogicUser);

        let userGroup = nogicUser.modules[0].name === 'SystemAdmin' ? 'admin' : 'company';

        let company = null;

        try {
            if (userGroup === 'company') company = await this.userCompany(nogicUser);
        } catch (e) {}

        const user = {
            email: nogicUser.email,
            first_name: nogicUser.first_name,
            last_name: nogicUser.last_name,
            nogic_id: nogicUser.id,
            nogic_unique_id: nogicUser.nogic_unique_id,
            name: nogicUser.name,
            group: userGroup,
            last_login: new Date(),
            is_active: nogicUser.activated,
            token: nogicUser.token,
            password: req.body.password,
            company
        };

        return user;

    }).catch(error => {
        throw new Error(getValueByPath(error, 'response.data.error.message', error));
    });
  }

  _validateNogicUser(nogicUser) {

    let error = '';

    const nogicUserModule = nogicUser.modules[0];

    if (nogicUserModule === "Individual") error = 'Ooops! You do not have access to this application.';

    if (!nogicUser.activated) error = 'Ooops! You account has not been activated.';

    if (nogicUser.terms_accepted !== 1) error = 'Ooops! You have not accepted the term and condition of NOGIC JQS.';

    if (nogicUserModule.name === 'SystemAdmin' && nogicUser.allow_ncdf_access !== 1) error = 'Ooops! You have not been approved to access this application.';

    if (error.length > 0) throw new Error(error);
  }
}