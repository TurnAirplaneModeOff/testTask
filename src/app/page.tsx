
'use client'

import * as React from 'react';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import { useRouter } from 'next/navigation'
import { useState,useEffect } from 'react'
import axios from 'axios'

export default function Home() {
  const [value, setValue] = useState('Lviv');
 
  const [error, setError] = useState(false);
  const [token, setToken] = useState('');
  const router = useRouter()
  useEffect(() => {
    fetchData();
  },[]);

  const fetchData = async () => {
    const apiUrl = "https://test.api.amadeus.com/v1/security/oauth2/token";
    const clientId = "lNUc4wlvoqaI1GGzk22mhu4kbL2OW7RV"; 
    const clientSecret = "sn1TelKTG6pyBMsF"; 
    
    
    const data = new URLSearchParams();
    data.append("grant_type", "client_credentials");
    data.append("client_id", clientId);
    data.append("client_secret", clientSecret);
    

    const headers = new Headers({
      "Content-Type": "application/x-www-form-urlencoded",
    });
    
  
    const requestOptions = {
      method: "POST",
      headers: headers,
      body: data,
    };
    
    fetch(apiUrl, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        
        const accessToken = data.access_token;
     
       setToken("Bearer "+ accessToken);
     
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };



  const endpoint = `https://test.api.amadeus.com/v1/reference-data/locations/cities?keyword=${value}&max=1`;

  const handleFetch = () => {
    axios.get(endpoint, {

      headers: {
        'Authorization': `${token}`,
      },
    })
      .then(response => {
       
        setError(false);
      })
      .catch(error => {
        console.error('Error:', error);
        setError(true);
      });

  }

  const handleSearch = () => {
    handleFetch();
    if (error === false) {
      router.push(`/graph?name=${value}`);
    }
  }

  const handleChangeCity = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    handleFetch();
  }
  return (
    <div className='flex flex-col	 justify-center items-center	 h-[100vh] '>
      <Paper
        component="form"
        className='px-[2px] py-[4px] flex align-center w-[400px] h-[70px]'
      >

        <InputBase
          className='flex-1'
          placeholder="Search your city"
          onChange={handleChangeCity}
        />
        <IconButton onClick={handleSearch} type="button" className='p-[1px]' aria-label="search">
          <SearchIcon />
        </IconButton>
        <Divider className='h-16 m-0.5' orientation="vertical" />
      </Paper>
      <div>
        {error ? <p className='color-red text-xl'>No such city</p> : null}
      </div>
    </div>
  )
}
