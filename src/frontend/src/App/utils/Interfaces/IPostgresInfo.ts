export interface IPostgresInfo {
  datid: number | null;
  datname: string | null;
  pid: number;
  username: string | null;
  query: string | null;
  state: string | null;
  application_name: string | null;
  client_address: string | null;
  client_hostname: string | null;
  client_port: number | null;
  blocked_by: number[];
}
