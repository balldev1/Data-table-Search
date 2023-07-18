
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import DataTable from 'react-data-table-component';

const columns = [
    {
        name: 'ID',
        selector: row => row.id,
        sortable: true,
        width: '100px'
    },
    {
        name: 'Coverimage',
        selector: row => row.coverimage,
        cell: row => <img src={row.coverimage} width={100} alt={row.name} />,
        width: '150px'
    },
    {
        name: 'Name',
        selector: row => row.name,
        width: '150px'
    },
    {
        name: 'Detail',
        selector: row => row.detail,
        width: '750px'
    },
    {
        name: 'Latitude',
        selector: row => row.latitude,
    },
    {
        name: 'Name',
        selector: row => row.longitude,
    }
];

const Table = () => {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalRows, setTotalRows] = useState(0);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [sortColumn, setSortColumn] = useState('');
    const [sortColumnDir, setSortColumnDir] = useState('');
    const [search, setSearch] = useState('');


    const fetchData = async page => {
        setLoading(true);

        var url = `http://localhost:3333/api/attractions?page=${page}&per_page=${perPage}`
        if (search) {
            url += `&search=${search}`;
        }

        if (sortColumn) {
            url += `&sort_column=${sortColumn}&sort_direction=${sortColumnDir}`;
        }
        const response = await axios.get(url);

        setData(response.data.data);
        setTotalRows(response.data.total);
        setLoading(false);
    };

    const handlePageChange = page => {
        setPage(page);
    };

    const handlePerRowsChange = async (newPerPage, page) => {
        setPerPage(newPerPage);
    };

    const handleSearchChange = (e) => {
        setSearch(e.target.value)
    }

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        fetchData(page, perPage);
    }

    useEffect(() => {
        fetchData(page, perPage);
    }, [page, perPage, sortColumn, sortColumnDir]);

    const handleSort = (column, sortDirection) => {
        console.log(column, sortDirection);
        setSortColumn(column.name);
        setSortColumnDir(sortDirection);
    };

    return (
        <div className='mt-5 ml-2'>
            <form onSubmit={handleSearchSubmit}>
                <label>
                    Search:
                    <input onChange={handleSearchChange}
                        className='ml-2 border-2' type="text" name="search" placeholder=' input location' />
                </label>
                <input className='border-2 rounded-xl ml-2 bg-cyan-500 hover:bg-cyan-600 cursor-pointer w-20 h-10 text-white'
                    type="submit" value="Submit" />
            </form>
            <DataTable
                title="Attraction"
                columns={columns}
                data={data}
                progressPending={loading}
                pagination
                paginationServer
                paginationTotalRows={totalRows}
                onChangeRowsPerPage={handlePerRowsChange}
                onChangePage={handlePageChange}
                onSort={handleSort}
            />
        </div>
    );
}

export default Table
