import axios from "axios";
import { API_URL } from "@/app/context/constants";

export const axisoClient = axios.create({
    baseURL: API_URL,
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
});
