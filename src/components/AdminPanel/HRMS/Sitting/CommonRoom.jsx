import React from "react";
import floorBg from "../../../../assets/imgs/sitting/floor-bg.png";
import room104 from "../../../../assets/imgs/sitting/room-104.png";
import cabin104 from "../../../../assets/imgs/sitting/cabin-104.png";
import room105A from "../../../../assets/imgs/sitting/room-105-a.png";
import room105B from "../../../../assets/imgs/sitting/room-105-b.png";
import room106 from "../../../../assets/imgs/sitting/room-106.png";
import cafeteria from "../../../../assets/imgs/sitting/cafeteria.png";
import room103 from "../../../../assets/imgs/sitting/room-103.png";
import confrence from "../../../../assets/imgs/sitting/confrence.png";
import room102 from "../../../../assets/imgs/sitting/room-102.png";
import room101 from "../../../../assets/imgs/sitting/room-101.png";
import kitchen from "../../../../assets/imgs/sitting/kitchen.png";
import lift from "../../../../assets/imgs/sitting/lift.png";
import parkingBalcony from "../../../../assets/imgs/sitting/parking-balcony.png";
import { Link } from "react-router-dom";

const CommonRoom = () => {
  return (
    <div className="card">
      <div className="card-header">
        <h5 className="card-title">Creativefuel (Indore)</h5>
      </div>
      <div className="card-body">
        <div className="floorPlanWrapper">
          <div className="floorPlan">
            <div className="floorPlanBg">
              <img src={floorBg} />
            </div>
            <div className="floorPlanUp">
              <Link to={`/admin/office-mast-overview/${"Room_104"}`}>
                <div className="room roomEnable">
                  <img src={room104} />
                </div>
              </Link>
              <div className="room">
                <img src={cabin104} />
              </div>
              <Link to={`/admin/office-mast-overview/${"Room_105(A)"}`}>
                <div className="room roomEnable">
                  <img src={room105A} />
                </div>
              </Link>
              <Link to={`/admin/office-mast-overview/${"Room_105(B)"}`}>
                <div className="room roomEnable">
                  <img src={room105B} />
                </div>
              </Link>
              <Link to={`/admin/office-mast-overview/${"Room_106"}`}>
                <div className="room roomEnable">
                  <img src={room106} />
                </div>
              </Link>
              <Link to={`/admin/office-mast-overview/${"Room_104"}`}></Link>
              <div className="room">
                <img src={cafeteria} />
              </div>
            </div>
            <div className="floorPlanDown">
              <div className="room">
                <img src={parkingBalcony} />
              </div>
              <div className="room">
                <img src={lift} />
              </div>
              <div className="room">
                <img src={kitchen} />
              </div>
              <Link to={`/admin/office-mast-overview/${"Room_101"}`}>
                <div className="room roomEnable">
                  <img src={room101} />
                </div>
              </Link>
              <Link to={`/admin/office-mast-overview/${"Room_102"}`}>
                <div
                  className="room roomEnable"
                  onClick={() => handleCardClick("Room_102")}
                >
                  <img src={room102} />
                </div>
              </Link>
              <div className="room">
                <div className="confrenceRoom">
                  <img src={confrence} />
                </div>
                <img src={room103} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommonRoom;
