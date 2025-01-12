import React, { useState, useEffect, useContext, useMemo } from 'react'
import StudentsTable from '../components/StudentsTable';
import ClassWidget from '../components/ClassWidget';
import { AppContext } from '../App';

const Students = ({ columns, setColumns, setClassWidgets }) => {
  const {rows, setRows} = useContext(AppContext);
  const [classStats, setClassStats] = useState([]);
  const [filteredClass, setFilteredClass] = useState(null);
  const [updatedRows, setUpdatedRows] = useState(rows);

  const totalFeeByClass = useMemo(() => {
    const totals = {};

    rows.forEach((row) => {
      const { Class, Fee } = row;
      if (!totals[Class]) {
        totals[Class] = 0;
      }
      totals[Class] += Fee;
    });

    return totals;
  }, [rows]);

  const handleCardClick = (className) => {
    setFilteredClass((prev) => (prev === className ? null : className));
  }
  useEffect(() => {
  const data =
    filteredClass === null
    ? rows
    : rows.filter((row) => row["Class"] === filteredClass);
  setUpdatedRows(data);

  }, [rows, filteredClass]);
  useEffect(() => {
    const stats = rows.reduce((acc, student) => {
      const className = student['Class'];
      if(!acc[className]) {
        acc[className] = 0;
      }
      acc[className]++;
      return acc;
    }, {});
    setClassStats(Object.entries(stats).map(([className, count]) => ({className, count})));
  }, [rows]);
  return (
    <div>
      <div className='w-full p-8'>
        <h3 className='mb-5 font-bold text-xl'>Class Overview</h3>
        <div 
        className='grid gap-4 xs:grid-cols-2 md1:grid-cols-4 '
        >
          {classStats.map(({className, count}) => (
            <div 
            key={className}
            onClick={() => handleCardClick(className)}
            className={`p-4 ${filteredClass === className ? 'bg-[#DCFAFA]' : ''} [border:1px_solid_#ccc] rounded-lg cursor-pointer shadow-sm text-[#323232]`}>
              <h4>Class {className}: {count} Students</h4>
            
            </div>
          ))}
        </div>
      </div>
      <div className='p-8'>
      <h3 className='mb-5 font-bold text-xl'>Class-wise Total Fees</h3>
      <div 
        className='grid gap-4 xs:grid-cols-2 md1:grid-cols-6 lg:grid-cols-8 '
        >
          {Object.entries(totalFeeByClass).map(([className, totalFee]) => (
        <div key={className} className={`p-4 [border:1px_solid_#ccc] rounded-lg cursor-pointer shadow-sm text-[#323232]`}>
          Class {className}: {totalFee}
        </div>
      ))}
        </div>
      
    </div>
      <StudentsTable 
        rows={updatedRows}
        setRows={setRows}
        columns={columns}
        setColumns={setColumns}
        setClassWidgets={setClassWidgets}
      />
    </div>
  )
}

export default Students;