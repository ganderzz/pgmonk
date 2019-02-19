export interface ITable {
  table_name: string;
  schema_name: string;
  seq_reads: number | null;
  seq_scan: number | null;
  idx_scan: number | null;
  isx_tup_fetch: number | null;
  inserts: number | null;
  updates: number | null;
  deletes: number | null;
}
