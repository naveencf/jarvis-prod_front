import React, { useEffect, useState, useRef } from "react";


const Dropdown = ({ children, btnHtml, tableref }) => {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef();
    const refcontent = useRef();

    function adjustDropdownPosition() {
        const rect = refcontent.current.getBoundingClientRect();
        const viewportWidth = tableref.current?.clientWidth;
        const viewportHeight = tableref.current?.clientHeight;
        // Adjust horizontally if overflowing
        if (rect.right > viewportWidth) {
            refcontent.current.style.left = `-${rect.right - viewportWidth + 10}px`; // Adjust left position to stay within the viewport
        } else if (rect.left < 400) {
            refcontent.current.style.left = `0px`; // Adjust to stay within the viewport from the left
        }

        // // Adjust vertically if overflowing
        // if (rect.bottom > viewportHeight) {
        //     refcontent.current.style.top = `-${rect.bottom - viewportHeight + 10}px`; // Adjust top position to stay within the viewport
        // } else if (rect.top < 0) {
        //     refcontent.current.style.top = `10px`; // Adjust to stay within the viewport from the top
        // }
    }
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref]);
    useEffect(() => {
        if (isOpen) {
            adjustDropdownPosition();
        }
    }, [isOpen, tableref])




    return (
        <div className="dropdown" ref={ref}>
            <div className="dropdown-toggle1" onClick={() => setIsOpen(!isOpen)}>
                {btnHtml}
            </div>
            {isOpen &&
                <div className="dropdown-content" ref={refcontent}>


                    {children}

                </div>
            }
        </div>
    );
};

export default Dropdown;