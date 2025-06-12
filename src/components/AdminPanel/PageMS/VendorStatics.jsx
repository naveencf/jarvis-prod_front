import React from 'react'
import VendorDetails from './Vendor/VendorDetails'
import VendorWhatsappLinkModla from './VendorWhatsappLinkModla';
import { Link } from 'react-router-dom';

function VendorStatics(filterData, vendorDetails, setVendorDetails) {
    return (
        < div >
            {filterData && (
                <div className="card">
                    {vendorDetails && <VendorDetails vendorDetails={vendorDetails} setVendorDetails={setVendorDetails} />}
                    <VendorWhatsappLinkModla />
                    <div className="card-header flexCenterBetween">
                        <h5 className="card-title">Vendor : {vendorData?.length}</h5>
                        <div className="flexCenter colGap8">
                            <Link to={`/admin/inventory/pms-vendor-master`} className="btn cmnbtn btn_sm btn-outline-primary">
                                Add Vendor <i className="fa fa-plus" />
                            </Link>
                            <Link to={`/admin/inventory/pms-page-overview`} className="btn cmnbtn btn_sm btn-outline-primary">
                                Page <KeyboardArrowRightIcon />
                            </Link>
                        </div>
                    </div>
                    <div className="data_tbl thm_table table-responsive card-body p0">
                        {loading ? (
                            <Box mt={2} ml={2} mb={3} sx={{ width: '95%' }}>
                                <Grid container spacing={{ xs: 1, md: 10 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                                    {Array.from(Array(5)).map((_, index) => (
                                        <Grid item md={1} key={index}>
                                            <Skeleton
                                                sx={{
                                                    width: '100%',
                                                }}
                                            />
                                        </Grid>
                                    ))}
                                </Grid>
                                <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                                    {Array.from(Array(30)).map((_, index) => (
                                        <Grid item xs={2} sm={2} md={2} key={index}>
                                            <Skeleton
                                                animation="wave"
                                                sx={{
                                                    width: '100%',
                                                }}
                                            />
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>
                        ) : (
                            <View version={1} columns={dataGridcolumns} data={filterData} isLoading={false} title="Vendor Overview" rowSelectable={true} pagination={[100, 200, 1000]} tableName="Vendor Overview" selectedData={setGetRowData} />
                        )}
                        {/* <View version={1} columns={dataGridcolumns} data={filterData} isLoading={false} title="Vendor Overview" rowSelectable={true} pagination={[100, 200, 1000]} tableName="Vendor Overview" selectedData={setGetRowData} exportData={ExportData} /> */}
                    </div>
                    <VendorBankDetailModal />
                    <VendorPageModal />
                    <VendorWhatsappLinkModla />
                </div>
            )
            }
        </div >
    )
}

export default VendorStatics