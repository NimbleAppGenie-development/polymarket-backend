import { BrowserRouter, Route, Routes } from "react-router";
import { PrivateRoute } from "./utils/auth/PrivateRoute";
import "./index.css";
import LoginLayout from "./layout/LoginLayout";
import NewsLetter from "./pages/Newsletter";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/login";
import Dashboard from "./pages/admin/Dashboard";
import AdminWallet from "./pages/admin/AdminWallet.jsx";
import Withdraw from "./pages/admin/Withdraw.jsx";
import SetWithdrawLimit from "./pages/admin/SetWithdrawLimit.jsx";
import Pages from "./pages/admin/Pages.jsx";
import PageEdit from "./pages/admin/PageEdit.jsx";
import Category from "./pages/admin/Category.jsx";
import AddCategory from "./pages/admin/AddCategory.jsx";
import EditCategory from "./pages/admin/EditCategory.jsx";
import Questions from "./pages/admin/Questions.jsx";
import AddQuestion from "./pages/admin/AddQuestion.jsx";
import EditQuestion from "./pages/admin/EditQuestion.jsx";
import ViewQuestion from "./pages/admin/ViewQuestion.jsx";
import UserManagement from "./pages/admin/UserManagement.jsx";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* <Route index element={<UpdatedNewsLetter />} /> */}
                <Route index element={<NewsLetter />} />

                <Route path="auth">
                    <Route path="login" element={ <LoginLayout> <Login /> </LoginLayout> } />
                    <Route path="register" element={ <LoginLayout> <Login /> </LoginLayout> } />
                </Route>

                <Route path="/dashboard" element={ <PrivateRoute> <Dashboard /> </PrivateRoute> } />
                <Route path="/adminWallet" element={ <PrivateRoute> <AdminWallet /> </PrivateRoute> } />
                <Route path="/withdraw" element={ <PrivateRoute> <Withdraw /> </PrivateRoute> } />
                <Route path="/withdraw-amount" element={ <PrivateRoute> <SetWithdrawLimit /> </PrivateRoute> } />

                <Route path="/user" element={ <PrivateRoute> <UserManagement /> </PrivateRoute> } />
                <Route path="/category" element={ <PrivateRoute> <Category /> </PrivateRoute> } />

                <Route path="/category/add" element={ <PrivateRoute> <AddCategory /> </PrivateRoute> } />

                <Route path="/category/edit/:categoryId" element={ <PrivateRoute> <EditCategory /> </PrivateRoute> } />

                <Route path="/questions" element={ <PrivateRoute> <Questions /> </PrivateRoute> } />
                <Route path="/question/add" element={ <PrivateRoute> <AddQuestion /> </PrivateRoute> } />
                <Route path="/question/edit/:questionId" element={ <PrivateRoute> <EditQuestion /> </PrivateRoute> } />
                <Route path="/question/view/:questionId" element={ <PrivateRoute> <ViewQuestion /> </PrivateRoute> } />

                <Route path="/pages" element={ <PrivateRoute> <Pages /> </PrivateRoute> } />

                <Route id="pages-routes" path="/pages/:pageId" element={ <PrivateRoute> <PageEdit /> </PrivateRoute> } />

                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}
