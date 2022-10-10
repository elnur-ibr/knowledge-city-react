import './App.css';
import {useEffect, useState} from "react";
import axios from 'axios';
import Logo from './Logo.svg'
import ReactPaginate from 'react-paginate';


function App() {
  const [data, setData] = useState({})
  const [loggedId, setLoggedIn] = useState(false)
  const [error, setError] = useState('')
  const [token, setToken] = useState('')
  const [page, setPage] = useState(1)
  const [tableData, setTableData] = useState({
    items: []
  })

  const handleOnChange = (e) => {
    const name = e.target.name
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setData({...data, [name]: value})
    setError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    axios.post('https://knowledge-city-php.test/api/auth/login', data, {
      withCredentials: true,
    }).then(response => {
      setLoggedIn(true)
      setToken(response.data.token)

    }).catch(e => {
      setError(e.response.data.messages)
    })
  }
  const handleLogout = (e) => {
    axios.delete('https://knowledge-city-php.test/api/auth/logout', {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(response => {
      setLoggedIn(false)
      setToken('')

    })
  }

  useEffect(() => {
    if(loggedId){
      axios.get('https://knowledge-city-php.test/api/student', {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page,
          perPage: 15
        }}).then(response => {
        setTableData(response.data)
      })
    }
  }, [loggedId, page, token])

  if (loggedId) {
    return (
      <div className="flex flex-col items-center pt-20">
        <table className="table-fixed w-2/5 mb-5">
          <thead>
          <tr className="bg-amber-500">
            <th className="py-2" colSpan={2}></th>
          </tr>
          </thead>
            <tbody>
            {
              tableData.items.map(item => (
                <tr key={item.id} className="even:bg-gray-200 odd:bg-white">
                  <td align="center" className="py-2">{item.first_name}</td>
                  <td align="center" className="py-2">{item.group_name}</td>
                </tr>
              ))
            }
            </tbody>

        </table>
        <ReactPaginate
          containerClassName="flex"
          breakLabel="..."
          pageClassName="px-1 font-medium"
          nextLabel="next"
          onPageChange={(page) => {
            setPage(page.selected + 1)
          }}
          pageRangeDisplayed={5}
          pageCount={tableData.lastPage}
          previousLabel="previous"
          renderOnZeroPageCount={null}
        />
        <div className="flex justify-center fixed bottom-0 py-3 bg-gray-200 w-full">
          <p className="font-medium cursor-pointer" onClick={handleLogout}>Log out</p>
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex items-center h-screen">
        <div className="w-1/5 mx-auto">
          <img src={Logo} height={30} className="mb-10" style={{height: '80px'}}/>
          <p className="font-medium">Welcome to the Learning Managment System</p>
          <p className="text-sm mb-9">Please log in continue</p>
          {
            error && (
              <p className="text-red-600 mb-9">{error}</p>
            )
          }
          <form onSubmit={handleSubmit} className="flex flex-col items-start">
            <input type="email" name="email" placeholder="Username" className="border border-gray-400 rounded-2xl mb-3 py-1 w-full px-4" onChange={handleOnChange}/>
            <input type="password" name="password" placeholder="Password" className="border border-gray-400 rounded-2xl py-1 mb-2 w-full px-4" onChange={handleOnChange}/>
            <label className="flex">
              <input type="checkbox" name="remember_me" onChange={handleOnChange} className="mr-1"/>
              <p className="text-sm">Remember me</p>
            </label>
            <button className="border border-current rounded-xl mb-2 bg-amber-500	px-2 py-1 w-full text-white mt-3">submit</button>
          </form>
        </div>

      </div>
    );
  }

}

export default App;
