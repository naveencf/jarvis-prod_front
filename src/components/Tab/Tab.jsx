import React from 'react'

const Tab = ({
    tabName,
    activeTabindex,
    onTabClick,
}) => {
    return (
        <div className="tab">
            {tabName.map((tab, index) => (
                <button
                    key={index}
                    className={`named-tab ${activeTabindex === index ? "active-tab" : ""}`}
                    onClick={() => onTabClick(index)}
                >
                    {tab}
                </button>
            ))}
        </div>
    )
}

export default Tab