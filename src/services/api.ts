import axios, { AxiosInstance } from "axios";

let axiosIns: AxiosInstance = null!;

export const getAxios = async (force: boolean = false) => {
  if (axiosIns && !force) return axiosIns;

  let server = "127.0.0.1:16800";

  //   try {
  //     const info = await getClashInfo();

  //     if (info?.server) {
  //       server = info.server;
  //     }
  //   } catch {}

  axiosIns = axios.create({
    baseURL: `http://${server}`,
    timeout: 15000,
  });
  //   axiosIns.interceptors.response.use((r) => r.data);
  return axiosIns;
};
