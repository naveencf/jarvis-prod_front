import { Autocomplete, TextField ,Button} from '@mui/material';
import React, { useState } from 'react'

const InvoiceCreatedFilters = (props) => {
    const {dataInvoice,setFilterDataInvoice} = props;
    const [customerNameInvoice, setCustomerNameInvoice] = useState("");
    const [salesPersonInvoiceName, setSalesPersonInvoiceName] = useState("");
    const [invoiceParticularName, setInvoiceParticularName] = useState("");
    const [campaignAmountInvoiceFilter, setCampaignAmountInvoiceFilter] =
    useState("");
    const [campaignAmountInvoiceField, setCampaignAmountInvoiceField] =
    useState("");


    const handleAllInvoiceFilters = () => {
        const filterDataInvoice = dataInvoice?.filter((item) => {
          // Customer Name Filter:-
          const customerNameInvoiceFilterPassed =
            !customerNameInvoice ||
            item.saleData.account_name
              ?.toLowerCase()
              ?.includes(customerNameInvoice?.toLowerCase());
    
          const salesPersonNameInvoiceFilterPassed =
            !salesPersonInvoiceName ||
            item.user_name
              ?.toLowerCase()
              ?.includes(salesPersonInvoiceName?.toLowerCase());
    
          const invoiceParticularNameFilterPassed =
            !invoiceParticularName ||
            (item.saleData.invoice_particular_name &&
              item.saleData.invoice_particular_name
                ?.toLowerCase()
                ?.includes(invoiceParticularName?.toLowerCase()));
          // campaign amount filter:-
          const campaignAmountFilterPassed = () => {
            const campaignAmountData = parseFloat(campaignAmountInvoiceField);
            switch (campaignAmountInvoiceFilter) {
              case "greaterThan":
                return +item.saleData.campaign_amount > campaignAmountData;
              case "lessThan":
                return +item.saleData.campaign_amount < campaignAmountData;
              case "equalTo":
                return +item.saleData.campaign_amount === campaignAmountData;
              default:
                return true;
            }
          };
          const allFiltersPassed =
            customerNameInvoiceFilterPassed &&
            salesPersonNameInvoiceFilterPassed &&
            invoiceParticularNameFilterPassed &&
            campaignAmountFilterPassed();
    
          return allFiltersPassed;
        });
        setFilterDataInvoice(filterDataInvoice);
      };

      const handleClearAllInvoiceFilters = () => {
        setFilterDataInvoice(dataInvoice);
        setCustomerNameInvoice("");
        setSalesPersonInvoiceName("");
        setCampaignAmountInvoiceFilter("");
        setCampaignAmountInvoiceField("");
        setInvoiceParticularName("");
      };
      
  return (
    <div>
        <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title">Search by filter</h5>
            </div>
            <div className="card-body pb4">
              <div className="row thm_form">
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Account Name</label>
                    <Autocomplete
                      value={customerNameInvoice}
                      onChange={(event, newValue) =>
                        setCustomerNameInvoice(newValue)
                      }
                      options={Array.from(
                        new Set(
                          dataInvoice?.map(
                            (option) => option?.saleData?.account_name || []
                          )
                        )
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Account Name"
                          type="text"
                          variant="outlined"
                          InputProps={{
                            ...params.InputProps,
                            className: "form-control", 
                          }}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Sales Person Name</label>
                    <Autocomplete
                      value={salesPersonInvoiceName}
                      onChange={(event, newValue) =>
                        setSalesPersonInvoiceName(newValue)
                      }
                      options={Array?.from(
                        new Set(
                          dataInvoice
                            ?.map((item) => item?.user_name)
                            ?.filter(Boolean)
                        )
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Sales Executive Name"
                          type="text"
                          variant="outlined"
                          InputProps={{
                            ...params.InputProps,
                            className: "form-control", 
                          }}
                          style={{
                            borderRadius: "0.25rem",
                            transition:
                              "border-color .15s ease-in-out,box-shadow .15s ease-in-out",
                            "&:focus": {
                              borderColor: "#80bdff",
                              boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)",
                            },
                          }}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Invoice Particular</label>
                    <Autocomplete
                      value={invoiceParticularName}
                      onChange={(event, newValue) =>
                        setInvoiceParticularName(newValue)
                      }
                      options={Array?.from(
                        new Set(
                          dataInvoice
                            ?.filter(
                              (option) =>
                                option &&
                                option?.saleData?.invoice_particular_name !==
                                  null &&
                                option?.saleData?.invoice_particular_name !==
                                  undefined
                            ) // Filter out null or undefined values
                            ?.map(
                              (option) =>
                                option?.saleData?.invoice_particular_name?.toLowerCase() ||
                                []
                            ) // Convert to lowercase here
                        )
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Invoice Particular"
                          type="text"
                          variant="outlined"
                          InputProps={{
                            ...params.InputProps,
                            className: "form-control",
                          }}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Campaign Amount Filter</label>
                    <select
                      value={campaignAmountInvoiceFilter}
                      className="form-control"
                      onChange={(e) =>
                        setCampaignAmountInvoiceFilter(e.target.value)
                      }
                    >
                      <option value="">Select Amount</option>
                      <option value="greaterThan">Greater Than</option>
                      <option value="lessThan">Less Than</option>
                      <option value="equalTo">Equal To</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Campaign Amount</label>
                    <input
                      value={campaignAmountInvoiceField}
                      type="number"
                      placeholder="Request Amount"
                      className="form-control"
                      onChange={(e) => {
                        setCampaignAmountInvoiceField(e.target.value);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="card-footer">
              <div className="flexCenter colGap16">
                <Button
                  variant="contained"
                  onClick={handleAllInvoiceFilters}
                  className="btn cmnbtn btn-primary"
                >
                  <i className="fas fa-search"></i> Search
                </Button>
                <Button
                  variant="contained"
                  onClick={handleClearAllInvoiceFilters}
                  className="btn cmnbtn btn-secondary"
                >
                  Clear
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InvoiceCreatedFilters
