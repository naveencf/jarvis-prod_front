import React from 'react'
import { Link } from 'react-router-dom'
import FormContainer from '../../FormContainer'

const InventoryDashboard = () => {
  return (
    <div>
      <div className="action_heading">
        <div className="action_title">
          <FormContainer mainTitle={'Dashboard'} link={true} />
        </div>
        <div className="action_btns">
          
            <Link to="/admin/pms-inventory-category-overview">
              <button className="btn cmnbtn btn-primary btn_sm">
                Category
              </button>
            </Link>
            <Link to="/admin/sales-user-report">
              <button className="btn cmnbtn btn-primary btn_sm">
                Sub Category
              </button>
            </Link>          
        </div>
      </div>
    </div>
  )
}

export default InventoryDashboard