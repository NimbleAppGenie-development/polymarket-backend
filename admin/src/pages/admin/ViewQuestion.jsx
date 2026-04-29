import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AuthenticatedLayout } from "../../layout/AuthenticatedLayout.jsx";
import Service from "../../services/Http.js";
import { errorToastr } from "../../utils/toastr.js";

export default function ViewQuestion() {
    const [question, setQuestion] = useState(null);
    const [loading, setLoading] = useState(false);

    const { questionId } = useParams();

    const fetchQuestion = async () => {
        if (!questionId) return;

        setLoading(true);

        try {
            const services = new Service();

            const response = await services.get(`/admin/question/view/${questionId}`, {}, true);
            console.log("Radheeeeeeeeeeeee", response);
            if (response?.status) {
                setQuestion(response.data);
            } else {
                setQuestion(null);
            }
        } catch (error) {
            console.error("FETCH QUESTION ERROR:", error);
            errorToastr(error?.message || "Failed to fetch question");
            setQuestion(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuestion();
    }, [questionId]);

    return (
        <AuthenticatedLayout title="View Question">
            <div className="container">

                {loading && <p>Loading...</p>}

                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th>S.No</th>
                            <th>User</th>
                            <th>Selected Option</th>
                            <th>Entry Amount</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {question?.map((item, key) => (
                            <tr key={item.id || key}>
                                <td>{key + 1}</td>
                                <td>{item.userId}</td>
                                <td>{item?.selectedOption}</td>
                                <td>{item?.entryAmount}</td>
                                <td>{item?.winningStatus}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {!loading && !question && <p>No question found</p>}
            </div>
        </AuthenticatedLayout>
    );
}
