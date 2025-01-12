import "primereact/resources/themes/lara-light-cyan/theme.css";

import {  useEffect, useRef, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from "primereact/dropdown";
import { Box, Button, MenuItem, Modal, TextField, Select, InputLabel, Snackbar } from "@mui/material";
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { FilterMatchMode } from 'primereact/api';
import { useNavigate } from "react-router";

const StudentsTable = ({ rows, setRows, columns, setColumns, setClassWidgets }) => {
  const navigate = useNavigate();
  const initialHeaderNames = useRef({});
    useEffect(() => {
    columns.forEach((col) => {
      initialHeaderNames.current[col.field] = col.headerName;
    });
  }, []);
  const [filters, setFilters] = useState({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      "Name": { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      'Father Name': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      "Class": { value: null, matchMode: FilterMatchMode.IN },
      "Mobile Number": { value: null, matchMode: FilterMatchMode.EQUALS },
      "Fee": { value: null, matchMode: FilterMatchMode.EQUALS },
      "Transport": { value: null, matchMode: FilterMatchMode.EQUALS },
  });
  
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [bulkEdit, setBulkEdit] = useState(false);
  const [showBulkEdit, setShowBulkEdit] = useState(false);
  const [editColumnName, setEditColumnName] = useState('');
  const [newColumnValue, setNewColumnValue] = useState(null);
  const [showNewColumn, setShowNewColumn] = useState(false);
  const [newColumnName, setNewColumnName] = useState("");
  const [dataUploadedSuccessfully, setDataUploadedSuccessfully] = useState(false);
  const [uploadedRows, setUploadedRows] = useState([]);
  const [showAll, setShowAll] = useState(true);
  const [originalData] = useState(rows);

  const [showDropdown, setShowDropdown] = useState(null); // Track the column being edited
  const [databaseColumns] = useState([
    "Name",
    "Father Name",
    "Class",
    "Mobile Number",
    "Fee",
    "Transport",
  ]);



  const paginatorLeft = <Button type="button" icon="pi pi-refresh" text />;
    const paginatorRight = <Button type="button" icon="pi pi-download" text />;


  const footer = `In total there are ${rows ? rows.length : 0} students in the uploaded file.`;

  // const onGlobalFilterChange = (e) => {
  //   const value = e.target.value;
  //   let _filters = { ...filters };

  //   _filters['global'].value = value;

  //   setFilters(_filters);
  //   setGlobalFilterValue(value);
  // };

  

  const addColumnHandler = () => {
    setShowNewColumn(false);
    setColumns([...columns, { field: newColumnName, headerName: newColumnName, width: '150'}]);
  }

  const toggleRows = () => {
    console.log('uploaded', uploadedRows);
    if(showAll) {
      setRows(uploadedRows);
    } else {
      setRows(originalData);
    }
    setShowAll(!showAll);
    
  }

  const renderHeader = () => {
    return (
      <div className="flex justify-end gap-5 items-center">
          <div className="bg-[#0E91A0] text-white px-3 py-1 rounded-md cursor-pointer" onClick={() => setShowNewColumn(true)}>New</div>
          {bulkEdit && (<div className="bg-[#0E91A0] text-white px-3 py-1 rounded-md cursor-pointer" onClick={() => setShowBulkEdit(true)}>Edit</div>)}
          <div className="text-white bg-[#0E91A0] text-center w-24 px-3 py-1 rounded-md cursor-pointer" onClick={toggleRows}>{showAll ? 'Uploaded' : 'All'}</div>
          {/* <IconField iconPosition="left">
              <InputIcon className="pi pi-search" />
              <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
          </IconField> */}
      </div>
    );
  };

  const header = renderHeader();

  const cellEditor = (options) => {
    if (options.field === 'price') return priceEditor(options);
    else return textEditor(options);
  };

  const textEditor = (options) => {
      return <InputText type="text" value={options.value} className="border-none shadow-none bg-transparent" onChange={(e) => options.editorCallback(e.target.value)} onKeyDown={(e) => e.stopPropagation()} />;
  };
  const onCellEditComplete = (e) => {
    let { rowData, newValue, field, originalEvent: event } = e;

    switch (field) {
        case 'quantity':
        case 'price':
            if (isPositiveInteger(newValue)) rowData[field] = newValue;
            else event.preventDefault();
            break;

        default:
            if (newValue?.trim()?.length > 0) rowData[field] = newValue;
            else event.preventDefault();
            break;
    }
  };

  const handleSubmit = () => {
      const selectedRows = selectedStudents.length > 0 ? selectedStudents : rows;
      const groupedByClass = selectedRows.reduce((acc, student) => {
        const className = student["Class"];
        if(!acc[className]) acc[className] = [];
        acc[className].push(student);
        return acc;
      }, {});
      setClassWidgets(groupedByClass);
      navigate('/classes-widgets')
    
  }
  const dataUploadHandler = () => {
    const selectedRows = selectedStudents.length > 0 ? selectedStudents : rows;
    const groupedByClass = selectedRows.reduce((acc, student) => {
      const className = student["Class"];
      if(!acc[className]) acc[className] = [];
      acc[className].push(student);
      return acc;
    }, {});
    setUploadedRows(selectedStudents);
    setClassWidgets(groupedByClass);
    // navigate('/classes-widgets')
    setDataUploadedSuccessfully(true);
    setSelectedStudents([]);
    console.log(groupedByClass);

  
}
  const editColumnValueHandler = () => {
    
    setRows((prevRows) =>
      prevRows.map((row) =>
        selectedStudents.some((selected) => selected.id === row.id)
          ? { ...row, [editColumnName]: newColumnValue } // Update the column value for selected rows
          : row // Keep the row unchanged if not selected
      )
    );
    setSelectedStudents((prevSelected) =>
      prevSelected.map((selected) =>
        selectedStudents.some((row) => row.id === selected.id)
          ? { ...selected, [editColumnName]: newColumnValue } // Update the column value for selected rows
          : selected // Keep the row unchanged if not updated
      )
    );

    setShowBulkEdit(false);
  }

  const updateColumnHeader = (field, newHeader) => {
    const isDuplicate = columns.some((col) => col.headerName === newHeader);

    if(isDuplicate) {
      alert(`The column name ${newHeader} already exists. Please select a different name.`);
      return;
    }
    setColumns((prevColumns) => 
      prevColumns.map((col) => 
        col.field === field ? { ...col, headerName: newHeader, field: newHeader } : col
      )
    );
    const updatedRows = rows.map((row) => {
      if(field in row) {
        const { [field]: value, ...rest } = row;
        return { ...rest, [newHeader]: value};
      }
      return row;
    });
    setRows(updatedRows);
    setShowDropdown(null);
  }
  const headerTemplate = (col) => {

    return (
      <div
        style={{ cursor: "pointer", position: "relative" }}
        onClick={() => setShowDropdown(col.field)}
      >
        {col.headerName}
        {showDropdown === col.field && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              zIndex: 1000,
              background: "white",
              border: "1px solid #ddd",
              borderRadius: "4px",
              padding: "5px",
            }}
          >
            <Dropdown
              value={col.headerName}
              options={databaseColumns.map((dbCol) => ({
                label: dbCol,
                value: dbCol,
              }))}
              onChange={(e) => updateColumnHeader(col.field, e.value)}
              placeholder="Select a column"
              style={{ width: "150px" }}
            />
          </div>
         )} 
      </div>
    );
  };
  return (
      <div>
      <div className="card">

        <DataTable 
        header={header} 
        footer={footer} 
        showGridlines 
        stripedRows 
        value={rows} 
        tableStyle={{ minWidth: '50rem' }} 
        cellSelection
        selectionMode="checkbox"
        dragSelection
        editMode="cell"
        selection={selectedStudents}
        onSelectionChange={(e) => {

          if(e.value.length > 1) {
            setBulkEdit(true);
          } else {
            setBulkEdit(false);
          }
          setSelectedStudents(e.value);
        }}
        
        dataKey="id"
        sortMode='multiple'
        removableSort
        // filters={filters}
        filterDisplay='row'
        globalFilterFields={["Name", "Father Name", "Class", "Mobile Number"]}
        emptyMessage="No students found"
        paginator
        rows={10}
        rowsPerPageOptions={[10, 25, 50, 100]}
        paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
        currentPageReportTemplate='{first} to {last} of {totalRecords}' 
        paginatorLeft={paginatorLeft}
        paginatorRight={paginatorRight}
        >
          <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
            {columns.map((col, index) => (
              <Column 
              filter
              filterPlaceholder={`Search By ${col.headerName}`} 
              sortable 
              key={col.field} 
              field={col.field} 
              // header={col.headerName}
              header={headerTemplate(col)}
              editor={(options) => cellEditor(options)} 
              onCellEditComplete={onCellEditComplete} 
              />
            ))}
        </DataTable>
        </div>
      {/* <div className="flex justify-end m-8">
        <Button onClick={handleSubmit} variant="outlined" size="large">Submit</Button>
      </div> */}
      <div className="flex justify-end m-8">
        <Button onClick={dataUploadHandler} variant="outlined" size="large">Upload</Button>
      </div>
      <Modal
      open={showBulkEdit}
      onClose={() => setShowBulkEdit(false)}

      >
        <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor:'lightgray',
          boxShadow: 24,
          p: 4
        }}
        >
                    <Box
          sx={{
            display: 'flex',
            alignItems: 'center', 
            justifyContent: 'space-between',
            marginBottom: '2rem'
          }}
          >
          <InputLabel id="new-column">Column Name</InputLabel>
          <Select 
          size="small"
          sx={{ width: '100%'}}
          labelId="new-column"
          id="new-column"
          value={editColumnName} 
          onChange={(e) => setEditColumnName(e.target.value)}>
            {databaseColumns.map((dbCol) => (
              <MenuItem key={dbCol} value={dbCol}>{dbCol}</MenuItem>
            ))}
          </Select>
          </Box>
          {/* <TextField 
          sx={{
            width:'100%',
            marginBottom: '2rem'
          }}
          id="column-name" 
          label="Column Name" 
          variant="outlined" 
          value={editColumnName}  
          onChange={(e) => setEditColumnName(e.target.value)}
          /> */}
          <TextField 
          sx={{
            width: '100%',
            marginBottom: '2rem'
          }}
          id="column-value"
          label="New Value"
          variant="outlined"
          value={newColumnValue}
          onChange={(e) => setNewColumnValue(e.target.value)}
          />
          <div className="flex justify-between">
          <Button variant="contained" color="secondary" onClick={() => setShowBulkEdit(false)}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={editColumnValueHandler}>Save</Button>
          
          </div>
        </Box>
      </Modal>
      <Modal
      open={showNewColumn}
      onClose={() => setShowNewColumn(false)}

      >
        <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor:'lightgray',
          boxShadow: 24,
          p: 4
        }}
        >
          <Box
          sx={{
            display: 'flex',
            alignItems: 'center', 
            justifyContent: 'space-between',
            marginBottom: '2rem'
          }}
          >
          <InputLabel id="new-column">Column Name</InputLabel>
          <Select 
          size="small"
          sx={{ width: '100%'}}
          labelId="new-column"
          id="new-column"
          value={newColumnName} 
          onChange={(e) => {
            if(columns.some(col => col.field === e.target.value)) {
              alert(`Column ${e.target.value} already exists.`);
              return;
            } else setNewColumnName(e.target.value);
          }}>
            {databaseColumns.map((dbCol) => (
              <MenuItem key={dbCol} value={dbCol}>{dbCol}</MenuItem>
            ))}
          </Select>
          </Box>
          <div className="flex justify-between">
          <Button variant="contained" color="secondary" onClick={() => setShowNewColumn(false)}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={addColumnHandler}>Save</Button>
          
          </div>
        </Box>
      </Modal>
      <Snackbar 
        open={dataUploadedSuccessfully}
        autoHideDuration={3000}
        message="Data Uploaded"
      />
    </div>
  )
}

export default StudentsTable;