import axios from "axios";
import { vendorKeys } from "../vendorKeys";

export function apiWithVendor(vendorId: string) {
  const key = vendorKeys[vendorId];
  if (!key) throw new Error(`No API key for vendor ${vendorId}`);

  return axios.create({
    baseURL: import.meta.env.VITE_API_BASE,      // http://localhost:8080
    headers: {
      "Content-Type": "application/json",
      "X-Api-Key":   key,
      "X-Vendor-Id": vendorId
    }
  });
}
