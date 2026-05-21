import axios, { type AxiosInstance, type AxiosResponse, type InternalAxiosRequestConfig } from "axios";

export let axiosIntance:AxiosInstance;

const createAxios = (baseURL: string) => {
    axiosIntance = axios.create({baseURL})
}
const setUpinterceptors = () => {
    
    axiosIntance.interceptors.request.use(
        (config:InternalAxiosRequestConfig) => {
            const token = localStorage.getItem("token")
            if(token)
                config.headers.set(`Authorization`, `Bearer ${token}`)
            console.log(`Request made to: ${config.url}`)
            return config;
        },
        (error) => {
            return Promise.reject(error)
        }
    )
    axiosIntance.interceptors.response.use( 
        
        (response: AxiosResponse) => {
            console.log(`Response from: ${response.config.url}`, {
                data: response.data,
                status: response.status,
            })
            return response
        }, (error) => {
            if(error.response){
                console.error( `Error from: ${error.response.config.url}`)
            }{
                console.error(`Error: ${error.message}`)
            }
            return Promise.reject(error)
        }
    )
} 


export const initAxios = () => {
    createAxios('http://localhost:8002');
    setUpinterceptors()
    return axiosIntance
}