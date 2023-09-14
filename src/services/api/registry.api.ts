import instance from './axios';

const ENDPOINTS = {
  LISTREGISTERBYDATE: '/employee/registry',
  REGISTERDETAIL: '/employee/registry/info',
  REGISTRYLISTTYPE: '/employee/registry/list',
  CONFIRMPAYSUCCESS: '/employee/registry/pay',
  COMPLETEREGISTRY: '/employee/registry/complete',
  LISTREGISTERSDATE: '/employee/registry/list-registries-date',
};

const getRegistriesByDate = (date: string) => {
  return instance.get(ENDPOINTS.LISTREGISTERBYDATE, {
    params: {
      date: date,
    },
  });
};

const getListDate = () => {
  return instance.get(ENDPOINTS.LISTREGISTERSDATE);
};

const getRegistryDetail = (regisId: number) => {
  return instance.get(ENDPOINTS.REGISTERDETAIL, {
    params: {
      id: regisId,
    },
  });
};

const getRegistriesByType = (type: number, date: string) => {
  return instance.get(ENDPOINTS.REGISTRYLISTTYPE, {
    params: {
      date: date,
      type: type,
    },
  });
};

const handlePayment = (data: any) => {
  return instance.put(ENDPOINTS.CONFIRMPAYSUCCESS, data);
};

const handleComplete = (data: any) => {
  return instance.put(ENDPOINTS.COMPLETEREGISTRY, data);
};

export const RegistryApi = {
  getRegistriesByDate,
  getListDate,
  getRegistryDetail,
  getRegistriesByType,
  handlePayment,
  handleComplete,
};
