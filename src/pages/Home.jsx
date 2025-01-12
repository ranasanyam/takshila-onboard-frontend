import { Select, Box, FormControl, InputLabel, MenuItem } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router';

const Home = () => {
    const navigate = useNavigate();
    const [school, setSchool] = useState('');

  const handleChange = (event) => {
    setSchool(event.target.value);
    navigate('/upload');
  };
  return (
    <div>
        <div className='flex justify-end h-[10vh] p-4 pr-12 bg-[#0E91A0] text-whites'>
            <Box sx={{ width: 120 }}>
                <FormControl fullWidth>
                    <InputLabel id="school-select-label">School</InputLabel>
                    <Select
                    labelId="school-select-label"
                    id="school-select"
                    value={school}
                    label="School"
                    onChange={handleChange}
                    >
                    <MenuItem value={10}>Ten</MenuItem>
                    <MenuItem value={20}>Twenty</MenuItem>
                    <MenuItem value={30}>Thirty</MenuItem>
                    </Select>
                </FormControl>
            </Box>
        </div>
        <div className='h-[90vh] flex items-center justify-center text-2xl font-bold'>You've not selected any school yet.</div>
    </div>
  )
}

export default Home;