import * as _ from 'lodash';
const getValueByPath = (obj: any, path: any, valueDefault = '') => {
  const value = path.split('.').reduce((o, i) => o ? o[i] : null, obj);
  return _.isEmpty(value) ? valueDefault : value;
}

export {
  getValueByPath
}