import React from 'react'
import CustomTable from '../../../../CustomTable/CustomTable'
import CustomTableWrapper from '../../../../ReusableComponents/CustomTableWrapper'


//c
const View = ({ data, columns, isLoading, title, rowSelectable = false, pagination = false, tableName, selectedData }) => {

    return (

        <CustomTableWrapper title={title}>
            <CustomTable
                columns={columns}
                data={data}
                fixedHeader
                dataLoading={isLoading}
                Pagination={pagination}
                rowSelectable={rowSelectable}
                tableName={tableName}
                selectedData={selectedData}
            />
        </CustomTableWrapper>

    )
}

export default View