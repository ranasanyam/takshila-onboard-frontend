import { useState, createContext } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import FileUploader from './components/FileUploader';
import StudentsTable from './components/StudentsTable';
import ClassWidget from './components/ClassWidget';
import { Routes, Route, useNavigate } from 'react-router';
import Students from './pages/Students';
import Home from './pages/Home';



export const AppContext = createContext();
function App() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [rows, setRows] = useState([]);
  const [fileSubmitted, setFileSubmitted] = useState(false);
  const [columns, setColumns] = useState([]);
  const [columnMapping, setColumnMapping] = useState({});

  const [dataSubmitted, setDataSubmitted] = useState(false);
  const [classWidgets, setClassWidgets] = useState(null);
  

  const parseCSV = (file) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        setError("");
        validateAndSetData(result.data);
      },
      error: () => setError("Error parsing CSV file.")
    });
  }

  const parseExcel = (file) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
      validateAndSetData(sheetData);
    };
    reader.readAsArrayBuffer(file);
  }
  // with column validation 
  // const validateAndSetData = (data) => {
  //   const requiredColumns = ["Name", "Father Name", "Class", ["Mobile", "Mobile No.", "Mobile Number", "Phone Number"], "Fee", "Transport"]; // aliases for the mobile column
    
  //   // extract the column names from the first object in the data array
  //   const fileColumns = Object.keys(data[0] || []).map((col) => col.trim().toLowerCase());

  //   // normalize the requiredColumns for comparison
  //   const normalizedRequiredColumns = requiredColumns.map((col) => Array.isArray(col) ? col.map((alias) => alias.trim().toLowerCase()) : col.trim().toLowerCase());


  //   const isValid = normalizedRequiredColumns.every((col) => {
  //     if(Array.isArray(col)) {
  //       // for aliases, check if at least one matches
  //       return col.some((alias) => fileColumns.includes(alias));
  //     }
  //     return fileColumns.includes(col);
  //   });
    
  //   if(isValid) {
  //     const normalizedData = data.map((row, index) => {
  //       const normalizedRow = {};
  //       normalizedRow["id"] = index + 1;
  //       for(let col of requiredColumns) {
  //         if(Array.isArray(col)) {
  //           const aliasKey = col.find((alias) => fileColumns.includes(alias.trim().toLowerCase()));
           
  //           if(aliasKey) {
  //             normalizedRow[aliasKey] = row[aliasKey];
  //           }
  //         } else {
  //           normalizedRow[col] = row[col];
  //         }
  //       }
        
  //       return normalizedRow;
  //     });
  //     const gridColumns = Object.keys(data[0]).map((key) => ({
  //       field: key,
  //       headerName: key,
  //       // flex: 1,
  //       width: 150,
  //     }));

  //     setRows(normalizedData);
  //     setColumns(gridColumns);
  //     navigate('/students');
  //     setError("");
  //   } else {
  //     setError(`File does not have the required columns: ${requiredColumns.map((col) => (Array.isArray(col) ? col.join(" or ") : col)).join(", ")}.`);
  //     setRows([]);
  //   }
  // }


  // without column validation
  const validateAndSetData = (data) => {
    const requiredColumns = ["Name", "Father Name", "Class", ["Mobile", "Mobile No.", "Mobile Number", "Phone Number"], "Fee", "Transport"]; // aliases for the mobile column
  
    // Extract the column names from the first object in the data array
    const fileColumns = Object.keys(data[0] || []).map((col) => col.trim());
  
    // Normalize data without any validation
    const normalizedData = data.map((row, index) => {
      const normalizedRow = {};
      normalizedRow["id"] = index + 1;
      for (let col of requiredColumns) {
        if (Array.isArray(col)) {
          // For aliases, find the first matching column
          const aliasKey = col.find((alias) => fileColumns.includes(alias.trim()));
          if (aliasKey) {
            normalizedRow[aliasKey] = row[aliasKey];
          }
        } else {
          if (fileColumns.includes(col)) {
            normalizedRow[col] = row[col];
          }
        }
      }
      return normalizedRow;
    });
  
    // Create columns for the data grid
    const gridColumns = fileColumns.map((key) => ({
      field: key,
      headerName: key,
      width: 150,
    }));
  
    // Update the state
    setRows(normalizedData);
    setColumns(gridColumns);
    navigate('/students');
    setError(""); // Clear any previous errors
  };
  

  const handleFileChange = (file) => {
    setFile(file);
    if(file) {
      const fileType = file.type;

      if(fileType === 'text/csv') {
        parseCSV(file);
      } else if (fileType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
        parseExcel(file);
      } else {
        setError("Invalid file type. Only CSV or Excel files are allowed.");
      }
    }
  }



  return (
    <AppContext.Provider value={{rows, setRows}}>
          <div>
      {/* {!fileSubmitted && (
        <div
        className='min-h-[100vh] flex flex-col justify-center items-center'
          >
          <FileUploader 
            file={file} 
            setFile={setFile} 
            error={error} 
            setError={setError} 
            handleFileChange={handleFileChange}
          />
          
        </div>
      )} */}
      
      {/* {!classWidgets && (fileSubmitted && (
        <StudentsTable 
        columns={columns} 
        setColumns={setColumns} 
        rows={rows} 
        columnMapping={columnMapping} 
        setColumnMapping={setColumnMapping}
        setClassWidgets={setClassWidgets}
        setDataSubmitted={setDataSubmitted}
        setRows={setRows}
        />
      ))}
      {dataSubmitted && (
        classWidgets && (
          <ClassWidget classWidgets={classWidgets} />
        )
      )} */}
      <Routes>
        <Route path='/students' element={<Students columns={columns} setColumns={setColumns} setClassWidgets={setClassWidgets} />} />
        <Route path="/classes-widgets" element={<ClassWidget classWidgets={classWidgets} />} />
        <Route path="/upload" element={<FileUploader file={file} setFile={setFile} error={error} setError={setError} handleFileChange={handleFileChange} />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
    </AppContext.Provider>
  )
}



export default App
