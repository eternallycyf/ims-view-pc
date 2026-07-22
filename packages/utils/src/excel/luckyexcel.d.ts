declare module '@zwight/luckyexcel' {
  type TransformSuccess<T> = (data: T) => void | Promise<void>;
  type TransformError = (error: unknown) => void;

  interface TransformUniverToExcelOptions {
    snapshot: Record<string, unknown>;
    fileName?: string;
    getBuffer?: boolean;
    success?: (buffer: ArrayBuffer | Uint8Array | Buffer) => void;
    error?: (error: Error) => void;
  }

  interface LuckyExcelStatic {
    transformExcelToUniver: (
      file: File,
      success: TransformSuccess<Record<string, unknown>>,
      error?: TransformError,
    ) => void;
    transformUniverToExcel: (options: TransformUniverToExcelOptions) => void;
  }

  const LuckyExcel: LuckyExcelStatic;
  export default LuckyExcel;
}
