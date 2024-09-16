
import Beginner from "./Beginner";
import LastestUpdate from "./LastestUpdate";
import Strategy from "./Strategy";
import logo from "/logo.png";
import { useNavigate } from "react-router-dom";

import {
    AddressBook,
    CashRegister,
    ChartLineUp,
    File,
} from "@phosphor-icons/react";
import Achievement from "./Achievement";

const Learning = () => {
    const navigate = useNavigate();

    const handleClickScroll = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };
    return (
        <div className="AccountInfo">
            <div className="sales-sidebar">
                <div className="topbarBrand-1">
                    <div className="branding">
                        <div className="logo-1">
                            <img className="logo-img" src={logo} alt="logo" width={40} />
                        </div>
                        <div className="brandtext">
                            Creative <span>fuel</span>
                        </div>
                    </div>
                </div>
                <div className="navbar-nav sidebar">
                    <div className="links">
                        <div className="nav-item nav-item-single">
                            <div
                                className="nav-btn nav-link"
                                onClick={() => handleClickScroll("DetailView")}
                            >
                                <i className="ph">
                                    <CashRegister weight="duotone" />
                                </i>
                                <span>Beginner</span>
                            </div>
                        </div>
                        <div className="nav-item nav-item-single">
                            <div
                                className="nav-btn nav-link"
                                onClick={() => handleClickScroll("ContactView")}
                            >
                                <i className="ph">
                                    <AddressBook weight="duotone" />
                                </i>
                                <span>
                                    Latest Update <span className="badgeNum">{"pocCount"}</span>
                                </span>
                            </div>
                        </div>
                        <div className="nav-item nav-item-single">
                            <div
                                className="nav-btn nav-link"
                                onClick={() => handleClickScroll("SalesView")}
                            >
                                <i className="ph">
                                    <ChartLineUp weight="duotone" />
                                </i>
                                <span>Strategy</span>
                            </div>
                        </div>

                        <div className="nav-item nav-item-single">
                            <div
                                className="nav-btn nav-link"
                            // onClick={() => handleClickScroll("DocumentsView")}
                            >
                                <i className="ph">
                                    <File weight="duotone" />
                                </i>
                                <span>
                                    Achievement <span className="badgeNum">{"docCount"}</span>
                                </span>
                            </div>
                        </div>


                    </div>
                </div>
            </div>
            <div className="sales-accountinfo-view">
                <div className="actionNavbar">
                    <button className="icon" onClick={() => navigate(-1)}>
                        <i className="bi bi-arrow-left"></i>
                    </button>
                </div>
                <section id="DetailView">
                    <Beginner />
                </section>

                <section id="ContactView">
                    <LastestUpdate />
                </section>


                <section id="DocumentsView">
                    <Strategy
                    />
                </section>
             <section id="TimelineView">
         <Achievement/>
        </section>
      
            </div>
        </div>
    );
};

export default Learning;
