import { useState, useRef } from "react";
import "./App.css";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PublishIcon from "@mui/icons-material/Publish";
import CloseIcon from "@mui/icons-material/Close";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as XLSX from "xlsx";
import { useSelector, useDispatch } from "react-redux";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import LoadingSpinner from "./LoadingSpinner";
const Upload = () => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const fileName = useSelector((state) => state.fileName);
  const fileData = useSelector((state) => state.fileData);
  const [Loading, setLoading] = useState(false);
  const [displayData, setDisplay] = useState(false);

  const handleFileChange = (e) => {
    const file = fileInputRef.current.files[0];
    if (file) {
      const fileType = file.name.split(".").pop().toLowerCase();
      if (fileType === "csv" || fileType === "xlsx") {
        const reader = new FileReader();
        reader.readAsBinaryString(e.target.files[0]);
        reader.onload = (e) => {
          const data = e.target.result;
          const workbook = XLSX.read(data, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const parsedData = XLSX.utils.sheet_to_json(sheet);
          dispatch({
            type: "name",
            fileName: file.name,
          });

          dispatch({
            type: "data",
            fileData: parsedData,
          });
          toast.success("File Uploaded Successfully");
        };
      } else {
        toast.error("Please select a CSV or Excel file.");
      }
    }
    fileInputRef.current.value = "";
  };
  const display = () => {
    setDisplay(true);
  };
  const close = () => {
    setDisplay(false);
  };
  const submit = async () => {
    setLoading(true);
    await axios
      .post("https://joshua-zikrabytes-assignment.onrender.com/store-data", {
        fileName,
        dataArray: fileData,
      })
      .then((res) => {
        setLoading(false);
        toast.success(res.data.message);
        dispatch({ type: "clear" });
        if (display) {
          setDisplay(false);
        }
      })
      .catch((err) => {
        setLoading(false);
        toast.error("Server Error");
      });
  };
  return (
    <div>
      <h1>File Upload Task 📂</h1>
      {Loading ? (
        <LoadingSpinner />
      ) : (
        <div className="upload-Container">
          <div className="clear">
            <label htmlFor="file-upload">
              <UploadFileIcon />
              <p>Upload File</p>
            </label>

            {fileName && (
              <button
                onClick={() => {
                  dispatch({ type: "clear" });
                  if (display) {
                    setDisplay(false);
                  }
                  toast.warning("File Deleted");
                }}
              >
                <DeleteIcon />
              </button>
            )}
          </div>

          <input
            ref={fileInputRef}
            className="upload"
            id="file-upload"
            type="file"
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            placeholder="upload File"
            onChange={handleFileChange}
          />
          {fileName && <p>Selected File : {fileName}</p>}

          {fileName && (
            <div className="actions">
              <button onClick={submit}>
                <PublishIcon />
                Submit
              </button>
              {!displayData && (
                <button onClick={display}>
                  <VisibilityIcon />
                  Preview
                </button>
              )}

              {displayData && (
                <button onClick={close}>
                  <CloseIcon />
                  Close
                </button>
              )}
            </div>
          )}

          {displayData && (
            <div className="table-container">
              <div>
                <table className="table">
                  <thead>
                    <tr>
                      {Object.keys(fileData[0]).map((key) => (
                        <th key={key}>{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {fileData.map((row, index) => (
                      <tr key={index}>
                        {Object.values(row).map((value, index) => (
                          <td key={index}>{value}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default Upload;
