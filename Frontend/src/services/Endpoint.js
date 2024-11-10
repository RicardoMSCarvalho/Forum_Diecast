import axios from "axios";
export const BaseUrl = "http://localhost:3000";
const instance = axios.create({
  baseURL: BaseUrl,
  withCredentials: true,
});

export const get = (url, params) => instance.get(url, { params });
export const post = (url, data) => instance.post(url, data);
export const put = (url, data) => instance.put(url, data);
export const remove = (url) => instance.delete(url);
export const patch = (url, data) => instance.patch(url, data);
