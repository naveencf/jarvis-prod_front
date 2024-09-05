import React from 'react'
import FormContainer from '../../../FormContainer'
import View from '../View/View'
import { useGetSingleRecordServiceQuery } from '../../../../Store/API/Sales/RecordServicesApi'
import DateISOtoNormal from '../../../../../utils/DateISOtoNormal'


const RecordServicesData = ({ modalData }) => {
    const {
        data: SingleRecordData,
        error: SingleRecordError,
        isLoading: SingleRecordLoading
    } = useGetSingleRecordServiceQuery(modalData?.sale_booking_id, {
        skip: !modalData?.sale_booking_id
    }
    );
    const columns = [
        { width: 50, key: "S.No", name: "S.No", renderRowCell: (row, index) => <div>{index + 1}</div> },
        { width: 150, key: "amount", name: "Amount", renderRowCell: (row) => <div>{row.amount}</div> },
        { width: 150, key: "brand_name", name: "Brand Name", renderRowCell: (row) => <div>{row.brand_name}</div> },
        { width: 150, key: "day", name: "Day", renderRowCell: (row) => <div>{row.day}</div> },
        { width: 150, key: "deliverables_info", name: "Deliverables Info", renderRowCell: (row) => <div>{row.deliverables_info}</div> },
        { width: 150, key: "end_date", name: "End Date", renderRowCell: (row) => <div>{DateISOtoNormal(row.end_date)}</div> },
        { width: 150, key: "goal", name: "Goal", renderRowCell: (row) => <div>{row.goal}</div> },
        { width: 150, key: "hashtag", name: "Hashtag", renderRowCell: (row) => <div>{row.hashtag}</div> },
        { width: 150, key: "individual_amount", name: "Individual Amount", renderRowCell: (row) => <div>{row.individual_amount}</div> },
        { width: 150, key: "no_of_creators", name: "No. of Creators", renderRowCell: (row) => <div>{row.no_of_creators}</div> },
        { width: 150, key: "no_of_hours", name: "No. of Hours", renderRowCell: (row) => <div>{row.no_of_hours}</div> },
        { width: 150, key: "per_month_amount", name: "Per Month Amount", renderRowCell: (row) => <div>{row.per_month_amount}</div> },
        { width: 150, key: "quantity", name: "Quantity", renderRowCell: (row) => <div>{row.quantity}</div> },
        { width: 150, key: "remarks", name: "Remarks", renderRowCell: (row) => <div>{row.remarks}</div> },
        { width: 150, key: "sale_booking_date", name: "Sale Booking Date", renderRowCell: (row) => <div>{DateISOtoNormal(row.sale_booking_date)}</div> },
        { width: 150, key: "start_date", name: "Start Date", renderRowCell: (row) => <div>{DateISOtoNormal(row.start_date)}</div> },
        { width: 150, key: "status", name: "Status", renderRowCell: (row) => <div>{row.status}</div> },
    ];
    return (
        <div>
            <FormContainer
                mainTitle={"Record Services"}
                link={true}

            />
            <View
                columns={columns}
                data={SingleRecordData}
                isLoading={SingleRecordLoading}
                pagination
                title={"Record Services Overview"}
                tableName={"Individual Sale Booking recordServices"}
            />
        </div>
    )
}

export default RecordServicesData