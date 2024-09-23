import { useMutation } from "@apollo/react-hooks";
import Papa from "papaparse";
import React, { useCallback, useContext, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button, Icon, Loader } from "semantic-ui-react";
import { ClientContext } from "../../context/clients";
import { ADD_NEW_CLIENT } from "../clients/queries";

function Uploadzone() {
  const [parsedData, setParsedData] = useState([]);
  const [responseErrors, setResponseErrors] = useState([]);
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const context = useContext(ClientContext);

  const [uploadClients] = useCallback(
    useMutation(ADD_NEW_CLIENT, {
      update(_, result) {
        context.registerClient(result.data);
      },
      onError(err) {
        try {
          if (err.graphQLErrors) {
            setResponseErrors(err.graphQLErrors[0].message);
          }

          if (err.networkError !== null && err.networkError !== "undefined") {
            setResponseErrors(err.networkError.result.errors[0]);
          } else if (
            err.graphQLErrors !== null &&
            err.networkError !== "undefined"
          ) {
            setResponseErrors(err.graphQLErrors.result.errors[0]);
          }
        } catch (e) {
          console.error("upload error", e);
        }
      },
    })
  );

  const parseFile = (file) => {
    Papa.parse(file, {
      header: true,
      complete: (result) => {
        setParsedData(result.data);
      },
    });
  };

  // slow down the data entry by one second for each
  const sleep = (time) => {
    return new Promise((resolve) => setTimeout(resolve, time));
  };

  const batchUpload = async (data) => {
    setLoading(true);
    for (let i = 0; i < data.length; i++) {
      await sleep(1000);
      uploadClients({ variables: { ...data[i] } });
      if (i === data.length - 1) {
        setDone(true);
        setLoading(false);
      }
    }
  };

  const onSubmitBulkData = (event) => {
    event.preventDefault();
    if (parsedData.length) {
      batchUpload(parsedData);
    } else {
      setError("Empty file uploaded");
    }
  };

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length) {
      parseFile(acceptedFiles[0]);
      setFileName(acceptedFiles[0]?.name);
    }
  }, []);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({ onDrop, accept: "text/csv" });

  if (done)
    return (
      <>
        <h3>
          <Icon name="check circle outline" color="olive" />
          All done
        </h3>
      </>
    );
  return (
    <>
      {loading && <Loader active inline />}
      {error ||
        (responseErrors.length > 0 && (
          <p style={{ color: "red" }}>
            {error || responseErrors }
          </p>
        ))}
      <div
        {...getRootProps({
          className: `dropzone ${isDragAccept && "dropzoneAccept"} ${
            isDragReject && "dropzoneReject"
          }`,
        })}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag & drop some files here, or click to select files</p>
        )}
      </div>
      <br />
      {fileName && <p style={{ color: "#4ec7f4" }}>File: {fileName}</p>}
      <br />
      <Button
        primary
        type="submit"
        disabled={loading}
        onClick={onSubmitBulkData}
      >
        <Icon name="upload" />
        {loading ? "Uploading" : "Upload"}
      </Button>
    </>
  );
}

export default Uploadzone;
