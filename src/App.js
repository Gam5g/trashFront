import React from "react";
import "./style.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // BrowserRouter 추가
import RegisterForm from "./container/pages/RegisterForm";
import MainForm from "./container/pages/MainForm";
import LoginForm from "./container/pages/LoginForm";
import WithdrawalForm from "./container/pages/WithdrawalForm";
import FindID from "./container/pages/FindID";
import FindPassword from "./container/pages/FindPassword";
import Station from "./container/pages/Station";
import SoultionCreate from "./container/pages/SolutionCreate";
import CommunityNanumUpdate from "./container/pages/Community/CommunityNanumUpdate";
import CommunityBunriUpdate from "./container/pages/Community/CommunityBunriUpdate";
import CommunityNanumList from "./container/pages/Community/CommunityNanumList";
import CommunityBunriList from "./container/pages/Community/CommunityBunriList";
import CommunityNanumWrite from "./container/pages/Community/CommunityNanumWrite";
import CommunityBunriWrite from "./container/pages/Community/CommunityBunriWrite";
import CommunityNanumDetail from "./container/pages/Community/CommunityNanumDetail";
import CommunityBunriDetail from "./container/pages/Community/CommunityBunriDetail";
import MyPageForm from "./container/pages/MyPageForm";
import MyPageUpdateForm from "./container/pages/MyPageUpdateForm";
import MyCommunityList from "./container/pages/MyCommunityList";
import BatteryForm from "./container/pages/BatteryForm";
import MedicineForm from "./container/pages/MedicineForm";
import SearchImageResultForm from "./container/pages/SearchImageResultForm";
import SearchDetailForm from "./container/pages/SearchDetailForm";
import SearchEditForm from "./container/pages/SearchEditForm";
import SwaggerDocs from "./SwaggerDocs";
import NotFound from "./container/pages/NotFound";
import Header from "./header";
import Loading from "./container/pages/LoadingForm";
import CategoriesList from "./container/pages/CategoriesList";
import AdminCreateRequestList from "./container/pages/AdminCreateRequestList";
import AdminUpdateRequestList from "./container/pages/AdminUpdateRequestList";
import AdminCreateRequestInfo from "./container/pages/AdminCreateRequestInfo";
import AdminUpdateRequestInfo from "./container/pages/AdminUpdateRequestInfo";
import UserCreateRequestList from "./container/pages/UserCreateRequestList";
import UserCreateRequestInfo from "./container/pages/UserCreateRequestInfo";
import UserUpdateRequestInfo from "./container/pages/UserUpdateRequestInfo";
import UserUpdateRequestList from "./container/pages/UserUpdateRequestList";
import SolutionTotalList from "./container/pages/SolutionTotalList";
import CategoriesSolutionList from "./container/pages/CategoriesSolutionList";
import SolutionDetailForm from "./container/pages/SolutionDetailForm";
import DaeguPolicy from "./container/pages/DaeguPolicy";
import RequestModifiedList from "./container/pages/UserUpdateRequestList";
import RequestCreateList from "./container/pages/UserCreateRequestList";
import RequestDetail from "./container/pages/RequestDetail";
import WikiDetailForm from "./container/pages/WikiDetailForm";
import { RecoilRoot } from "recoil";
import { isLoggedInState } from "./state/authState";
import ScrollTop from "./ScrollTop";

function App() {
  const initializeState = ({ set }) => {
    const accessToken = localStorage.getItem("accessToken");
    const isLoggedIn = !!accessToken;
    set(isLoggedInState, isLoggedIn);
  };
  return (
    <div className="container_body">
      <RecoilRoot initializeState={initializeState}>
        <Router>
          <Header />
          <ScrollTop />
          <Routes>
            <Route exact path="/" element={<MainForm />} />
            <Route
              path="/admin/create/request/list"
              element={<AdminCreateRequestList />}
            />
            <Route
              path="/admin/update/request/list"
              element={<AdminUpdateRequestList />}
            />
            <Route
              path="/admin/create/request/info/:wasteId"
              element={<AdminCreateRequestInfo />}
            />
            <Route
              path="/admin/update/request/info/:wikiId"
              element={<AdminUpdateRequestInfo />}
            />
            <Route path="/sign-up" element={<RegisterForm />} />
            <Route path="/sign-in" element={<LoginForm />} />
            <Route path="/withdrawal" element={<WithdrawalForm />} />
            <Route path="/find-id" element={<FindID />} />
            <Route path="/find-password" element={<FindPassword />} />
            <Route path="/station" element={<Station />} />
            <Route path="/search/result" element={<SearchImageResultForm />} />
            <Route path="/search" element={<SearchDetailForm />} />
            <Route path="/search/edit" element={<SearchEditForm />} />
            <Route path="/community-nanum" element={<CommunityNanumList />} />
            <Route path="/community-bunri" element={<CommunityBunriList />} />
            <Route path="/my-page" element={<MyPageForm />} />
            <Route path="/my-page/update" element={<MyPageUpdateForm />} />
            <Route path="/my-page/list" element={<MyCommunityList />} />
            <Route
              path="/my-page/request/modified-list"
              element={<RequestModifiedList />}
            />
            <Route
              path="/my-page/request/create-list"
              element={<RequestCreateList />}
            />
            <Route
              path="/my-page/request/:wasteId"
              element={<RequestDetail />}
            />
            <Route path="/categories" element={<CategoriesList />} />
            <Route
              path="/categories/things"
              element={<CategoriesSolutionList />}
            />
            <Route
              path="/solution/total/list"
              element={<SolutionTotalList />}
            />
            <Route
              path="solution/detail/:wasteId"
              element={<SolutionDetailForm />}
            />
            <Route path="/loading" element={<Loading />} />
            <Route
              path="/community-bunri/update"
              element={<CommunityBunriUpdate />}
            />
            <Route
              path="/community-nanum/update"
              element={<CommunityNanumUpdate />}
            />
            <Route
              path="/community-nanum/:id"
              element={<CommunityNanumDetail />}
            />
            <Route
              path="/community-bunri/:id"
              element={<CommunityBunriDetail />}
            />
            <Route
              path="/community-nanum/write"
              element={<CommunityNanumWrite />}
            />
            <Route
              path="/community-bunri/write"
              element={<CommunityBunriWrite />}
            />
            <Route
              path="/create/request/list"
              element={<UserCreateRequestList />}
            />
            <Route
              path="/create/request/info/:wasteId"
              element={<UserCreateRequestInfo />}
            />
            <Route path="/wiki/detail/:wikiId" element={<WikiDetailForm />} />
            <Route
              path="/update/request/list"
              element={<UserUpdateRequestList />}
            />
            <Route
              path="/update/request/info/:wikiId"
              element={<UserUpdateRequestInfo />}
            />

            <Route path="/solution/create" element={<SoultionCreate />} />
            <Route path="/battery" element={<BatteryForm />} />
            <Route path="/medicine" element={<MedicineForm />} />
            <Route path="/daegu-bunri-policy" element={<DaeguPolicy />} />
            <Route path="/search/not-found" element={<NotFound />} />
          </Routes>
        </Router>
        <SwaggerDocs />
      </RecoilRoot>
    </div>
  );
}

export default App;
