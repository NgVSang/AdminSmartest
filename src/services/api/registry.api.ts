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

export const RegistryApi = {
  getRegistriesByDate,
};
