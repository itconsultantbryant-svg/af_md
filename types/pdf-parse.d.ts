/// <reference types="pdf-parse" />

declare module "pdf-parse" {
  interface PDFData {
    numpages: number;
    text: string;
  }
  function pdf(buffer: Buffer): Promise<PDFData>;
  export default pdf;
}
