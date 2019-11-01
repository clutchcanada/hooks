import { useState } from 'react';
import { post } from 'axios';
import { asyncQueue, throwError } from '@clutch/helpers';

const useFileUpload = ({
    concurrentCount = 4,
    files,
    url,
    headers,
} = {}) => {
    !files && throwError("No files are specified in useFileUpload");
    const [filesUploadedState, setFilesUploadedState] = useState([]);
    const [erroredFilesState, setErroredFilesState] = useState([]);

    const handleOnFileQueueResult = ({ result }) => {
        setFilesUploadedState(prevState => [...prevState, result]);
    };

    const handleOnFileQueueError = ({ index, files }) => {
        setErroredFilesState(prevState => [
          ...prevState,
          { fileName: files[index] },
        ]);
    };

    const handleFileUpload = async () => {    
        const listOfFileUploadCalls = files.map(file => {
          const formData = new FormData();
          formData.append('file', file);
          return () => post(url, formData, { headers });
        });
    
        const fileUploadQueue = asyncQueue({
          asyncFunctionArray: listOfFileUploadCalls,
          concurrentCount,
        });
    
        fileUploadQueue.onResult(handleOnFileQueueResult);
        fileUploadQueue.onError(({ index }) =>
          handleOnFileQueueError({ index, files }),
        );
        return fileUploadQueue.process();
    };

    return {
        handleFileUpload,
        erroredFiles: erroredFilesState,
        uploadedFiles: filesUploadedState,
    };
};

export default useFileUpload;
