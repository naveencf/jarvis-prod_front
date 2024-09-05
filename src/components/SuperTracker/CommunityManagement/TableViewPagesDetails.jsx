import View from "../../AdminPanel/Sales/Account/View/View";

const TableViewPagesDetails = ({pagecategory}) => {
    console.log(pagecategory,'bbbbbb');
    const ViewSalesAccountColumns = [
        {
          key: "Serial_no",
          name: "S.NO",
          renderRowCell: (row, index) => index + 1,
          width: 20,
          showCol: true,
          sortable: true,
        },
       
        // {
        //   key: "created_by_name",
        //   name: "Sales Executive Name",
        //   width: 100,
        //   sortable: true,
        // },
        // {
        //   key: "totalSaleBookingCounts",
        //   name: "Total No. Of Sale booking",
        //   width: 100,
        //   sortable: true,
        // },
        // {
        //   key: "campaignAmount",
        //   name: "Campaign Amount Total",
    
        //   width: 100,
        //   sortable: true,
        // },
        
      
        
        // {
        //   key: "turn_over",
        //   name: "Turn Over",
        //   renderRowCell: (row) => row?.turn_over || "N/A",
    
        //   width: 100,
        //   sortable: true,
        //   showCol: true,
        // },
       
       
       
        // {
        //   key: "account_type_name",
        //   name: "Account Type",
        //   width: 100,
        //   sortable: true,
        //   showCol: true,
        // },
        // {
        //   key: "company_type_name",
        //   name: "Company Type",
        //   width: 100,
        //   sortable: true,
        //   showCol: true,
        // },
        // {
        //   key: "brand_category_name",
        //   name: "Brand Category Name",
        //   renderRowCell: (row) => {
        //     const brandType = allBrandCatType?.find(
        //       (brandCatType) => brandCatType._id === row.category_id
        //     );
        //     return brandType ? brandType.brand_category_name : "NA";
        //   },
        //   width: 100,
        //   compare: true,
    
        //   showCol: true,
        // },
        
      ];
  return (
    <div>
<View

data={pagecategory}
title={
    "Table View"
}
columns={ViewSalesAccountColumns}
tableName={'CommnuityreportOverviewTable'}
/>
    </div>
  )
}

export default TableViewPagesDetails