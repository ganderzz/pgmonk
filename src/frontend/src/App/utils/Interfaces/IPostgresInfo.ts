export interface IPostgresInfo {
  Datid: number | null;
  Datname: string | null;
  Pid: number;
  Usename: string | null;
  Query: string | null;
  State: string | null;
  Application_Name: string | null;
  Client_Addr: string | null;
  Client_Hostname: string | null;
  Client_Port: number | null;
  Blocked_By: number[];
}
