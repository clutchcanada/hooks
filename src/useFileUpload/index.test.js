import useFileUpload from "./index";

//TO-DO: Write more tests for this hook

describe("useFileUpload", () => {
  it('should throw an error if no files are specified', () => {

    const test = () => {
        const myFileUploader = useFileUpload({
            files: null,
        });
    }
    expect(test).toThrowError();
  });

  it('should call setErroredFilesState with the errored file', async () => {
    const files = ['FILE_1'];
    let fileUpload;
    global.testHook(() => {
        fileUpload = useFileUpload({
            files,
            url: "",
            headers: {},
        });
    });
    await fileUpload.handleFileUpload();
    expect(fileUpload.erroredFiles.length).toBe(1);
  });
});