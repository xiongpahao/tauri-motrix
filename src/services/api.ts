import axios, { AxiosInstance } from "axios";

let axiosIns: AxiosInstance = null!;

export const getAxios = async (force: boolean = false) => {
  if (axiosIns && !force) return axiosIns;

  const server = "127.0.0.1:16800";

  axiosIns = axios.create({
    baseURL: `http://${server}`,
    timeout: 15000,
  });
  //   axiosIns.interceptors.response.use((r) => r.data);
  return axiosIns;
};
