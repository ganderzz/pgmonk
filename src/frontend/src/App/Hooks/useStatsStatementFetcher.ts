import { toast } from "react-toastify";
import { useFetcher } from "./useFetcher";

export const useStatsStatementFetcher = () =>
  useFetcher(HTTP =>
    HTTP.getStatsStatement().catch(response => {
      toast.error(`${response}`);

      return Promise.reject(response);
    })
  );
