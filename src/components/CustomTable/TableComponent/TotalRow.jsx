import { he } from 'date-fns/locale'
import React, { use, useEffect, useRef } from 'react'

const TotalRow = ({
    unSortedData, columnsheader, visibleColumns, rowSelectable, headref, tableref, applyFlag,
}) => {

    const copyref = useRef(null);
    const col = headref?.current?.childNodes;
    const syncScroll = (source, target) => {
        target.current.scrollLeft = source.current.scrollLeft;
    };
    useEffect(() => {
        const scroll1 = copyref?.current;
        const scroll2 = tableref?.current;

        // Add scroll event listeners to both scrollable divs
        const handleScroll1 = () => syncScroll(copyref, tableref);
        const handleScroll2 = () => syncScroll(tableref, copyref);

        scroll1.addEventListener('scroll', handleScroll1);
        scroll2.addEventListener('scroll', handleScroll2);

        // Cleanup event listeners on unmount
        return () => {
            scroll1.removeEventListener('scroll', handleScroll1);
            scroll2.removeEventListener('scroll', handleScroll2);
        };
    }, []);

    function calculateTotalAmount(func) {
        let amounts;
        if (typeof func !== 'function') {

            amounts = unSortedData?.map((data) => data?.[func]);

        } else {
            amounts = unSortedData?.map((data) => func(data))
        }

        let total = 0;

        amounts.forEach(amount => {
            if (typeof amount === 'number') {
                // If it's already a number, add it directly
                total += amount;
            } else if (typeof amount === 'string') {
                // Remove the currency symbol and convert the string to a number
                let number = parseFloat(amount.replace(/[^0-9.-]+/g, ""));
                if (!isNaN(number)) {
                    total += number;
                }
            }
        });

        return total.toFixed(2);
    }

    return (
        <div className="total-container" ref={copyref}  >

            <table>
                <thead>
                    <tr >

                        {visibleColumns?.some((value) => value) && rowSelectable && (
                            <th
                                style={{
                                    width: "40px",
                                    height: "50px",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    paddingTop: "4px",
                                    padding: "0",
                                }}
                            >
                                <input
                                    type="checkbox"
                                />
                            </th>
                        )}
                        {columnsheader.map((column, index) => (
                            visibleColumns?.[index] && (
                                <th
                                    key={index}

                                    style={{
                                        width: `${col?.[index]?.getBoundingClientRect()?.width}px`,
                                    }}
                                >
                                    <div className="table-header">
                                        <div
                                            className="header-title"
                                        >
                                            {
                                                column?.getTotal && (
                                                    <p>{calculateTotalAmount(column?.renderRowCell || column.key)}</p>
                                                )
                                            }
                                        </div>
                                        <div className="wrapper-filed">
                                            {column?.name?.toUpperCase().trim() !== "ACTIONS" &&
                                                column?.name?.toUpperCase().trim() !== "S.NO" && (
                                                    <div className="col-opt">
                                                        <svg
                                                            width="15px"
                                                            height="30px"
                                                            viewBox="0 0 16 16"
                                                            fill="#959DA3"
                                                            className="bi bi-three-dots-vertical"
                                                        >
                                                        </svg>
                                                    </div>
                                                )}

                                            <div
                                                className="resizable-hidden"

                                            >

                                            </div>
                                        </div>

                                    </div>
                                </th>)
                        ))}
                    </tr>
                </thead>
            </table>
        </div >
    )
}

export default TotalRow