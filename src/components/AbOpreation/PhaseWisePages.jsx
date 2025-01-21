const PhaseWisePages = ({ phaseWisePages, selectedDate, onDateSelect }) => {
    const handleDateClick = (date) => {
        onDateSelect(phaseWisePages[date] || [], date);
    };

    return (
        <div>
            <ul className="d-flex mr-2">
                {Object.keys(phaseWisePages)
                    .sort((a, b) => new Date(a) - new Date(b))
                    .map((date) => {

                        // console.log("🚀 ~ formattedDate ~ formattedDate:", formattedDate,' ctrl + opt + l ')
                        const formattedDate = new Date(date).toLocaleDateString("en-IN", {
                            timeZone: "Asia/Kolkata",
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                        });

                        return (
                            <button
                                className={`btn cmnbtn btn_sm ${selectedDate === date ? "btn-primary" : "btn-outline-primary"
                                    } mr-1`}
                                key={date}
                                onClick={() => handleDateClick(date)}
                            >
                                {formattedDate}
                            </button>
                        );
                    })}
            </ul>

        </div>
    );
};

export default PhaseWisePages;
