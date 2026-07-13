declare module "pdf-parse" {
  type PdfParseResult = {
    text: string;
  };

  function pdfParse(buffer: Buffer): Promise<PdfParseResult>;

  export default pdfParse;
}
