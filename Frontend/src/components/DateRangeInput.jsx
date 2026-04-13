import { useEffect, useRef, useState } from "react";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

export default function FloatingDatePicker({ dateRange, setDateRange }) {
    const picker = useRef(null);
    const input = useRef(null);
    const [showRangeBox, setShowRangeBox] = useState(false);
    const [ranges, setRanges] = useState([
        {
            startDate: null,
            endDate: new Date(),
            key: "selection",
        },
    ]);

    const handleDateRanges = (item) => {
        let { startDate, endDate } = item.selection;
        setRanges([item.selection]);
        setDateRange(`${startDate.toDateString()} - ${endDate.toDateString()}`);
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (picker.current && !picker.current.contains(event.target) && !input.current.contains(event.target)) {
                setShowRangeBox(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="position-relative">
            <input
                type="text"
                name="daterange"
                id="date-range"
                readOnly
                className="form-control cursor-pointer"
                placeholder="Enter selected date range"
                onClick={() => setShowRangeBox(!showRangeBox)}
                value={dateRange}
                ref={input}
            />

            {showRangeBox && (
                <div ref={picker} className="position-absolute top-full left-0 bg-white shadow-lg border p-2 rounded-md z-3">
                    <DateRangePicker
                        editableDateInputs={true}
                        onChange={(item) => handleDateRanges(item)}
                        moveRangeOnFirstSelection={false}
                        ranges={ranges}
                        months={2}
                        maxDate={new Date()}
                        direction="horizontal"
                    />
                </div>
            )}
        </div>
    );
}
