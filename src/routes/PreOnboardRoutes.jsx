import React from 'react'
import { Route, Routes } from 'react-router-dom'
import AdminPreOnboarding from '../components/AdminPanel/AdminPreOnboarding/AdminPreOnboarding'
import OnboardExtendDateOverview from '../components/AdminPanel/AdminPreOnboarding/OnboardExtendDateOverview'
import CocMaster from '../components/AdminPanel/AdminPreOnboarding/CocMaster'
import CocOverview from '../components/AdminPanel/AdminPreOnboarding/CocOverview'
import NotificationHistory from '../components/AdminPanel/AdminPreOnboarding/NotificationHistory'
import CocUpdate from '../components/AdminPanel/AdminPreOnboarding/CocUpdate'
import CocHistory from '../components/AdminPanel/AdminPreOnboarding/CocHistory'
import LoginHistory from '../components/AdminPanel/AdminPreOnboarding/LoginHistory'
import PreOnboardVerifyDetails from '../components/AdminPanel/AdminPreOnboarding/PreOnboardVerifyDetails'
import PreOnboardingOverview from '../components/AdminPanel/AdminPreOnboarding/PreOnboardOverview.jsx'
import PreOnboardUserDetailsProfile from '../components/AdminPanel/AdminPreOnboarding/PreOnboardUserDetailsProfile'
import PreonboardingDocuments from '../components/AdminPanel/AdminPreOnboarding/AdminPreDocuments/PreonboardingDocuments'
import PreonboardingDocumentOverview from '../components/AdminPanel/AdminPreOnboarding/AdminPreDocuments/PreonboardingDocumentOverview'
import PreonboardingDocumentsUpdate from '../components/AdminPanel/AdminPreOnboarding/AdminPreDocuments/PreonboardingDocumentsUpdate'
import AnnouncementView from '../components/AdminPanel/Announcement/AnnouncementView'
import Reason from '../components/AdminPanel/HRMS/Reason/Reason'
import SubDepartmentOverview from '../components/AdminPanel/HRMS/Department/SubDepartmentOverview'
import SubDepartmentMaster from '../components/AdminPanel/HRMS/Department/SubDepartmentMaster'
import SubDepartmentUpdate from '../components/AdminPanel/HRMS/Department/SubDepartmentUpdate'
import AnnouncementPost from '../components/AdminPanel/Announcement/AnnoucementPost'

function PreOnboardRoutes({ contextData }) {
    return (
        <Routes>
            <Route
                path="/pre-onboarding"
                element={<AdminPreOnboarding />}
            />
            <Route
                path="/pre-onboard-extend-date-overview"
                element={<OnboardExtendDateOverview />}
            />
            <Route
                path="/pre-onboard-coc-master"
                element={<CocMaster />}
            />
            <Route
                path="/pre-onboard-coc-overview"
                element={<CocOverview />}
            />
            <Route
                path="/pre-onboard-all-notifications"
                element={<NotificationHistory />}
            />

            <Route
                path="/pre-onboard-coc-update/:id"
                element={<CocUpdate />}
            />
            <Route
                path="/pre-onboard-coc-history/:id"
                element={<CocHistory />}
            />
            <Route
                path="/pre-onboard-user-login-history"
                element={<LoginHistory />}
            />
            <Route
                path="/only-pre-onboard-user-data"
                element={<PreOnboardVerifyDetails />}
            />
            <Route
                path="/pre-onboarding-overview"
                element={<PreOnboardingOverview />}
            />
            <Route
                path="/preOnboard-user-details-profile/:id"
                element={<PreOnboardUserDetailsProfile />}
            />
            <Route
                path="/preonboarding-documents"
                element={<PreonboardingDocuments />}
            />
            <Route
                path="/preonboarding-documents-overview"
                element={<PreonboardingDocumentOverview />}
            />
            <Route
                path="/preonboarding-documents-update/:id"
                element={<PreonboardingDocumentsUpdate />}
            />
            <Route
                path="/announcement-post"
                element={<AnnouncementPost />}
            />
            <Route
                path="/announcement-view"
                element={<AnnouncementView />}
            />
            <Route path="/reason" element={<Reason />} />
            <Route
                path="/sub-department-overview"
                element={<SubDepartmentOverview />}
            />
            <Route
                path="/sub-department-master"
                element={<SubDepartmentMaster />}
            />
            <Route
                path="/sub-department-update/:id"
                element={<SubDepartmentUpdate />}
            />

        </Routes>
    )
}

export default PreOnboardRoutes