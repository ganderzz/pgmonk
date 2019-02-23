import { toast } from "react-toastify";
import { useFetcher } from "./useFetcher";

export const usePostgresInfoFetcher = () =>
  useFetcher(HTTP =>
    HTTP.getPostgresInfo({ backend_type: "client backend" }).catch(response => {
      toast.error(`${response}`);

      return Promise.reject(response);
    })
  );
